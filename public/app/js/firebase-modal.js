// ================================================================
// FIREBASE-MODAL.JS — Live Database Status & In-App Config Modal
// ================================================================

function initFirebaseStatusUI() {
  // 1. Inject Firebase Config Modal into DOM if not present
  if (!document.getElementById('firebase-settings-modal')) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'firebase-settings-modal';
    modalDiv.className = 'modal-overlay';
    modalDiv.style.zIndex = '10001';
    modalDiv.innerHTML = `
      <div class="modal-box" style="max-width:520px; border:1px solid rgba(255,107,0,0.3); box-shadow:0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(255,107,0,0.15);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="font-size:24px;">🔥</div>
            <div>
              <h3 style="font-size:16px; font-weight:700; color:#f1f5f9; margin:0;">Firebase Live Database Settings</h3>
              <p style="font-size:11px; color:#94a3b8; margin:2px 0 0 0;">Multi-device real-time sync for hazards, reports & alerts</p>
            </div>
          </div>
          <button id="firebase-modal-close" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Status Card -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 14px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:11px; color:var(--text-muted, #94a3b8); text-transform:uppercase; letter-spacing:0.5px;">Current Engine</div>
            <div id="fb-modal-engine-label" style="font-size:13px; font-weight:700; color:#12d67d; margin-top:2px;">Connecting…</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px; color:var(--text-muted, #94a3b8);">Synced Records</div>
            <div id="fb-modal-record-counts" style="font-size:12px; font-weight:600; color:#38bdf8;">-- Reports | -- Alerts</div>
          </div>
        </div>

        <div style="font-size:12px; color:#cbd5e1; line-height:1.5; margin-bottom:12px;">
          GeoShield automatically synchronizes citizen disaster reports and emergency alerts in real-time across devices. You can paste your own <strong>Firebase Firestore Web Config</strong> below to connect to your personal Firebase cloud project.
        </div>

        <div class="form-group" style="margin-bottom:14px;">
          <label class="form-label" style="font-size:12px; font-weight:600; color:#e2e8f0; display:flex; justify-content:space-between;">
            <span>Firebase Config (JSON format)</span>
            <span style="font-size:10px; color:#f59e0b;">Get from Firebase Console &rarr; Web App</span>
          </label>
          <textarea id="fb-custom-config-input" class="input-field" rows="6" style="font-family:monospace; font-size:11px; background:#070b13; color:#a5f3fc;" placeholder='{\n  "apiKey": "AIzaSy...",\n  "projectId": "your-project-id",\n  "authDomain": "...",\n  "storageBucket": "..."\n}'></textarea>
        </div>

        <div style="display:flex; gap:8px; margin-top:16px;">
          <button id="fb-save-config-btn" class="btn btn-primary" style="flex:2; padding:10px; font-size:12px;">
            💾 Save & Connect Cloud
          </button>
          <button id="fb-seed-btn" class="btn btn-glass" style="flex:1.4; padding:10px; font-size:12px; color:#38bdf8; border-color:rgba(56,189,248,0.3);">
            🌱 Seed Scenarios
          </button>
          <button id="fb-reset-btn" class="btn btn-glass" style="flex:1; padding:10px; font-size:12px; color:#f87171;">
            ↺ Reset
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);

    // Bind Close events
    document.getElementById('firebase-modal-close').addEventListener('click', () => {
      modalDiv.classList.remove('active');
    });
    modalDiv.addEventListener('click', (e) => {
      if (e.target === modalDiv) modalDiv.classList.remove('active');
    });

    // Populate current config in textarea
    const cfg = getFirebaseConfig();
    const configToDisplay = {
      apiKey: cfg.apiKey,
      authDomain: cfg.authDomain,
      projectId: cfg.projectId,
      storageBucket: cfg.storageBucket,
      messagingSenderId: cfg.messagingSenderId,
      appId: cfg.appId
    };
    document.getElementById('fb-custom-config-input').value = JSON.stringify(configToDisplay, null, 2);

    // Save Button Handler
    document.getElementById('fb-save-config-btn').addEventListener('click', () => {
      try {
        const raw = document.getElementById('fb-custom-config-input').value.trim();
        const parsed = JSON.parse(raw);
        if (!parsed.apiKey || !parsed.projectId) {
          alert('Please ensure both apiKey and projectId are present in the JSON.');
          return;
        }
        saveFirebaseConfig(parsed);
        alert('Firebase configuration saved! Reloading to establish cloud link…');
        window.location.reload();
      } catch (err) {
        alert('Invalid JSON format. Please verify your Firebase config object.');
      }
    });

    // Seed Button Handler
    document.getElementById('fb-seed-btn').addEventListener('click', async () => {
      const btn = document.getElementById('fb-seed-btn');
      btn.textContent = 'Seeding…';
      btn.disabled = true;
      if (window.firebaseLive) {
        await window.firebaseLive.seedCloudReports();
        alert('Initial disaster hazards, reports, and regional alerts seeded to database!');
      }
      btn.textContent = '🌱 Seed Scenarios';
      btn.disabled = false;
    });

    // Reset Button Handler
    document.getElementById('fb-reset-btn').addEventListener('click', () => {
      if (confirm('Reset to default mesh sync settings?')) {
        saveFirebaseConfig(null);
        window.location.reload();
      }
    });
  }

  // 2. Setup Real-time Status Badge Hook
  if (window.firebaseLive) {
    window.firebaseLive.onStatus((mode, label) => {
      updateBadgeUI(mode, label);
    });

    // Update counts whenever data changes
    window.firebaseLive.onReports((reports) => {
      updateCountsUI();
    });
    window.firebaseLive.onAlerts((alerts) => {
      updateCountsUI();
    });
  }
}

function updateBadgeUI(mode, label) {
  const badge = document.getElementById('firebase-live-badge');
  const engineLabel = document.getElementById('fb-modal-engine-label');

  const isCloud = mode === 'cloud';
  const color = isCloud ? '#12d67d' : '#38bdf8';
  const icon = isCloud ? '🟢' : '⚡';
  const shortText = isCloud ? 'Firebase Live' : 'Live Sync Mesh';

  if (badge) {
    badge.innerHTML = `<span style="font-size:10px;">${icon}</span> <span>${shortText}</span>`;
    badge.title = `Database Status: ${label}. Click to configure Firebase.`;
    badge.style.borderColor = isCloud ? 'rgba(18, 214, 125, 0.4)' : 'rgba(56, 189, 248, 0.4)';
    badge.style.color = color;
  }

  if (engineLabel) {
    engineLabel.textContent = label;
    engineLabel.style.color = color;
  }
}

function updateCountsUI() {
  const countEl = document.getElementById('fb-modal-record-counts');
  if (countEl && window.firebaseLive) {
    const repCount = window.firebaseLive.reports ? window.firebaseLive.reports.length : 0;
    const altCount = window.firebaseLive.alerts ? window.firebaseLive.alerts.length : 0;
    countEl.textContent = `${repCount} Reports | ${altCount} Alerts`;
  }
}

function openFirebaseModal() {
  const modal = document.getElementById('firebase-settings-modal');
  if (modal) {
    modal.classList.add('active');
    updateCountsUI();
  }
}

// Auto-initialize when script executes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFirebaseStatusUI);
} else {
  initFirebaseStatusUI();
}
