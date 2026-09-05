// ================================================================
// HAZARDS.JS — Hazard-Specific Intelligence Layers
// Each hazard carries: risk zones (red/orange/yellow/green),
// safe zones, live alerts, past disasters, affected habitations.
// ================================================================

const RISK_STYLE = {
  RED:    { fill: '#ff1f3d', opacity: 0.42, stroke: '#ff5a70', label: 'Very High Risk' },
  ORANGE: { fill: '#ff7a18', opacity: 0.34, stroke: '#ff9b45', label: 'High Risk' },
  YELLOW: { fill: '#ffd400', opacity: 0.26, stroke: '#ffe45c', label: 'Moderate Risk' },
  GREEN:  { fill: '#12d67d', opacity: 0.20, stroke: '#4bf0a5', label: 'Safe / Clean' }
};

const HAZARD_INTEL = {
  cyclone: {
    label: 'Cyclone', icon: '🌀', accent: '#ff1f3d',
    summary: 'Cyclone Vayu (Cat-3) tracking towards the Gujarat coast. Landfall expected in ~18 hours.',
    zones: [
      { level: 'RED',    name: 'Surat Landfall Corridor', lat: 21.17, lng: 72.83, radius: 45000, pop: 48000, note: 'Direct landfall • surge 2-4 m' },
      { level: 'RED',    name: 'Hazira Industrial Belt',  lat: 21.10, lng: 72.61, radius: 22000, pop: 22000, note: 'Wind gusts 160 km/h' },
      { level: 'ORANGE', name: 'Bhavnagar Coastal Arc',   lat: 21.76, lng: 72.15, radius: 40000, pop: 64000, note: 'Gusts 110 km/h, tree fall' },
      { level: 'ORANGE', name: 'Diu–Veraval Shoreline',   lat: 20.90, lng: 70.37, radius: 38000, pop: 41000, note: 'High tide + heavy rain' },
      { level: 'YELLOW', name: 'Mumbai Coastal Fringe',   lat: 19.07, lng: 72.87, radius: 45000, pop: 210000, note: 'Squalls, minor flooding' },
      { level: 'YELLOW', name: 'Rajkot Inland Belt',      lat: 22.30, lng: 70.80, radius: 42000, pop: 88000, note: 'Rain bands only' },
      { level: 'GREEN',  name: 'Pune Safe Sector',        lat: 18.52, lng: 73.85, radius: 45000, pop: 280000, note: 'No cyclone exposure' },
      { level: 'GREEN',  name: 'Nagpur Safe Sector',      lat: 21.15, lng: 79.09, radius: 50000, pop: 320000, note: 'Outside storm field' }
    ],
    safeSites: [
      { name: 'Surat Relief Camp A',   lat: 21.22, lng: 72.92, capacity: 5000, current: 1240 },
      { name: 'Surat School Shelter',  lat: 21.18, lng: 72.95, capacity: 2000, current: 890 },
      { name: 'Bhavnagar Cyclone Shelter', lat: 21.79, lng: 72.20, capacity: 3200, current: 640 }
    ],
    alerts: [
      { level: 'CRITICAL', title: 'Cyclone landfall warning', area: 'Gujarat coastline', time: '14:32', confidence: 91 },
      { level: 'HIGH',     title: 'Fishermen advised not to venture out', area: 'Arabian Sea', time: '13:05', confidence: 96 }
    ],
    history: [
      { year: 2023, name: 'Cyclone Biparjoy', lat: 22.47, lng: 68.97, affected: 120000, note: 'Landfall Jakhau, Kutch' },
      { year: 2021, name: 'Cyclone Tauktae',  lat: 20.90, lng: 70.90, affected: 200000, note: 'Severe damage in Saurashtra' },
      { year: 2019, name: 'Cyclone Vayu',     lat: 20.72, lng: 70.98, affected: 300000, note: 'Mass evacuation, Veraval' },
      { year: 1998, name: 'Kandla Cyclone',   lat: 22.99, lng: 70.22, affected: 450000, note: 'Historic Kutch disaster' }
    ],
    habitations: [
      { name: 'Olpad',  lat: 21.33, lng: 72.74, pop: 18200, risk: 'RED', evacuated: false },
      { name: 'Hazira', lat: 21.10, lng: 72.61, pop: 22000, risk: 'RED', evacuated: true },
      { name: 'Ghogha', lat: 21.68, lng: 72.28, pop: 9400,  risk: 'ORANGE', evacuated: false }
    ]
  },

  flood: {
    label: 'Flood', icon: '🌊', accent: '#ff2d55',
    summary: 'Brahmaputra flowing 3.2 m above danger mark. 23 districts of Assam affected right now.',
    zones: [
      { level: 'RED',    name: 'Brahmaputra Floodplain', lat: 26.14, lng: 91.74, radius: 42000, pop: 82000, note: 'Active inundation' },
      { level: 'RED',    name: 'Majuli Island',          lat: 26.94, lng: 94.16, radius: 26000, pop: 16700, note: 'Island fully cut off' },
      { level: 'ORANGE', name: 'Jorhat Riverine Belt',   lat: 26.75, lng: 94.21, radius: 32000, pop: 54000, note: 'Water rising 12 cm/h' },
      { level: 'ORANGE', name: 'Patna Ganga Belt',       lat: 25.61, lng: 85.14, radius: 40000, pop: 145000, note: 'Ganga near danger mark' },
      { level: 'YELLOW', name: 'Kolkata Urban Drainage', lat: 22.57, lng: 88.36, radius: 38000, pop: 120000, note: 'Waterlogging likely' },
      { level: 'YELLOW', name: 'Kochi Backwaters',       lat: 9.93,  lng: 76.26, radius: 30000, pop: 76000, note: 'Tidal backflow watch' },
      { level: 'GREEN',  name: 'Bengaluru Plateau',      lat: 12.97, lng: 77.59, radius: 45000, pop: 450000, note: 'No flood exposure' },
      { level: 'GREEN',  name: 'Jodhpur Arid Zone',      lat: 26.24, lng: 73.02, radius: 45000, pop: 210000, note: 'Dry, safe' }
    ],
    safeSites: [
      { name: 'Guwahati Evacuation Hub', lat: 26.18, lng: 91.73, capacity: 8000, current: 6200 },
      { name: 'Jorhat Relief Center',    lat: 26.75, lng: 94.21, capacity: 3000, current: 2100 },
      { name: 'Majuli Boat Camp',        lat: 26.98, lng: 94.20, capacity: 1200, current: 980 }
    ],
    alerts: [
      { level: 'CRITICAL', title: 'Brahmaputra danger level exceeded', area: 'Assam — 9 districts', time: '13:15', confidence: 96 },
      { level: 'HIGH',     title: 'Bridge damage on NH-27 near Jalukbari', area: 'Kamrup', time: '12:40', confidence: 74 }
    ],
    history: [
      { year: 2022, name: 'Assam Floods',   lat: 26.35, lng: 92.80, affected: 5800000, note: 'Worst in a decade' },
      { year: 2020, name: 'Bihar Floods',   lat: 25.90, lng: 85.60, affected: 8300000, note: 'Kosi + Gandak overflow' },
      { year: 2019, name: 'Kerala Floods',  lat: 9.90,  lng: 76.50, affected: 2100000, note: 'Landslide-linked flooding' },
      { year: 2018, name: 'Kerala Deluge',  lat: 10.52, lng: 76.21, affected: 5400000, note: 'Dam releases statewide' }
    ],
    habitations: [
      { name: 'Majuli',    lat: 26.94, lng: 94.16, pop: 16700, risk: 'RED', evacuated: false },
      { name: 'Dhemaji',   lat: 27.48, lng: 94.58, pop: 12800, risk: 'RED', evacuated: true },
      { name: 'Barpeta',   lat: 26.32, lng: 91.00, pop: 21400, risk: 'ORANGE', evacuated: false }
    ]
  },

  landslide: {
    label: 'Landslide', icon: '⛰️', accent: '#ff7a18',
    summary: 'Saturated Himalayan slopes. 14 vulnerable villages flagged across Uttarakhand and HP.',
    zones: [
      { level: 'RED',    name: 'Joshimath Slope Zone',  lat: 30.55, lng: 79.56, radius: 14000, pop: 4200, note: 'Active ground subsidence' },
      { level: 'ORANGE', name: 'Chamoli Hillside',      lat: 30.37, lng: 79.32, radius: 22000, pop: 12400, note: 'Debris flow risk' },
      { level: 'ORANGE', name: 'Kullu–Manali Corridor', lat: 31.96, lng: 77.10, radius: 25000, pop: 38000, note: 'Highway cut risk' },
      { level: 'YELLOW', name: 'Darjeeling Ridge',      lat: 27.04, lng: 88.26, radius: 20000, pop: 42000, note: 'Slow slope creep' },
      { level: 'YELLOW', name: 'Wayanad Slopes',        lat: 11.61, lng: 76.08, radius: 24000, pop: 36000, note: 'Monsoon watch' },
      { level: 'GREEN',  name: 'Dehradun Valley Floor', lat: 30.32, lng: 78.03, radius: 24000, pop: 180000, note: 'Stable terrain' },
      { level: 'GREEN',  name: 'Chandigarh Plains',     lat: 30.73, lng: 76.78, radius: 32000, pop: 260000, note: 'No slope hazard' }
    ],
    safeSites: [
      { name: 'Chamoli Safe Zone',   lat: 30.42, lng: 79.37, capacity: 1500, current: 220 },
      { name: 'Kullu Relief Ground', lat: 31.94, lng: 77.11, capacity: 2200, current: 410 }
    ],
    alerts: [
      { level: 'HIGH',     title: 'Landslide susceptibility alert', area: 'Uttarakhand hills', time: '12:48', confidence: 74 },
      { level: 'MODERATE', title: 'Debris on Badrinath highway', area: 'Chamoli', time: '11:10', confidence: 66 }
    ],
    history: [
      { year: 2024, name: 'Wayanad Landslides',  lat: 11.47, lng: 76.13, affected: 1500, note: 'Severe casualties' },
      { year: 2021, name: 'Chamoli Disaster',    lat: 30.45, lng: 79.60, affected: 200,  note: 'Glacier burst debris flow' },
      { year: 2013, name: 'Kedarnath Tragedy',   lat: 30.73, lng: 79.07, affected: 100000, note: 'Flood + landslide cascade' },
      { year: 2010, name: 'Leh Mudslides',       lat: 34.16, lng: 77.58, affected: 9000, note: 'Cloudburst-triggered' }
    ],
    habitations: [
      { name: 'Joshimath', lat: 30.55, lng: 79.56, pop: 4200, risk: 'RED', evacuated: false },
      { name: 'Pipalkoti', lat: 30.42, lng: 79.42, pop: 3100, risk: 'ORANGE', evacuated: false },
      { name: 'Manali',    lat: 32.24, lng: 77.19, pop: 8600, risk: 'YELLOW', evacuated: false }
    ]
  },

  earthquake: {
    label: 'Earthquake', icon: '📳', accent: '#ff9500',
    summary: 'M4.8 event in Manipur with ongoing aftershocks. Seismic Zone V belt under watch.',
    zones: [
      { level: 'RED',    name: 'Imphal Epicentre Zone', lat: 24.81, lng: 93.94, radius: 30000, pop: 34000, note: 'Aftershocks ongoing' },
      { level: 'ORANGE', name: 'Ukhrul Fault Belt',     lat: 25.09, lng: 94.35, radius: 28000, pop: 5800, note: 'Zone V vulnerability' },
      { level: 'ORANGE', name: 'Guwahati Seismic Belt', lat: 26.14, lng: 91.74, radius: 34000, pop: 96000, note: 'Soft-soil amplification' },
      { level: 'YELLOW', name: 'Delhi NCR Zone IV',     lat: 28.61, lng: 77.21, radius: 45000, pop: 480000, note: 'Moderate exposure' },
      { level: 'YELLOW', name: 'Kutch Seismic Belt',    lat: 23.24, lng: 69.67, radius: 40000, pop: 68000, note: 'Historic Zone V' },
      { level: 'GREEN',  name: 'Hyderabad Stable Craton', lat: 17.39, lng: 78.49, radius: 45000, pop: 400000, note: 'Zone II, low risk' },
      { level: 'GREEN',  name: 'Chennai Coastal Craton', lat: 13.08, lng: 80.27, radius: 40000, pop: 380000, note: 'Zone III low' }
    ],
    safeSites: [
      { name: 'Imphal Central Shelter', lat: 24.82, lng: 93.97, capacity: 4000, current: 1800 },
      { name: 'Guwahati Open Ground',   lat: 26.16, lng: 91.78, capacity: 6000, current: 300 }
    ],
    alerts: [
      { level: 'MODERATE', title: 'Aftershock activity ongoing', area: 'Manipur', time: '11:22', confidence: 68 },
      { level: 'MODERATE', title: 'Structural cracks reported, Sagolband', area: 'Imphal West', time: '10:05', confidence: 72 }
    ],
    history: [
      { year: 2023, name: 'M6.2 Nepal border quake', lat: 29.40, lng: 81.20, affected: 60000, note: 'Felt across North India' },
      { year: 2011, name: 'Sikkim Earthquake M6.9',  lat: 27.72, lng: 88.16, affected: 300000, note: 'Widespread damage' },
      { year: 2001, name: 'Bhuj Earthquake M7.7',    lat: 23.42, lng: 70.23, affected: 1600000, note: 'Deadliest recent quake' },
      { year: 1993, name: 'Latur Earthquake M6.2',   lat: 18.40, lng: 76.58, affected: 180000, note: 'Peninsular India' }
    ],
    habitations: [
      { name: 'Imphal East', lat: 24.81, lng: 93.98, pop: 45000, risk: 'RED', evacuated: false },
      { name: 'Ukhrul',      lat: 25.09, lng: 94.35, pop: 5800,  risk: 'ORANGE', evacuated: false }
    ]
  },

  tsunami: {
    label: 'Tsunami', icon: '🌊', accent: '#ff2d78',
    summary: 'No active tsunami. Coastal readiness view for Bay of Bengal and Andaman subduction belt.',
    zones: [
      { level: 'RED',    name: 'Andaman Subduction Coast', lat: 11.62, lng: 92.73, radius: 40000, pop: 38000, note: 'First-arrival zone' },
      { level: 'ORANGE', name: 'Nagapattinam Shoreline',   lat: 10.77, lng: 79.84, radius: 30000, pop: 62000, note: '2004 worst-hit belt' },
      { level: 'ORANGE', name: 'Chennai Marina Belt',      lat: 13.05, lng: 80.28, radius: 26000, pop: 180000, note: 'Low-lying shore' },
      { level: 'YELLOW', name: 'Visakhapatnam Coast',      lat: 17.69, lng: 83.30, radius: 30000, pop: 140000, note: 'Moderate run-up' },
      { level: 'YELLOW', name: 'Kochi Shoreline',          lat: 9.93,  lng: 76.24, radius: 26000, pop: 90000, note: 'Arabian Sea watch' },
      { level: 'GREEN',  name: 'Bhopal Inland Safe',       lat: 23.26, lng: 77.41, radius: 45000, pop: 300000, note: 'No coastal exposure' },
      { level: 'GREEN',  name: 'Nashik Inland Safe',       lat: 19.99, lng: 73.79, radius: 40000, pop: 220000, note: 'Elevated inland' }
    ],
    safeSites: [
      { name: 'Nagapattinam High Ground', lat: 10.80, lng: 79.79, capacity: 4500, current: 0 },
      { name: 'Port Blair Vertical Shelter', lat: 11.66, lng: 92.75, capacity: 2000, current: 0 }
    ],
    alerts: [
      { level: 'INFO', title: 'No tsunami threat — routine watch', area: 'Indian Ocean', time: '09:00', confidence: 99 }
    ],
    history: [
      { year: 2004, name: 'Indian Ocean Tsunami', lat: 10.77, lng: 79.84, affected: 2790000, note: 'Catastrophic, Tamil Nadu' },
      { year: 2004, name: 'Andaman Run-up',       lat: 11.62, lng: 92.73, affected: 42000, note: 'Islands submerged' },
      { year: 1945, name: 'Makran Tsunami',       lat: 22.80, lng: 68.20, affected: 4000, note: 'Arabian Sea event' }
    ],
    habitations: [
      { name: 'Velankanni',  lat: 10.68, lng: 79.85, pop: 10400, risk: 'ORANGE', evacuated: false },
      { name: 'Hut Bay',     lat: 10.58, lng: 92.55, pop: 4300,  risk: 'RED', evacuated: false }
    ]
  },

  cloudburst: {
    label: 'Cloudburst', icon: '⛈️', accent: '#ff4d00',
    summary: '200 mm+ rainfall expected in 3 hours over Himachal. Flash-flood risk in narrow valleys.',
    zones: [
      { level: 'RED',    name: 'Shimla Catchment',      lat: 31.10, lng: 77.17, radius: 20000, pop: 46000, note: 'Flash flood imminent' },
      { level: 'ORANGE', name: 'Kangra Valley',         lat: 32.10, lng: 76.27, radius: 28000, pop: 58000, note: 'Nallah overflow risk' },
      { level: 'ORANGE', name: 'Uttarkashi Gorge',      lat: 30.73, lng: 78.44, radius: 22000, pop: 21000, note: 'Steep runoff' },
      { level: 'YELLOW', name: 'Dharamshala Foothills', lat: 32.21, lng: 76.32, radius: 22000, pop: 24000, note: 'Hail and squalls' },
      { level: 'YELLOW', name: 'Srinagar Bowl',         lat: 34.08, lng: 74.80, radius: 26000, pop: 130000, note: 'Localised heavy rain' },
      { level: 'GREEN',  name: 'Amritsar Plains',       lat: 31.63, lng: 74.87, radius: 34000, pop: 240000, note: 'Light rain only' },
      { level: 'GREEN',  name: 'Jaipur Dry Belt',       lat: 26.91, lng: 75.78, radius: 40000, pop: 320000, note: 'Outside rain band' }
    ],
    safeSites: [
      { name: 'Shimla Community Hall', lat: 31.11, lng: 77.19, capacity: 1800, current: 120 },
      { name: 'Kangra Relief Camp',    lat: 32.09, lng: 76.26, capacity: 2400, current: 300 }
    ],
    alerts: [
      { level: 'HIGH', title: 'Extreme rainfall — 6h forecast', area: 'HP — Kangra, Kullu', time: '10:55', confidence: 79 },
      { level: 'MODERATE', title: 'Flash-flood watch in narrow valleys', area: 'Uttarkashi', time: '10:20', confidence: 71 }
    ],
    history: [
      { year: 2023, name: 'Himachal Monsoon Fury', lat: 31.70, lng: 77.10, affected: 420000, note: 'Beas river devastation' },
      { year: 2021, name: 'Kishtwar Cloudburst',   lat: 33.31, lng: 75.77, affected: 3000, note: 'Village washed away' },
      { year: 2013, name: 'Kedarnath Cloudburst',  lat: 30.73, lng: 79.07, affected: 100000, note: 'Flood cascade' },
      { year: 2010, name: 'Leh Cloudburst',        lat: 34.16, lng: 77.58, affected: 9000, note: 'Sudden mudflow' }
    ],
    habitations: [
      { name: 'Kullu',       lat: 31.96, lng: 77.10, pop: 18700, risk: 'ORANGE', evacuated: false },
      { name: 'Dharamshala', lat: 32.21, lng: 76.32, pop: 24000, risk: 'YELLOW', evacuated: false }
    ]
  },

  erosion: {
    label: 'Coastal Erosion', icon: '🏝️', accent: '#ffb100',
    summary: 'Long-term shoreline retreat monitoring. 34% of India\'s coast shows erosion trends.',
    zones: [
      { level: 'RED',    name: 'Sagar Island Retreat',  lat: 21.70, lng: 88.10, radius: 22000, pop: 34000, note: 'Up to 5 m/yr loss' },
      { level: 'ORANGE', name: 'Puri Shoreline',        lat: 19.81, lng: 85.83, radius: 24000, pop: 48000, note: '2-3 m/yr retreat' },
      { level: 'ORANGE', name: 'Kerala Alappuzha Coast',lat: 9.50,  lng: 76.32, radius: 26000, pop: 62000, note: 'Seawall breach risk' },
      { level: 'YELLOW', name: 'Goa Beach Belt',        lat: 15.30, lng: 73.90, radius: 22000, pop: 38000, note: 'Seasonal erosion' },
      { level: 'YELLOW', name: 'Mumbai Versova Beach',  lat: 19.13, lng: 72.81, radius: 16000, pop: 84000, note: 'Sand loss monitored' },
      { level: 'GREEN',  name: 'Gulf of Kutch Stable',  lat: 22.60, lng: 69.80, radius: 34000, pop: 42000, note: 'Accreting shoreline' },
      { level: 'GREEN',  name: 'Karwar Rocky Coast',    lat: 14.81, lng: 74.13, radius: 24000, pop: 28000, note: 'Stable rock shore' }
    ],
    safeSites: [
      { name: 'Sagar Island Relocation Site', lat: 21.75, lng: 88.15, capacity: 2600, current: 780 },
      { name: 'Puri Resettlement Colony',     lat: 19.85, lng: 85.86, capacity: 1900, current: 540 }
    ],
    alerts: [
      { level: 'MODERATE', title: 'Shoreline retreat accelerating', area: 'Sundarbans delta', time: '08:40', confidence: 84 }
    ],
    history: [
      { year: 2020, name: 'Sagar Island land loss', lat: 21.70, lng: 88.10, affected: 15000, note: 'Villages relocated' },
      { year: 2018, name: 'Versova beach retreat',  lat: 19.13, lng: 72.81, affected: 5000, note: 'Restoration project' },
      { year: 2009, name: 'Lohachara submergence',  lat: 21.90, lng: 88.20, affected: 6000, note: 'Island disappeared' }
    ],
    habitations: [
      { name: 'Ghoramara', lat: 21.90, lng: 88.16, pop: 5200, risk: 'RED', evacuated: false },
      { name: 'Chandipur', lat: 21.46, lng: 87.02, pop: 7400, risk: 'ORANGE', evacuated: false }
    ]
  }
};

// ================================================================
// HazardEngine — draws one hazard's full intelligence on the map
// ================================================================
class HazardEngine {
  constructor(map) {
    this.map = map;
    this.group = L.layerGroup().addTo(map);
    this.visible = { zones: true, safe: true, alerts: true, history: true, habitations: true };
    this.activeKey = null;
  }

  render(key) {
    this.activeKey = key;
    const h = HAZARD_INTEL[key];
    if (!h) return null;
    this.group.clearLayers();

    if (this.visible.zones) {
      h.zones.forEach(z => {
        const s = RISK_STYLE[z.level];
        L.circle([z.lat, z.lng], {
          radius: z.radius, fillColor: s.fill, fillOpacity: s.opacity,
          color: s.stroke, weight: 2, opacity: 0.9
        })
          .bindPopup(this.popup(`${s.label}`, z.level.toLowerCase(), z.name, [
            ['People in zone', z.pop.toLocaleString()],
            ['Hazard', h.label]
          ], z.note), { className: 'custom-popup' })
          .addTo(this.group);
      });
    }

    if (this.visible.safe) {
      h.safeSites.forEach(s => {
        const free = s.capacity - s.current;
        L.marker([s.lat, s.lng], { icon: this.emojiIcon('🏕️', 24, '#12d67d') })
          .bindPopup(this.popup('Safe Zone', 'green', s.name, [
            ['Capacity', s.capacity.toLocaleString()],
            ['Space left', free.toLocaleString()]
          ], 'Food, water and medical support available.'), { className: 'custom-popup' })
          .addTo(this.group);
      });
    }

    if (this.visible.alerts) {
      h.alerts.forEach((a, i) => {
        const z = h.zones[i] || h.zones[0];
        L.marker([z.lat + 0.14, z.lng + 0.14], { icon: this.alertIcon(a.level) })
          .bindPopup(this.popup(`${a.level} ALERT`, a.level === 'INFO' ? 'green' : a.level === 'MODERATE' ? 'yellow' : 'red', a.title, [
            ['Area', a.area], ['Issued', a.time], ['Confidence', a.confidence + '%']
          ], 'Live alert from the national hazard feed.'), { className: 'custom-popup' })
          .addTo(this.group);
      });
    }

    if (this.visible.history) {
      h.history.forEach(e => {
        L.marker([e.lat, e.lng], { icon: this.historyIcon(e.year) })
          .bindPopup(this.popup('Past Disaster', 'yellow', `${e.name} (${e.year})`, [
            ['People affected', e.affected.toLocaleString()]
          ], e.note), { className: 'custom-popup' })
          .addTo(this.group);
      });
    }

    if (this.visible.habitations) {
      h.habitations.forEach(hb => {
        const s = RISK_STYLE[hb.risk];
        L.marker([hb.lat, hb.lng], { icon: this.dotIcon(s.fill) })
          .bindTooltip(`${hb.name} • ${hb.pop.toLocaleString()} people`, { direction: 'top', className: 'hab-tooltip' })
          .bindPopup(this.popup(s.label, hb.risk.toLowerCase(), hb.name, [
            ['Population', hb.pop.toLocaleString()],
            ['Evacuated', hb.evacuated ? 'Yes' : 'Not yet']
          ], `Exposed to ${h.label.toLowerCase()}.`), { className: 'custom-popup' })
          .addTo(this.group);
      });
    }

    return this.stats(key);
  }

  setVisibility(part, on) {
    this.visible[part] = on;
    if (this.activeKey) this.render(this.activeKey);
  }

  stats(key) {
    const h = HAZARD_INTEL[key];
    const atRisk = h.zones.filter(z => z.level === 'RED' || z.level === 'ORANGE')
      .reduce((a, z) => a + z.pop, 0);
    const shelter = h.safeSites.reduce((a, s) => a + (s.capacity - s.current), 0);
    return {
      label: h.label, icon: h.icon, accent: h.accent, summary: h.summary,
      redZones: h.zones.filter(z => z.level === 'RED').length,
      atRisk, shelter,
      alerts: h.alerts, history: h.history, habitations: h.habitations,
      focus: h.zones[0]
    };
  }

  popup(badge, badgeClass, title, rows, note) {
    return `
      <div class="map-popup">
        <div class="popup-header">
          <span class="risk-badge risk-${badgeClass}">${badge}</span>
          <span class="popup-name">${title}</span>
        </div>
        <div class="popup-body">
          ${rows.map(([k, v]) => `<div class="popup-stat"><span>${k}</span><strong>${v}</strong></div>`).join('')}
          <div class="popup-desc">${note}</div>
        </div>
      </div>`;
  }

  emojiIcon(emoji, size, glow) {
    return L.divIcon({
      html: `<div style="font-size:${size}px;filter:drop-shadow(0 0 6px ${glow})">${emoji}</div>`,
      className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2]
    });
  }

  alertIcon(level) {
    const col = level === 'CRITICAL' ? '#ff1f3d' : level === 'HIGH' ? '#ff7a18' : level === 'MODERATE' ? '#ffd400' : '#12d67d';
    return L.divIcon({
      html: `<div class="alert-pin" style="--pin:${col}"><span>!</span></div>`,
      className: '', iconSize: [26, 26], iconAnchor: [13, 13]
    });
  }

  historyIcon(year) {
    return L.divIcon({
      html: `<div class="history-pin"><span>${String(year).slice(2)}</span></div>`,
      className: '', iconSize: [30, 30], iconAnchor: [15, 15]
    });
  }

  dotIcon(color) {
    return L.divIcon({
      html: `<div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 10px ${color}"></div>`,
      className: '', iconSize: [12, 12], iconAnchor: [6, 6]
    });
  }
}
