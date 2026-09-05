// ================================================================
// FIREBASE-LIVE.JS — Unified Realtime Cloud Service (Supabase & Firebase)
// ================================================================

class LiveBackendService {
  constructor() {
    this.backendType = getBackendType();
    this.sbClient = null;
    this.fbDb = null;
    this.isCloudConnected = false;
    this.connectionMode = 'initializing';
    this.meshChannel = null;

    this.reportListeners = [];
    this.alertListeners = [];
    this.statusListeners = [];

    this.reports = [];
    this.alerts = [];

    this.initMeshChannel();
    this.initCloudBackend();
  }

  // ---- Cross-tab BroadcastChannel & Local Cache Sync ----
  initMeshChannel() {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        this.meshChannel = new BroadcastChannel('geoshield_mesh_sync');
        this.meshChannel.onmessage = (event) => {
          this.handleMeshMessage(event.data);
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel notice:', e);
    }

    try {
      const storedReports = localStorage.getItem('geoshield_synced_reports');
      if (storedReports) {
        this.reports = JSON.parse(storedReports);
      } else if (typeof APP_DATA !== 'undefined' && APP_DATA.citizenReports) {
        this.reports = JSON.parse(JSON.stringify(APP_DATA.citizenReports));
      }

      const storedAlerts = localStorage.getItem('geoshield_synced_alerts');
      if (storedAlerts) {
        this.alerts = JSON.parse(storedAlerts);
      } else if (typeof APP_DATA !== 'undefined' && APP_DATA.alerts) {
        this.alerts = JSON.parse(JSON.stringify(APP_DATA.alerts));
      }
    } catch (e) {
      console.warn('Cache notice:', e);
    }
  }

  handleMeshMessage(data) {
    if (!data || !data.type) return;

    if (data.type === 'NEW_REPORT') {
      const exists = this.reports.some(r => r.id === data.payload.id);
      if (!exists) {
        this.reports.unshift(data.payload);
        this.persistLocalCache();
        this.notifyReportListeners(this.reports, { added: data.payload });
      }
    } else if (data.type === 'UPDATE_REPORT') {
      const idx = this.reports.findIndex(r => r.id === data.payload.id);
      if (idx !== -1) {
        this.reports[idx] = { ...this.reports[idx], ...data.payload };
        this.persistLocalCache();
        this.notifyReportListeners(this.reports, { updated: data.payload });
      }
    } else if (data.type === 'NEW_ALERT') {
      const exists = this.alerts.some(a => a.id === data.payload.id);
      if (!exists) {
        this.alerts.unshift(data.payload);
        this.persistLocalCache();
        this.notifyAlertListeners(this.alerts, { added: data.payload });
      }
    }
  }

  // ---- Initialize Backend: Supabase or Firebase ----
  async initCloudBackend() {
    this.backendType = getBackendType();

    // 1. Check Supabase
    if (this.backendType === 'supabase' && typeof window.supabase !== 'undefined') {
      const sbConfig = getSupabaseConfig();
      if (sbConfig.isCustom) {
        try {
          this.sbClient = window.supabase.createClient(sbConfig.url, sbConfig.key);
          await this.attachSupabaseListeners();
          return;
        } catch (err) {
          console.warn('Supabase initialization notice:', err.message);
        }
      }
    }

    // 2. Check Firebase
    if (typeof firebase !== 'undefined') {
      const fbConfig = getFirebaseConfig();
      if (fbConfig.isCustom) {
        try {
          let app = !firebase.apps.length ? firebase.initializeApp(fbConfig) : firebase.app();
          this.fbDb = firebase.firestore();
          this.attachFirebaseListeners(fbConfig);
          return;
        } catch (err) {
          console.warn('Firebase initialization notice:', err.message);
        }
      }
    }

    // 3. Fallback to Local Realtime Mesh
    this.setConnectionStatus('mesh', 'Realtime Mesh Sync (Connect Backend in Settings)');
  }

  // ---- Supabase Integration ----
  async attachSupabaseListeners() {
    if (!this.sbClient) return;

    // Fetch existing reports
    const { data: initialReports, error: repErr } = await this.sbClient
      .from('citizen_reports')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (!repErr && initialReports && initialReports.length > 0) {
      this.reports = initialReports;
      this.persistLocalCache();
      this.notifyReportListeners(this.reports);
    }

    // Fetch existing alerts
    const { data: initialAlerts, error: altErr } = await this.sbClient
      .from('emergency_alerts')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(30);

    if (!altErr && initialAlerts && initialAlerts.length > 0) {
      this.alerts = initialAlerts;
      this.persistLocalCache();
      this.notifyAlertListeners(this.alerts);
    }

    // Subscribe to Postgres Realtime Changes
    this.sbClient
      .channel('geoshield_realtime_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'citizen_reports' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const exists = this.reports.some(r => r.id === payload.new.id);
          if (!exists) {
            this.reports.unshift(payload.new);
            this.persistLocalCache();
            this.notifyReportListeners(this.reports, { added: payload.new });
          }
        } else if (payload.eventType === 'UPDATE') {
          const idx = this.reports.findIndex(r => r.id === payload.new.id);
          if (idx !== -1) {
            this.reports[idx] = { ...this.reports[idx], ...payload.new };
            this.persistLocalCache();
            this.notifyReportListeners(this.reports, { updated: payload.new });
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'emergency_alerts' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const exists = this.alerts.some(a => a.id === payload.new.id);
          if (!exists) {
            this.alerts.unshift(payload.new);
            this.persistLocalCache();
            this.notifyAlertListeners(this.alerts, { added: payload.new });
          }
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.isCloudConnected = true;
          this.setConnectionStatus('cloud', 'Live Supabase Realtime Connected');
        }
      });
  }

  // ---- Firebase Integration ----
  attachFirebaseListeners(fbConfig) {
    if (!this.fbDb) return;

    this.fbDb.collection('citizen_reports')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .onSnapshot((snapshot) => {
        this.isCloudConnected = true;
        this.setConnectionStatus('cloud', `Live Cloud Firestore (${fbConfig.projectId})`);

        if (!snapshot.empty) {
          const cloudReports = [];
          snapshot.forEach(doc => {
            cloudReports.push({ id: doc.id, ...doc.data() });
          });
          this.reports = cloudReports;
          this.persistLocalCache();
          this.notifyReportListeners(this.reports);
        }
      }, (error) => {
        console.warn('Firestore notice:', error.message);
        this.setConnectionStatus('mesh', 'Realtime Mesh Sync Active');
      });

    this.fbDb.collection('emergency_alerts')
      .orderBy('timestamp', 'desc')
      .limit(30)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          const cloudAlerts = [];
          snapshot.forEach(doc => {
            cloudAlerts.push({ id: doc.id, ...doc.data() });
          });
          this.alerts = cloudAlerts;
          this.persistLocalCache();
          this.notifyAlertListeners(this.alerts);
        }
      });
  }

  setConnectionStatus(mode, label) {
    this.connectionMode = mode;
    this.statusListeners.forEach(fn => fn(mode, label));
  }

  persistLocalCache() {
    try {
      localStorage.setItem('geoshield_synced_reports', JSON.stringify(this.reports));
      localStorage.setItem('geoshield_synced_alerts', JSON.stringify(this.alerts));
    } catch (e) {}
  }

  onReports(callback) {
    this.reportListeners.push(callback);
    if (this.reports.length > 0) callback(this.reports);
  }

  onAlerts(callback) {
    this.alertListeners.push(callback);
    if (this.alerts.length > 0) callback(this.alerts);
  }

  onStatus(callback) {
    this.statusListeners.push(callback);
    callback(this.connectionMode, this.isCloudConnected ? 'Live Cloud Backend Connected' : 'Local Realtime Mesh Active');
  }

  notifyReportListeners(reports, meta) {
    this.reportListeners.forEach(fn => {
      try { fn(reports, meta); } catch (e) {}
    });
  }

  notifyAlertListeners(alerts, meta) {
    this.alertListeners.forEach(fn => {
      try { fn(alerts, meta); } catch (e) {}
    });
  }

  // ---- Submit Citizen Report ----
  async submitCitizenReport(reportData) {
    const id = 'REP-' + Date.now().toString().slice(-6);
    const fullReport = {
      id,
      type: reportData.type || 'Flood',
      severity: reportData.severity || 'High',
      status: 'Pending',
      desc: reportData.desc || '',
      reporter: reportData.reporter || 'Citizen Reporter',
      phone: reportData.phone || '+91-Verified',
      location: reportData.location || 'Surat Coastal Sector',
      lat: Number(reportData.lat) || 21.17,
      lng: Number(reportData.lng) || 72.83,
      time: 'Just now',
      timestamp: Date.now(),
      upvotes: 1
    };

    this.reports.unshift(fullReport);
    this.persistLocalCache();
    this.notifyReportListeners(this.reports, { added: fullReport });

    if (this.meshChannel) {
      this.meshChannel.postMessage({ type: 'NEW_REPORT', payload: fullReport });
    }

    // Write to Supabase if connected
    if (this.sbClient) {
      try {
        await this.sbClient.from('citizen_reports').insert([fullReport]);
      } catch (err) {
        console.warn('Supabase insert notice:', err.message);
      }
    }

    // Write to Firebase if connected
    if (this.fbDb) {
      try {
        await this.fbDb.collection('citizen_reports').doc(id).set(fullReport);
      } catch (err) {
        console.warn('Firebase insert notice:', err.message);
      }
    }

    return fullReport;
  }

  // ---- Authority Verifies Report ----
  async verifyReport(reportId, officerNotes = '') {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return null;

    const updates = {
      id: reportId,
      status: 'Verified',
      officer_notes: officerNotes || 'Confirmed via GIS telemetry and Sentinel-2 anomaly.',
      officerNotes: officerNotes || 'Confirmed via GIS telemetry and Sentinel-2 anomaly.',
      verifiedAt: new Date().toLocaleTimeString(),
      verifiedTimestamp: Date.now()
    };

    Object.assign(report, updates);
    this.persistLocalCache();
    this.notifyReportListeners(this.reports, { updated: report });

    if (this.meshChannel) {
      this.meshChannel.postMessage({ type: 'UPDATE_REPORT', payload: updates });
    }

    if (this.sbClient) {
      try {
        await this.sbClient.from('citizen_reports').update({ status: 'Verified', officer_notes: updates.officer_notes }).eq('id', reportId);
      } catch (err) {}
    }

    if (this.fbDb) {
      try {
        await this.fbDb.collection('citizen_reports').doc(reportId).set(updates, { merge: true });
      } catch (err) {}
    }

    // Generate Emergency Alert
    const newAlert = {
      id: 'ALT-' + Date.now().toString().slice(-4),
      level: report.severity === 'Critical' ? 'CRITICAL' : 'HIGH',
      type: report.type,
      title: `VERIFIED CITIZEN ALERT: ${report.type} at ${report.desc.slice(0, 30)}...`,
      message: `${report.desc} — Verified by Authority Incident Response Commander.`,
      time: 'Just now',
      timestamp: Date.now(),
      area: `Vicinity coordinates [${report.lat.toFixed(2)}, ${report.lng.toFixed(2)}]`,
      confidence: 96,
      sources: ['Citizen Verified', 'NDRF Dispatch', 'Satellite Radar'],
      active: true
    };

    await this.broadcastEmergencyAlert(newAlert);
    return report;
  }

  // ---- Authority Dismisses Report ----
  async rejectReport(reportId, reason = '') {
    const report = this.reports.find(r => r.id === reportId);
    if (!report) return null;

    const updates = {
      id: reportId,
      status: 'Rejected',
      rejectionReason: reason || 'Unsubstantiated condition; dismissed after drone inspection.',
      dismissedAt: new Date().toLocaleTimeString()
    };

    Object.assign(report, updates);
    this.persistLocalCache();
    this.notifyReportListeners(this.reports, { updated: report });

    if (this.meshChannel) {
      this.meshChannel.postMessage({ type: 'UPDATE_REPORT', payload: updates });
    }

    if (this.sbClient) {
      try {
        await this.sbClient.from('citizen_reports').update({ status: 'Rejected' }).eq('id', reportId);
      } catch (err) {}
    }

    if (this.fbDb) {
      try {
        await this.fbDb.collection('citizen_reports').doc(reportId).set(updates, { merge: true });
      } catch (err) {}
    }

    return report;
  }

  // ---- Broadcast Emergency Alert ----
  async broadcastEmergencyAlert(alertData) {
    const alertId = alertData.id || ('ALT-' + Date.now().toString().slice(-4));
    const fullAlert = {
      id: alertId,
      level: alertData.level || 'CRITICAL',
      type: alertData.type || 'Emergency Broadcast',
      title: alertData.title || 'REGIONAL EMERGENCY BROADCAST',
      message: alertData.message || alertData.desc || 'Immediate caution advised.',
      time: alertData.time || 'Just now',
      timestamp: alertData.timestamp || Date.now(),
      area: alertData.area || 'All Active Hazard Zones',
      confidence: alertData.confidence || 95,
      sources: alertData.sources || ['Authority Command Center', 'IMD Doppler Radar'],
      active: true
    };

    this.alerts.unshift(fullAlert);
    this.persistLocalCache();
    this.notifyAlertListeners(this.alerts, { added: fullAlert });

    if (this.meshChannel) {
      this.meshChannel.postMessage({ type: 'NEW_ALERT', payload: fullAlert });
    }

    if (this.sbClient) {
      try {
        await this.sbClient.from('emergency_alerts').insert([fullAlert]);
      } catch (err) {}
    }

    if (this.fbDb) {
      try {
        await this.fbDb.collection('emergency_alerts').doc(alertId).set(fullAlert);
      } catch (err) {}
    }

    return fullAlert;
  }

  // ---- Seed Data ----
  async seedCloudReports() {
    const initialReports = (typeof APP_DATA !== 'undefined' && APP_DATA.citizenReports)
      ? APP_DATA.citizenReports
      : [];

    const initialAlerts = (typeof APP_DATA !== 'undefined' && APP_DATA.alerts)
      ? APP_DATA.alerts
      : [];

    if (this.sbClient) {
      try {
        await this.sbClient.from('citizen_reports').upsert(initialReports);
        await this.sbClient.from('emergency_alerts').upsert(initialAlerts);
        console.log('Seeded Supabase database.');
      } catch (e) {}
    }

    if (this.fbDb) {
      try {
        const batch = this.fbDb.batch();
        initialReports.forEach(rep => {
          const ref = this.fbDb.collection('citizen_reports').doc(rep.id);
          batch.set(ref, { ...rep, timestamp: Date.now() }, { merge: true });
        });
        await batch.commit();
      } catch (e) {}
    }
  }
}

// Global Singleton Instance
window.firebaseLive = new LiveBackendService();
