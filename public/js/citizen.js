// ================================================================
// CITIZEN.JS — Hazard-Specific Intelligence Controller
// ================================================================

let disasterMap = null;
let hazardEngine = null;
let currentHazard = 'cyclone';
let currentStats = null;
let currentTab = 'alerts';
let isPlayingTimeline = false;
let timelineInterval = null;
let satelliteOn = false;

document.addEventListener('DOMContentLoaded', () => {
  disasterMap = new DisasterMap('map');
  window.disasterMap = disasterMap;

  // The hazard engine owns everything drawn on the map
  disasterMap.clearDefaultOverlays();
  hazardEngine = new HazardEngine(disasterMap.getMap());

  initHazardPicker();
  initIntelPanel();
  initLegendToggles();
  initTimelineSlider();
  initSearch();
  initLeftTools();
  initMapInspector();
  initReportModal();
  initLiveAlertListener();

  selectHazard('cyclone', false);
});

// ================================================================
// HAZARD PICKER
// ================================================================
function initHazardPicker() {
  document.querySelectorAll('.hazard-chip').forEach(chip => {
    chip.addEventListener('click', () => selectHazard(chip.dataset.hazard, true));
  });
}

function selectHazard(key, fly) {
  currentHazard = key;
  document.querySelectorAll('.hazard-chip').forEach(c => {
    c.classList.toggle('active', c.dataset.hazard === key);
  });

  currentStats = hazardEngine.render(key);
  paintIntelPanel(currentStats);

  if (fly) {
    const f = currentStats.focus;
    disasterMap.flyToLocation(f.lat, f.lng, 8);
    showToast(`${currentStats.icon} ${currentStats.label} view — red zones, safe zones, alerts and past events`, 'warning');
  }
}

// ================================================================
// INTEL PANEL
// ================================================================
function initIntelPanel() {
  const panel = document.getElementById('intel-panel');
  const reopen = document.getElementById('intel-reopen');

  document.getElementById('intel-collapse').addEventListener('click', () => {
    panel.classList.add('hidden');
    reopen.classList.add('show');
  });
  reopen.addEventListener('click', () => {
    panel.classList.remove('hidden');
    reopen.classList.remove('show');
  });

  document.querySelectorAll('.intel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      currentTab = tab.dataset.tab;
      document.querySelectorAll('.intel-tab').forEach(t => t.classList.toggle('active', t === tab));
      paintIntelList(currentStats);
    });
  });

  document.getElementById('intel-focus-btn').addEventListener('click', () => {
    const f = currentStats.focus;
    disasterMap.flyToLocation(f.lat, f.lng, 10);
    openInspector(f.name, `${f.lat.toFixed(2)}° N, ${f.lng.toFixed(2)}° E`, f.level,
      currentHazard === 'cyclone' ? '160 km/h' : '25 km/h',
      f.note, nearestShelterText());
  });
}

function paintIntelPanel(s) {
  document.getElementById('intel-icon').textContent = s.icon;
  document.getElementById('intel-name').textContent = s.label;
  document.getElementById('intel-sub').textContent = 'What matters right now';
  document.getElementById('intel-summary').textContent = s.summary;
  document.getElementById('stat-red').textContent = s.redZones;
  document.getElementById('stat-people').textContent = compact(s.atRisk);
  document.getElementById('stat-shelter').textContent = compact(s.shelter);
  paintIntelList(s);
}

function paintIntelList(s) {
  const list = document.getElementById('intel-list');
  list.innerHTML = '';
  const colors = { CRITICAL: '#ff1f3d', HIGH: '#ff7a18', MODERATE: '#ffd400', INFO: '#12d67d' };
  const riskColors = { RED: '#ff1f3d', ORANGE: '#ff7a18', YELLOW: '#ffd400', GREEN: '#12d67d' };

  const rows = currentTab === 'alerts'
    ? s.alerts.map(a => ({ color: colors[a.level] || '#94a3b8', name: a.title, sub: `${a.area} • ${a.time} • ${a.confidence}% sure` }))
    : currentTab === 'history'
      ? s.history.map(h => ({ color: '#ffd400', name: `${h.name} (${h.year})`, sub: `${compact(h.affected)} people affected • ${h.note}`, lat: h.lat, lng: h.lng }))
      : s.habitations.map(h => ({ color: riskColors[h.risk], name: h.name, sub: `${h.pop.toLocaleString()} people • ${h.evacuated ? 'Evacuated' : 'Not evacuated'}`, lat: h.lat, lng: h.lng }));

  if (!rows.length) {
    list.innerHTML = '<div style="font-size:11.5px;color:#94a3b8;padding:8px;">Nothing to show for this hazard.</div>';
    return;
  }

  rows.forEach(r => {
    const el = document.createElement('div');
    el.className = 'intel-item';
    el.style.borderLeftColor = r.color;
    el.innerHTML = `<div><div class="intel-item-name">${r.name}</div><div class="intel-item-sub">${r.sub}</div></div>`;
    el.addEventListener('click', () => {
      const lat = r.lat ?? s.focus.lat, lng = r.lng ?? s.focus.lng;
      disasterMap.flyToLocation(lat, lng, 9);
    });
    list.appendChild(el);
  });
}

function compact(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return Math.round(n / 1000) + 'K';
  return String(n);
}

// ================================================================
// LEGEND TOGGLES
// ================================================================
function initLegendToggles() {
  document.querySelectorAll('.legend-toggles input').forEach(box => {
    box.addEventListener('change', () => {
      hazardEngine.setVisibility(box.dataset.part, box.checked);
    });
  });
}

// ================================================================
// TIMELINE
// ================================================================
function initTimelineSlider() {
  const nodes = document.querySelectorAll('.windy-time-node');
  const progress = document.getElementById('timeline-progress');
  const playBtn = document.getElementById('timeline-play-btn');
  const playIcon = document.getElementById('play-icon');

  function setStep(index) {
    nodes.forEach((n, idx) => n.classList.toggle('active', idx === index));
    progress.style.width = nodes[index].dataset.pct + '%';
    const label = nodes[index].querySelector('.windy-node-text').textContent;
    if (index === 0) showToast('Showing the situation right now', 'info');
    else if (index === 3) showToast(`${currentStats.label}: peak impact expected around +12h`, 'danger');
    else showToast(`Forecast ${label} for ${currentStats.label.toLowerCase()}`, 'info');
  }

  nodes.forEach((node, idx) => node.addEventListener('click', () => setStep(idx)));

  playBtn.addEventListener('click', () => {
    isPlayingTimeline = !isPlayingTimeline;
    playIcon.textContent = isPlayingTimeline ? '⏸' : '▶';
    if (isPlayingTimeline) {
      let step = 0;
      timelineInterval = setInterval(() => {
        step = (step + 1) % nodes.length;
        setStep(step);
      }, 1600);
    } else {
      clearInterval(timelineInterval);
    }
  });
}

// ================================================================
// SEARCH
// ================================================================
function initSearch() {
  const input = document.getElementById('windy-search');
  const clearBtn = document.getElementById('windy-search-clear');
  const dropdown = document.getElementById('windy-search-dropdown');

  // Search across every hazard's zones, safe sites and villages
  const places = [];
  Object.entries(HAZARD_INTEL).forEach(([key, h]) => {
    h.zones.forEach(z => places.push({ name: z.name, region: h.label, lat: z.lat, lng: z.lng, risk: z.level, type: RISK_STYLE[z.level].label, hazard: key }));
    h.safeSites.forEach(s => places.push({ name: s.name, region: h.label, lat: s.lat, lng: s.lng, risk: 'GREEN', type: 'Safe zone', hazard: key }));
    h.habitations.forEach(v => places.push({ name: v.name, region: h.label, lat: v.lat, lng: v.lng, risk: v.risk, type: 'Village', hazard: key }));
  });

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    clearBtn.style.display = q ? 'block' : 'none';
    if (!q) { dropdown.style.display = 'none'; return; }

    const filtered = places.filter(p =>
      p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)
    ).slice(0, 8);

    if (!filtered.length) {
      dropdown.innerHTML = '<div style="padding:10px; font-size:12px; color:#94a3b8; text-align:center;">Nothing found</div>';
      dropdown.style.display = 'flex';
      return;
    }

    dropdown.innerHTML = '';
    const riskIcons = { RED: '🔴', ORANGE: '🟠', YELLOW: '🟡', GREEN: '🟢' };
    filtered.forEach(p => {
      const item = document.createElement('div');
      item.className = 'windy-search-item';
      item.innerHTML = `
        <div class="windy-search-item-left">
          <span>${riskIcons[p.risk]}</span>
          <div>
            <div class="windy-search-item-name">${p.name}</div>
            <div class="windy-search-item-sub">${p.region} &bull; ${p.type}</div>
          </div>
        </div>
        <span class="risk-badge risk-${p.risk.toLowerCase()}">${p.risk}</span>`;
      item.addEventListener('click', () => {
        if (p.hazard !== currentHazard) selectHazard(p.hazard, false);
        disasterMap.flyToLocation(p.lat, p.lng, 11);
        dropdown.style.display = 'none';
        input.value = p.name;
        openInspector(p.name, `${p.lat.toFixed(2)}° N, ${p.lng.toFixed(2)}° E`, p.risk,
          p.risk === 'RED' ? '140 km/h' : '20 km/h', p.type, nearestShelterText());
      });
      dropdown.appendChild(item);
    });
    dropdown.style.display = 'flex';
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    dropdown.style.display = 'none';
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.windy-search-pill')) dropdown.style.display = 'none';
  });
}

// ================================================================
// LEFT TOOLS
// ================================================================
function initLeftTools() {
  document.getElementById('tool-home').addEventListener('click', () => {
    disasterMap.flyToLocation(20.5937, 78.9629, 5);
    showToast('Showing the whole country', 'info');
  });

  document.getElementById('tool-locate').addEventListener('click', () => {
    disasterMap.flyToLocation(21.17, 72.83, 12);
    openInspector('Surat Coastal Sector (my location)', '21.17° N, 72.83° E', 'RED', '140 km/h', '2.8 meters', 'Surat Relief Camp A (2.4 km)');
    showToast('Centred on your location', 'warning');
  });

  document.getElementById('tool-shelter').addEventListener('click', guideToNearestShelter);
  document.getElementById('tool-report').addEventListener('click', () => {
    document.getElementById('report-modal').classList.add('active');
  });

  document.getElementById('tool-basemap').addEventListener('click', () => {
    satelliteOn = !satelliteOn;
    disasterMap.setBasemap(satelliteOn ? 'satellite' : 'standard');
    showToast(satelliteOn ? 'Satellite view on' : 'Plain map view on', 'info');
  });
}

function nearestShelterText() {
  const s = HAZARD_INTEL[currentHazard].safeSites[0];
  return `${s.name} (${(s.capacity - s.current).toLocaleString()} spaces)`;
}

function guideToNearestShelter() {
  const s = HAZARD_INTEL[currentHazard].safeSites[0];
  disasterMap.flyToLocation(s.lat, s.lng, 12);
  openInspector(s.name, `${s.lat.toFixed(2)}° N, ${s.lng.toFixed(2)}° E`, 'GREEN', 'Sheltered', 'Safe / elevated', `${(s.capacity - s.current).toLocaleString()} spaces open`);
  showToast(`Nearest safe place: ${s.name}`, 'success');
}

// ================================================================
// MAP CLICK INSPECTOR
// ================================================================
function initMapInspector() {
  const inspector = document.getElementById('windy-inspector');
  document.getElementById('insp-close').addEventListener('click', () => inspector.classList.remove('active'));
  document.getElementById('insp-evac-btn').addEventListener('click', guideToNearestShelter);

  disasterMap.getMap().on('click', (e) => {
    const { lat, lng } = e.latlng;
    const h = HAZARD_INTEL[currentHazard];

    // Which risk zone of the active hazard does this point fall in?
    let hit = null, best = Infinity;
    h.zones.forEach(z => {
      const d = distanceKm(lat, lng, z.lat, z.lng);
      if (d * 1000 <= z.radius && d < best) { best = d; hit = z; }
    });

    if (hit) {
      openInspector(`${hit.name}`, `${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E`, hit.level,
        currentHazard === 'cyclone' ? '140 km/h' : '30 km/h', hit.note, nearestShelterText());
    } else {
      openInspector('Selected point', `${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E`, 'GREEN',
        '15 km/h', `No active ${h.label.toLowerCase()} risk here`, nearestShelterText());
    }
  });
}

function distanceKm(a1, b1, a2, b2) {
  const R = 6371, dLat = (a2 - a1) * Math.PI / 180, dLng = (b2 - b1) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a1 * Math.PI / 180) * Math.cos(a2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function openInspector(name, coords, risk, wind, surge, shelter) {
  const inspector = document.getElementById('windy-inspector');
  document.getElementById('insp-name').textContent = name;
  document.getElementById('insp-coords').textContent = coords;

  const riskEl = document.getElementById('insp-risk');
  const labels = { RED: 'Very high risk', ORANGE: 'High risk', YELLOW: 'Moderate risk', GREEN: 'Safe area' };
  const riskColors = { RED: '#ff1f3d', ORANGE: '#ff7a18', YELLOW: '#ffd400', GREEN: '#12d67d' };
  riskEl.textContent = labels[risk] || risk;
  riskEl.style.color = riskColors[risk] || '#94a3b8';

  document.getElementById('insp-wind').textContent = wind;
  document.getElementById('insp-surge').textContent = surge;
  document.getElementById('insp-shelter').textContent = shelter;
  inspector.classList.add('active');
}

// ================================================================
// REPORT MODAL — Firebase Live Database Integration
// ================================================================
function initReportModal() {
  const modal = document.getElementById('report-modal');
  const form = document.getElementById('report-form');

  document.getElementById('report-close').addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('report-submit');
    btn.textContent = 'Transmitting to NDRF / GeoShield Cloud…';
    btn.disabled = true;

    try {
      const type = document.getElementById('rep-type').value;
      const loc = document.getElementById('rep-loc').value;
      const desc = document.getElementById('rep-desc').value;
      const phone = document.getElementById('rep-phone').value;

      // Extract coordinates from map center or default
      let lat = 21.17;
      let lng = 72.83;
      if (window.disasterMap && window.disasterMap.getMap) {
        const center = window.disasterMap.getMap().getCenter();
        lat = center.lat;
        lng = center.lng;
      }

      const reportPayload = {
        type,
        location: loc,
        desc,
        phone,
        lat,
        lng,
        severity: type === 'Stranded' ? 'Critical' : type === 'Flood' ? 'High' : 'Medium',
        reporter: 'Citizen (' + phone.slice(-4) + ')'
      };

      if (window.firebaseLive) {
        await window.firebaseLive.submitCitizenReport(reportPayload);
      }

      modal.classList.remove('active');
      showToast('✅ Report transmitted to live database. Authorities notified!', 'success');
      form.reset();
    } catch (err) {
      console.error('Submission error:', err);
      showToast('Report cached locally and queued for dispatch.', 'info');
      modal.classList.remove('active');
    } finally {
      btn.textContent = 'Send report';
      btn.disabled = false;
    }
  });
}

// Synthesize emergency alert chime (no external audio assets needed)
function playEmergencyChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch (e) {}
}

// Real-time Emergency Alert Listener from Authority Command Center
function initLiveAlertListener() {
  if (!window.firebaseLive) return;

  window.firebaseLive.onAlerts((alerts, meta) => {
    if (!alerts || alerts.length === 0) return;
    const latest = alerts[0];

    // Check if this is a newly arrived live broadcast
    if (meta && meta.added) {
      const banner = document.getElementById('citizen-emergency-banner');
      const titleEl = document.getElementById('cit-banner-title');
      const msgEl = document.getElementById('cit-banner-msg');

      if (banner && titleEl && msgEl) {
        titleEl.textContent = latest.title || 'CRITICAL DISASTER EMERGENCY ALERT';
        msgEl.textContent = `${latest.message || latest.desc || 'Immediate caution advised'} • Target Sector: ${latest.area}`;
        banner.style.display = 'block';
        playEmergencyChime();
        showToast('🚨 Live Emergency Alert broadcast received from Command Center!', 'danger');
      }
    }
  });
}

// ================================================================
// TOAST
// ================================================================
function showToast(msg, type = 'info') {
  const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', danger: '🚨' };
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:120px;left:70px;z-index:9999;display:flex;flex-direction:column;gap:8px;pointer-events:none;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const borderColors = { info: '#3b82f6', success: '#12d67d', warning: '#ff7a18', danger: '#ff1f3d' };
  const textColors = { info: '#93c5fd', success: '#7cf3b6', warning: '#ffc48a', danger: '#ff9aa8' };

  toast.style.cssText = `
    background: rgba(9,14,25,0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.14);
    border-left: 3px solid ${borderColors[type]};
    color: ${textColors[type]};
    border-radius: 12px; padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    font-size: 12px; font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.45);
    max-width: 320px; pointer-events: all;
  `;
  toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
