// ================================================================
// FIREBASE-MODAL.JS — Fast Cloud Backend Connect Modal (Supabase & Firebase)
// ================================================================

function initFirebaseStatusUI() {
  if (!document.getElementById('firebase-settings-modal')) {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'firebase-settings-modal';
    modalDiv.className = 'modal-overlay';
    modalDiv.style.zIndex = '10001';
    modalDiv.innerHTML = `
      <div class="modal-box" style="max-width:540px; border:1px solid rgba(56,189,248,0.3); box-shadow:0 20px 50px rgba(0,0,0,0.85), 0 0 35px rgba(56,189,248,0.2);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="font-size:24px;">⚡</div>
            <div>
              <h3 style="font-size:16px; font-weight:700; color:#f1f5f9; margin:0;">Live Cloud Backend Setup</h3>
              <p style="font-size:11px; color:#94a3b8; margin:2px 0 0 0;">Connect Supabase Realtime or Firebase Firestore</p>
            </div>
          </div>
          <button id="firebase-modal-close" style="background:none; border:none; color:#94a3b8; font-size:24px; cursor:pointer; line-height:1;">&times;</button>
        </div>

        <!-- Live Status Bar -->
        <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; align-items:center; justify-content:space-between;">
          <div>
            <div style="font-size:10px; color:var(--text-muted, #94a3b8); text-transform:uppercase; letter-spacing:0.5px;">Active Engine</div>
            <div id="fb-modal-engine-label" style="font-size:12px; font-weight:700; color:#12d67d; margin-top:2px;">Detecting…</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:10px; color:var(--text-muted, #94a3b8);">Synced Records</div>
            <div id="fb-modal-record-counts" style="font-size:12px; font-weight:600; color:#38bdf8;">-- Reports | -- Alerts</div>
          </div>
        </div>

        <!-- Backend Selector Tabs -->
        <div style="display:flex; gap:8px; margin-bottom:14px; background:rgba(0,0,0,0.3); padding:4px; border-radius:8px;">
          <button id="tab-btn-supabase" style="flex:1; padding:8px; border-radius:6px; border:none; background:#10b981; color:#fff; font-weight:700; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
            <span>⚡</span> Supabase (Fastest)
          </button>
          <button id="tab-btn-firebase" style="flex:1; padding:8px; border-radius:6px; border:none; background:transparent; color:#94a3b8; font-weight:600; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:6px;">
            <span>🔥</span> Firebase
          </button>
        </div>

        <!-- Supabase Form -->
        <div id="panel-supabase" style="display:block;">
          <div style="font-size:11px; color:#cbd5e1; margin-bottom:10px; line-height:1.4;">
            Paste your <strong>Supabase Project URL & Anon Key</strong> from <a href="https://supabase.com/dashboard" target="_blank" style="color:#38bdf8;">supabase.com/dashboard</a> &rarr; Settings &rarr; API:
          </div>
          <div class="form-group" style="margin-bottom:8px;">
            <label class="form-label" style="font-size:11px; color:#e2e8f0;">Supabase Project URL</label>
            <input type="url" id="sb-url-input" class="input-field" placeholder="https://xxxxxxxx.supabase.co" style="font-size:12px; font-family:monospace; background:#070b13;">
          </div>
          <div class="form-group" style="margin-bottom:12px;">
            <label class="form-label" style="font-size:11px; color:#e2e8f0;">Supabase Anon Public Key</label>
            <input type="text" id="sb-key-input" class="input-field" placeholder="eyJhbGciOiJIUzI1NiIsIn..." style="font-size:12px; font-family:monospace; background:#070b13;">
          </div>
          <div style="background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); border-radius:6px; padding:8px 10px; font-size:11px; color:#6ee7b7; margin-bottom:12px;">
            💡 <em>Tables needed:</em> Run <a href="/supabase-schema.sql" target="_blank" style="color:#a7f3d0; text-decoration:underline;">supabase-schema.sql</a> in your Supabase SQL Editor to enable tables and live realtime publication with 1 click!
          </div>
          <div style="display:flex; gap:8px;">
            <button id="sb-save-btn" class="btn btn-primary" style="flex:2; padding:10px; font-size:12px; background:#10b981; border-color:#059669;">
              ⚡ Connect Supabase Live
            </button>
            <button id="sb-clear-btn" class="btn btn-glass" style="flex:1; padding:10px; font-size:12px; color:#f87171;">
              ↺ Disconnect
            </button>
          </div>
        </div>

        <!-- Firebase Form -->
        <div id="panel-firebase" style="display:none;">
          <div style="font-size:11px; color:#cbd5e1; margin-bottom:10px;">
            Paste your <strong>Firebase Web Config</strong> JSON from <a href="https://console.firebase.google.com" target="_blank" style="color:#f59e0b;">Firebase Console</a>:
          </div>
          <div class="form-group" style="margin-bottom:12px;">
            <textarea id="fb-custom-config-input" class="input-field" rows="6" style="font-family:monospace; font-size:11px; background:#070b13; color:#a5f3fc;" placeholder='{\n  "apiKey": "...",\n  "projectId": "..."\n}'></textarea>
          </div>
          <div style="display:flex; gap:8px;">
            <button id="fb-save-config-btn" class="btn btn-primary" style="flex:2; padding:10px; font-size:12px;">
              💾 Connect Firebase Cloud
            </button>
            <button id="fb-reset-btn" class="btn btn-glass" style="flex:1; padding:10px; font-size:12px; color:#f87171;">
              ↺ Disconnect
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modalDiv);

    // Bind Close
    document.getElementById('firebase-modal-close').addEventListener('click', () => modalDiv.classList.remove('active'));
    modalDiv.addEventListener('click', (e) => { if (e.target === modalDiv) modalDiv.classList.remove('active'); });

    // Tab Switching
    const tabSb = document.getElementById('tab-btn-supabase');
    const tabFb = document.getElementById('tab-btn-firebase');
    const panelSb = document.getElementById('panel-supabase');
    const panelFb = document.getElementById('panel-firebase');

    tabSb.addEventListener('click', () => {
      tabSb.style.background = '#10b981';
      tabSb.style.color = '#fff';
      tabFb.style.background = 'transparent';
      tabFb.style.color = '#94a3b8';
      panelSb.style.display = 'block';
      panelFb.style.display = 'none';
    });

    tabFb.addEventListener('click', () => {
      tabFb.style.background = '#f59e0b';
      tabFb.style.color = '#fff';
      tabSb.style.background = 'transparent';
      tabSb.style.color = '#94a3b8';
      panelFb.style.display = 'block';
      panelSb.style.display = 'none';
    });

    // Populate Supabase inputs
    const sbCfg = getSupabaseConfig();
    if (sbCfg.isCustom) {
      document.getElementById('sb-url-input').value = sbCfg.url;
      document.getElementById('sb-key-input').value = sbCfg.key;
    }

    // Save Supabase
    document.getElementById('sb-save-btn').addEventListener('click', () => {
      const url = document.getElementById('sb-url-input').value.trim();
      const key = document.getElementById('sb-key-input').value.trim();
      if (!url || !key) {
        alert('Please enter both your Supabase URL and Anon Key.');
        return;
      }
      saveSupabaseConfig(url, key);
      alert('Supabase credentials saved! Connecting to live PostgreSQL Realtime…');
      window.location.reload();
    });

    document.getElementById('sb-clear-btn').addEventListener('click', () => {
      if (confirm('Disconnect Supabase and switch back to mesh sync?')) {
        saveSupabaseConfig(null, null);
        window.location.reload();
      }
    });

    // Populate Firebase inputs
    const fbCfg = getFirebaseConfig();
    document.getElementById('fb-custom-config-input').value = JSON.stringify({
      apiKey: fbCfg.apiKey,
      authDomain: fbCfg.authDomain,
      projectId: fbCfg.projectId,
      storageBucket: fbCfg.storageBucket
    }, null, 2);

    // Save Firebase
    document.getElementById('fb-save-config-btn').addEventListener('click', () => {
      try {
        const raw = document.getElementById('fb-custom-config-input').value.trim();
        const parsed = JSON.parse(raw);
        if (!parsed.apiKey || !parsed.projectId) {
          alert('Please include both apiKey and projectId.');
          return;
        }
        saveFirebaseConfig(parsed);
        alert('Firebase credentials saved! Connecting to Firestore…');
        window.location.reload();
      } catch (err) {
        alert('Invalid JSON format.');
      }
    });

    document.getElementById('fb-reset-btn').addEventListener('click', () => {
      if (confirm('Disconnect Firebase?')) {
        saveFirebaseConfig(null);
        window.location.reload();
      }
    });
  }

  // Hook listeners
  if (window.firebaseLive) {
    window.firebaseLive.onStatus((mode, label) => updateBadgeUI(mode, label));
    window.firebaseLive.onReports(() => updateCountsUI());
    window.firebaseLive.onAlerts(() => updateCountsUI());
  }
}

function updateBadgeUI(mode, label) {
  const badge = document.getElementById('firebase-live-badge');
  const engineLabel = document.getElementById('fb-modal-engine-label');

  const isCloud = mode === 'cloud';
  const color = isCloud ? '#12d67d' : '#38bdf8';
  const icon = isCloud ? '🟢' : '⚡';
  const shortText = isCloud ? 'Backend Live' : 'Live Sync Active';

  if (badge) {
    badge.innerHTML = `<span style="font-size:10px;">${icon}</span> <span>${shortText}</span>`;
    badge.title = `Backend: ${label}. Click to configure.`;
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFirebaseStatusUI);
} else {
  initFirebaseStatusUI();
}
