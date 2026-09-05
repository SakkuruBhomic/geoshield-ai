// ================================================================
// MAP.JS — Leaflet Map Setup, Risk Zones, Layers
// ================================================================

const RISK_COLORS = {
  RED:    { fill: '#ef4444', opacity: 0.35, stroke: '#dc2626', strokeOpacity: 0.7 },
  ORANGE: { fill: '#f97316', opacity: 0.28, stroke: '#ea580c', strokeOpacity: 0.6 },
  YELLOW: { fill: '#eab308', opacity: 0.22, stroke: '#ca8a04', strokeOpacity: 0.5 },
  GREEN:  { fill: '#22c55e', opacity: 0.15, stroke: '#16a34a', strokeOpacity: 0.4 }
};

const LAYER_CONFIG = {
  satellite:   { name: 'Satellite', icon: '🛰️', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', maxZoom: 19 },
  standard:    { name: 'Standard',  icon: '🗺️', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', maxZoom: 19 },
  topo:        { name: 'Elevation', icon: '⛰️', url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', maxZoom: 17 }
};

class DisasterMap {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = options;
    this.map = null;
    this.baseLayers = {};
    this.overlayLayers = {};
    this.activeBaseLayer = 'standard';
    this.riskZoneCircles = [];
    this.markers = { safeSites: [], hospitals: [], habitations: [], hazards: [] };
    this.userMarker = null;
    this.init();
  }

  init() {
    const config = APP_DATA.mapConfig;
    this.map = L.map(this.containerId, {
      center: config.center,
      zoom: config.zoom,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: true
    });

    // Move zoom control to bottom-right
    this.map.zoomControl.setPosition('bottomright');

    // Setup base layers
    this.baseLayers.standard = L.tileLayer(LAYER_CONFIG.standard.url, {
      maxZoom: 19, attribution: '© OpenStreetMap'
    }).addTo(this.map);

    this.baseLayers.satellite = L.tileLayer(LAYER_CONFIG.satellite.url, {
      maxZoom: 19, attribution: '© Esri'
    });

    this.baseLayers.topo = L.tileLayer(LAYER_CONFIG.topo.url, {
      maxZoom: 17, attribution: '© OpenTopoMap'
    });

    // Dark styling for base tiles is applied via CSS filter (see .leaflet-tile-pane)


    // Draw risk zones
    this.drawRiskZones();

    // Add markers
    this.addSafeSiteMarkers();
    this.addHazardMarkers();
    this.addHospitalMarkers();
    this.addHabitationMarkers();

    // Simulate user location (center of map)
    this.setUserLocation([20.5937, 78.9629]);

    return this;
  }

  drawRiskZones() {
    APP_DATA.riskZones.forEach(zone => {
      const colors = RISK_COLORS[zone.level];
      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radius,
        fillColor: colors.fill,
        fillOpacity: colors.opacity,
        color: colors.stroke,
        weight: 2,
        opacity: colors.strokeOpacity
      }).addTo(this.map);

      circle.bindPopup(this.createRiskPopup(zone), { className: 'custom-popup' });
      this.riskZoneCircles.push({ zone, circle });
    });
  }

  createRiskPopup(zone) {
    const levelClass = zone.level.toLowerCase();
    return `
      <div class="map-popup">
        <div class="popup-header">
          <span class="risk-badge risk-${levelClass}">${zone.level} RISK</span>
          <span class="popup-name">${zone.name}</span>
        </div>
        <div class="popup-body">
          <div class="popup-stat"><span>Population</span><strong>${zone.pop.toLocaleString()}</strong></div>
          <div class="popup-desc">${zone.desc}</div>
        </div>
      </div>
    `;
  }

  addSafeSiteMarkers() {
    APP_DATA.safeSites.forEach(site => {
      const pct = Math.round((site.current / site.capacity) * 100);
      const capColor = pct > 85 ? '#ef4444' : pct > 60 ? '#f97316' : '#22c55e';
      const icon = L.divIcon({
        html: `<div style="font-size:22px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.5))">🏕️</div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 14]
      });
      const marker = L.marker([site.lat, site.lng], { icon }).addTo(this.map);
      marker.bindPopup(`
        <div class="map-popup">
          <div class="popup-header"><span class="risk-badge risk-green">SAFE SITE</span><span class="popup-name">${site.name}</span></div>
          <div class="popup-body">
            <div class="popup-stat"><span>Capacity</span><strong>${site.capacity.toLocaleString()}</strong></div>
            <div class="popup-stat"><span>Current</span><strong style="color:${capColor}">${site.current.toLocaleString()} (${pct}%)</strong></div>
            <div class="popup-stat"><span>Type</span><strong>${site.type}</strong></div>
            <div class="popup-amenities">${site.amenities.map(a => `<span>${a}</span>`).join('')}</div>
          </div>
        </div>
      `, { className: 'custom-popup' });
      this.markers.safeSites.push(marker);
    });
  }

  addHazardMarkers() {
    const icons = { Cyclone:'🌀', Flood:'🌊', Landslide:'⛰️', Earthquake:'📳', Cloudburst:'⛈️' };
    APP_DATA.activeHazards.forEach(h => {
      const icon = L.divIcon({
        html: `<div style="font-size:24px;filter:drop-shadow(0 2px 6px rgba(0,0,0,0.6));animation:float 2s ease-in-out infinite">${icons[h.type]||'⚠️'}</div>`,
        className: '', iconSize: [32, 32], iconAnchor: [16, 16]
      });
      const marker = L.marker([h.lat, h.lng], { icon }).addTo(this.map);
      const sevClass = h.severity === 'CRITICAL' ? 'risk-red' : h.severity === 'HIGH' ? 'risk-orange' : 'risk-yellow';
      marker.bindPopup(`
        <div class="map-popup">
          <div class="popup-header"><span class="risk-badge ${sevClass}">${h.severity}</span><span class="popup-name">${h.name}</span></div>
          <div class="popup-body">
            <div class="popup-stat"><span>Type</span><strong>${h.type}</strong></div>
            <div class="popup-stat"><span>State</span><strong>${h.state}</strong></div>
            <div class="popup-stat"><span>Confidence</span><strong>${h.confidence}%</strong></div>
            <div class="popup-stat"><span>ETA</span><strong>${h.eta}</strong></div>
            <div class="popup-desc">${h.desc}</div>
          </div>
        </div>
      `, { className: 'custom-popup' });
      this.markers.hazards.push(marker);
    });
  }

  addHospitalMarkers() {
    APP_DATA.hospitals.forEach(h => {
      const icon = L.divIcon({
        html: `<div style="font-size:18px">🏥</div>`,
        className: '', iconSize: [24, 24], iconAnchor: [12, 12]
      });
      const marker = L.marker([h.lat, h.lng], { icon });
      // Hidden by default, shown when hospital layer is active
      this.markers.hospitals.push(marker);
    });
  }

  addHabitationMarkers() {
    APP_DATA.habitations.forEach(hab => {
      const riskColors = { RED:'#ef4444', ORANGE:'#f97316', YELLOW:'#eab308', GREEN:'#22c55e' };
      const col = riskColors[hab.risk] || '#94a3b8';
      const icon = L.divIcon({
        html: `<div style="width:10px;height:10px;border-radius:50%;background:${col};border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 6px ${col}"></div>`,
        className: '', iconSize: [10, 10], iconAnchor: [5, 5]
      });
      const marker = L.marker([hab.lat, hab.lng], { icon });
      marker.bindTooltip(hab.name, { permanent: false, direction: 'top', className: 'hab-tooltip' });
      this.markers.habitations.push(marker);
    });
  }

  setUserLocation(latlng) {
    if (this.userMarker) this.map.removeLayer(this.userMarker);
    const icon = L.divIcon({
      html: `
        <div style="position:relative;width:20px;height:20px">
          <div style="width:20px;height:20px;border-radius:50%;background:#3b82f6;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4)"></div>
          <div style="position:absolute;inset:-8px;border-radius:50%;border:2px solid rgba(59,130,246,0.5);animation:pulse-ring 1.8s ease-out infinite"></div>
        </div>`,
      className: '', iconSize: [20, 20], iconAnchor: [10, 10]
    });
    this.userMarker = L.marker(latlng, { icon, zIndexOffset: 1000 }).addTo(this.map);
    this.userMarker.bindPopup('<div class="map-popup"><strong>Your Location</strong></div>', { className: 'custom-popup' });
  }

  toggleLayer(layerName, visible) {
    switch(layerName) {
      case 'satellite':
        if (visible) { this.baseLayers.satellite.addTo(this.map); }
        else { this.map.removeLayer(this.baseLayers.satellite); }
        break;
      case 'elevation':
        if (visible) { this.baseLayers.topo.addTo(this.map); }
        else { this.map.removeLayer(this.baseLayers.topo); }
        break;
      case 'flood': case 'cyclone': case 'landslide':
        this.riskZoneCircles.forEach(({ zone, circle }) => {
          if (zone.level === 'RED' || zone.level === 'ORANGE') {
            visible ? circle.addTo(this.map) : this.map.removeLayer(circle);
          }
        });
        break;
      case 'hospitals':
        this.markers.hospitals.forEach(m => visible ? m.addTo(this.map) : this.map.removeLayer(m));
        break;
      case 'habitations':
        this.markers.habitations.forEach(m => visible ? m.addTo(this.map) : this.map.removeLayer(m));
        break;
      case 'shelters':
        this.markers.safeSites.forEach(m => visible ? m.addTo(this.map) : this.map.removeLayer(m));
        break;
      case 'redZones':
        this.riskZoneCircles.forEach(({ zone, circle }) => {
          if (zone.level === 'RED') { visible ? circle.addTo(this.map) : this.map.removeLayer(circle); }
        });
        break;
    }
  }

  // Remove the generic demo overlays so a hazard-specific view can own the map
  clearDefaultOverlays() {
    this.riskZoneCircles.forEach(({ circle }) => {
      if (this.map.hasLayer(circle)) this.map.removeLayer(circle);
    });
    Object.values(this.markers).forEach(list => {
      list.forEach(m => { if (this.map.hasLayer(m)) this.map.removeLayer(m); });
    });
  }

  setBasemap(name) {
    Object.entries(this.baseLayers).forEach(([key, layer]) => {
      if (key === name) { if (!this.map.hasLayer(layer)) layer.addTo(this.map); }
      else if (this.map.hasLayer(layer)) this.map.removeLayer(layer);
    });
    this.activeBaseLayer = name;
  }

  flyToLocation(lat, lng, zoom = 10) {
    this.map.flyTo([lat, lng], zoom, { duration: 1.5, easeLinearity: 0.5 });
  }

  getMap() { return this.map; }
}

// Leaflet popup styles (injected dynamically)
const popupStyles = document.createElement('style');
popupStyles.textContent = `
  .custom-popup .leaflet-popup-content-wrapper {
    background: rgba(7,11,22,0.92); backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.14); border-radius: 14px;
    padding: 0; box-shadow: 0 8px 32px rgba(0,0,0,0.5); color: #f1f5f9;
  }
  .custom-popup .leaflet-popup-tip-container { display: none; }
  .custom-popup .leaflet-popup-content { margin: 0; }
  .map-popup { min-width: 220px; }
  .popup-header { padding: 12px 14px 8px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 8px; }
  .popup-name { font-size: 14px; font-weight: 700; color: #f1f5f9; }
  .popup-body { padding: 10px 14px 14px; }
  .popup-stat { display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #94a3b8; margin-bottom: 5px; }
  .popup-stat strong { color: #f1f5f9; }
  .popup-desc { font-size: 12px; color: #64748b; line-height: 1.5; margin-top: 8px; }
  .popup-amenities { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
  .popup-amenities span { padding: 2px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); color: #86efac; }
  .hab-tooltip { background: rgba(7,11,22,0.9); border: 1px solid rgba(255,255,255,0.1); color: #f1f5f9; font-size: 12px; border-radius: 6px; padding: 4px 10px; }
  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
  @keyframes pulse-ring { 0% { opacity: 0.8; transform: scale(0.8); } 80% { opacity: 0; transform: scale(2.2); } 100% { opacity: 0; } }
`;
document.head.appendChild(popupStyles);
