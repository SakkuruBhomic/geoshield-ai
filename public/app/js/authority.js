// ================================================================
// AUTHORITY.JS — Command Dashboard, Analytics, & AI Explanation Panel
// ================================================================

let authMapInstance = null;
let riskChart = null;

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initSidebar();
  initCommandCenter();
  initAnalyticsChart();
  renderVerificationQueue();
  updateAIExplanation('command');

  // Real-time synchronization with Firebase Live
  if (window.firebaseLive) {
    window.firebaseLive.onReports((reports, meta) => {
      renderVerificationQueue();
      if (meta && meta.added) {
        showToast(`🚨 Live citizen report received: ${meta.added.type} in ${meta.added.location || 'hazard sector'}!`, 'warning');
        playIncomingReportChime();
      }
    });
  }
});

// ---- Live Clock ----
function initLiveClock() {
  const clockEl = document.getElementById('live-time');
  function update() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' | ' +
                            now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }) + ' IST';
    }
  }
  update();
  setInterval(update, 1000);
}

// ---- Sidebar Toggle & Nav ----
function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '➔' : '⬅';
    });
  }

  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      if (!view) return;
      document.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      switchView(view);
    });
  });
}

// ---- Switch Main Content Views ----
function switchView(viewKey) {
  const views = ['command', 'map-view', 'hazards', 'habitations', 'safesites', 'alerts', 'analytics', 'datasources'];
  views.forEach(v => {
    const el = document.getElementById('view-' + v);
    if (el) el.style.display = 'none';
  });

  const target = document.getElementById('view-' + viewKey);
  if (target) {
    target.style.display = 'block';
  }

  const titleMap = {
    'command': 'Operational Command Center',
    'map-view': 'Live Multi-Hazard GIS Risk Map',
    'hazards': 'Hazard Intelligence & Real-Time Sensors',
    'habitations': 'Vulnerable Habitations & Red Zones',
    'safesites': 'Safe Shelters & Carrying Capacity',
    'alerts': 'Incident Verification & Regional Alert Queue',
    'analytics': 'Advanced Risk Analytics & Contribution Trends',
    'datasources': 'Integrated Satellite & Multi-Agency Sensor Feeds'
  };

  document.getElementById('topbar-view-title').textContent = titleMap[viewKey] || 'Operations';
  updateAIExplanation(viewKey);

  // Initialize authority map if map view is selected
  if (viewKey === 'map-view' && !authMapInstance) {
    setTimeout(() => {
      authMapInstance = new DisasterMap('authority-map');
    }, 100);
  } else if (viewKey === 'map-view' && authMapInstance) {
    setTimeout(() => {
      authMapInstance.getMap().invalidateSize();
    }, 100);
  }
}

// ---- Command Center KPIs & Alerts ----
function initCommandCenter() {
  // Populate alert feed in command dashboard
  const feed = document.getElementById('command-alert-feed');
  if (!feed) return;
  feed.innerHTML = '';

  APP_DATA.alerts.slice(0, 5).forEach(alert => {
    const item = document.createElement('div');
    const levelClass = alert.level.toLowerCase();
    item.className = `alert-item ${levelClass}`;
    item.innerHTML = `
      <span class="alert-level-dot ${levelClass}"></span>
      <div class="alert-item-body">
        <div class="alert-item-title">${alert.title}</div>
        <div class="alert-item-meta">
          <span>${alert.area}</span> &bull; 
          <span>Confidence: <strong class="alert-conf">${alert.confidence}%</strong></span> &bull;
          <span style="color:var(--text-muted);">Sources: ${alert.sources.join(', ')}</span>
        </div>
      </div>
      <div class="alert-item-time">${alert.time}</div>
    `;
    item.addEventListener('click', () => {
      showToast(`Reviewing telemetry for ${alert.title}`, 'info');
    });
    feed.appendChild(item);
  });
}

// Synthesize audio chime for incoming citizen reports
function playIncomingReportChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

// ---- Verification Queue for Citizen Reports ----
function renderVerificationQueue() {
  const container = document.getElementById('verification-queue');
  const pending = reportManager.getPendingReports();

  // Dynamically update sidebar queue badge
  const badge = document.getElementById('sidebar-queue-badge');
  if (badge) {
    badge.textContent = pending.length;
    badge.style.display = pending.length > 0 ? 'inline-block' : 'none';
  }

  if (!container) return;
  container.innerHTML = '';

  if (pending.length === 0) {
    container.innerHTML = '<div style="color:var(--text-muted); font-size:13px; text-align:center; padding:20px;">No pending citizen incident reports requiring human verification.</div>';
    return;
  }

  pending.forEach(rep => {
    const card = document.createElement('div');
    card.className = 'report-item';
    card.id = 'report-card-' + rep.id;
    card.innerHTML = `
      <div class="report-item-header">
        <span class="report-type-badge">${rep.type}</span>
        <span class="risk-badge risk-${rep.severity === 'High' ? 'orange' : rep.severity === 'Critical' ? 'red' : 'yellow'}">${rep.severity}</span>
        <span style="font-size:12px; color:var(--text-secondary); font-weight:600;">Reported by: ${rep.reporter} (${rep.phone})</span>
        <span class="report-time">${rep.time || 'Live'}</span>
      </div>
      <div class="report-desc">${rep.desc}</div>
      <div style="font-size:11px; color:#38bdf8; margin-bottom:10px;">
        🛰️ Satellite Check: Cloud reflectivity matched &bull; Sensor Anomaly +1.4σ &bull; Duplicate Clusters: 1
      </div>
      <div class="report-actions">
        <button class="btn-verify" onclick="handleVerifyReport('${rep.id}')">
          ✓ Confirm & Generate Regional Alert
        </button>
        <button class="btn-investigate" onclick="handleInvestigateReport('${rep.id}')">
          🔍 Deploy Drone / Ground Team
        </button>
        <button class="btn-reject" onclick="handleRejectReport('${rep.id}')">
          ✕ Dismiss / False Alarm
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function handleVerifyReport(id) {
  const verified = reportManager.verifyReport(id);
  if (verified) {
    showToast(`Report ${id} verified! Regional Emergency Alert pushed to all citizens in 15km radius.`, 'success');
    renderVerificationQueue();
    initCommandCenter();
    updateAIExplanation('alerts');
  }
}

function handleRejectReport(id) {
  reportManager.rejectReport(id);
  showToast(`Report ${id} dismissed. Citizen credibility rating adjusted.`, 'warning');
  renderVerificationQueue();
}

function handleInvestigateReport(id) {
  showToast(`Tasked NDRF Drone Recon unit to GPS coordinates of ${id}.`, 'info');
}

// ---- AI Explanation Panel Assistant ----
function updateAIExplanation(contextKey) {
  const panel = document.getElementById('ai-explanation-text');
  const title = document.getElementById('ai-explanation-sub');
  if (!panel) return;

  const explanations = {
    'command': {
      sub: 'Real-Time Operational Assessment',
      html: `
        <div class="ai-message">
          <strong>Synthesized Situation:</strong> Category-3 <strong>Cyclone Vayu</strong> exhibits a central pressure of 968 hPa with steady eastward trajectory toward <strong>Surat Coastal Sector</strong>.
        </div>
        <div class="ai-message">
          <strong>Why Red Zone?</strong> High astronomical tides coincided with 2.8m storm surge, classifying Olpad & Hazira as <span class="highlight">CRITICAL EVACUATION PRIORITY</span>.
        </div>
        <div class="ai-message">
          <strong>Action Recommendation:</strong> 14,200 citizens remain in vulnerable floodable habitations. Recommend triggering mandatory phase-2 evacuation to <strong>Surat Relief Camp A</strong>.
        </div>
        <div class="ai-source-tags">
          <span class="ai-source-tag">IMD Doppler</span>
          <span class="ai-source-tag">ISRO INSAT-3DR</span>
          <span class="ai-source-tag">CWC Surge Model</span>
        </div>
      `
    },
    'map-view': {
      sub: 'GIS Risk Topology Interpretation',
      html: `
        <div class="ai-message">
          <strong>Spatial Pattern Analysis:</strong> Two active high-severity clusters detected: (1) Coastal Gujarat maritime interface, and (2) Brahmaputra Lower Basin (Assam).
        </div>
        <div class="ai-message">
          <strong>Safe Site Buffer:</strong> 7 designated safe sites currently have <span class="safe">52% remaining capacity</span>. The nearest evacuation corridor (SH-168) is clear of waterlogging.
        </div>
      `
    },
    'hazards': {
      sub: 'Multi-Source Threat Evaluation',
      html: `
        <div class="ai-message">
          <strong>False Alarm Prevention:</strong> Multi-sensor cross check validates Cyclone Vayu with <strong>91% confidence (±4% uncertainty)</strong>. Cloudburst warning in HP evaluated from combined radar + thermal anomaly.
        </div>
      `
    },
    'habitations': {
      sub: 'Vulnerability & Relocation Ranking',
      html: `
        <div class="ai-message">
          <strong>Priority Ranking:</strong> <strong>Olpad (18,200 pop)</strong> and <strong>Majuli (16,700 pop)</strong> exhibit highest composite vulnerability indices (0.89 and 0.94) due to single-access road cut-off risks.
        </div>
      `
    },
    'safesites': {
      sub: 'Shelter Carrying Capacity Analysis',
      html: `
        <div class="ai-message">
          <strong>Carrying Capacity:</strong> <strong>Guwahati Evacuation Hub</strong> is at <span class="highlight">77% occupancy</span>. Incoming evacuees should be diverted to Jorhat Relief Center to prevent overcrowding.
        </div>
      `
    },
    'alerts': {
      sub: 'Human Verification Assistant',
      html: `
        <div class="ai-message">
          <strong>Crowdsource Intelligence:</strong> 3 citizen reports currently cross-referenced against satellite radar. Report <strong>REP002 (Bridge damage on NH-27)</strong> has 7 upvotes and high spatial probability.
        </div>
      `
    },
    'analytics': {
      sub: 'Analytical Contribution & Historical Variance',
      html: `
        <div class="ai-message">
          <strong>Contribution Factor:</strong> Extreme precipitation accounts for <strong>64%</strong> of the current aggregate national disaster risk index, followed by cyclonic wind pressure at <strong>26%</strong>.
        </div>
      `
    },
    'datasources': {
      sub: 'Telemetry Health & Sensor Status',
      html: `
        <div class="ai-message">
          <strong>Data Pipeline Health:</strong> 5 of 5 national feeds active with zero latency packet loss. Last satellite sweep completed 4 minutes ago.
        </div>
      `
    }
  };

  const exp = explanations[contextKey] || explanations['command'];
  title.textContent = exp.sub;
  panel.innerHTML = exp.html;
}

// ---- Chart.js Multi-Risk Analytics ----
function initAnalyticsChart() {
  const ctx = document.getElementById('riskChart');
  if (!ctx) return;

  const data = APP_DATA.multiRiskBreakdown;
  riskChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.labels,
      datasets: [
        {
          label: 'Population at Risk (x1,000)',
          data: data.affected.map(v => v / 1000),
          backgroundColor: 'rgba(59, 130, 246, 0.65)',
          borderColor: '#3b82f6',
          borderWidth: 1,
          borderRadius: 6
        },
        {
          label: 'Composite Severity Score (0-10)',
          data: data.riskScores,
          backgroundColor: 'rgba(239, 68, 68, 0.65)',
          borderColor: '#ef4444',
          borderWidth: 1,
          borderRadius: 6,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } },
          title: { display: true, text: 'Population Affected (k)', color: '#94a3b8' }
        },
        y1: {
          position: 'right',
          grid: { drawOnChartArea: false },
          ticks: { color: '#ef4444', font: { family: 'Inter', size: 11 } },
          min: 0,
          max: 10,
          title: { display: true, text: 'Severity (0-10)', color: '#ef4444' }
        }
      }
    }
  });
}
