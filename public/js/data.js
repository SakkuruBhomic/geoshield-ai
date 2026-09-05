// ================================================================
// DATA.JS — Simulated Disaster Platform Data (India-focused)
// ================================================================

const APP_DATA = {

  // ---- Map Configuration ----
  mapConfig: {
    center: [20.5937, 78.9629],
    zoom: 5,
    minZoom: 4,
    maxZoom: 18
  },

  // ---- Active Hazards ----
  activeHazards: [
    { id: 'HAZ001', type: 'Cyclone',    name: 'Cyclone Vayu',      severity: 'HIGH',     state: 'Gujarat',       lat: 21.17, lng: 72.83, radius: 120000, confidence: 87, eta: '18 hours', desc: 'Category 3 cyclone approaching Gujarat coast. Wind speeds 140-160 kmph. Storm surge expected 2-4m.' },
    { id: 'HAZ002', type: 'Flood',      name: 'Brahmaputra Flood', severity: 'CRITICAL',  state: 'Assam',         lat: 26.14, lng: 91.74, radius: 80000,  confidence: 95, eta: 'Active',   desc: 'Major flood event in Assam. 23 districts affected. Water level 3.2m above danger mark.' },
    { id: 'HAZ003', type: 'Landslide',  name: 'Landslide Alert',   severity: 'MODERATE',  state: 'Uttarakhand',   lat: 30.06, lng: 79.01, radius: 40000,  confidence: 72, eta: '6 hours',  desc: 'High landslide susceptibility due to heavy rainfall. 14 vulnerable villages identified.' },
    { id: 'HAZ004', type: 'Earthquake', name: 'Seismic Activity',  severity: 'MODERATE',  state: 'Manipur',       lat: 24.81, lng: 93.94, radius: 60000,  confidence: 68, eta: 'Active',   desc: 'Magnitude 4.8 earthquake. Aftershocks ongoing. Structural damage reported in 3 areas.' },
    { id: 'HAZ005', type: 'Cloudburst', name: 'Cloudburst Warning',severity: 'HIGH',      state: 'Himachal Pradesh', lat: 31.10, lng: 77.17, radius: 30000, confidence: 81, eta: '3 hours', desc: 'Extreme rainfall warning. 200mm+ rainfall expected in 3 hours. Flash flood risk.' }
  ],

  // ---- Risk Zones (polygon approximations as circles for demo) ----
  riskZones: [
    { id: 'RZ001', level: 'RED',    name: 'Surat Coastal Zone',      lat: 21.17, lng: 72.83, radius: 15000, pop: 48000, desc: 'Direct cyclone landfall zone' },
    { id: 'RZ002', level: 'RED',    name: 'Brahmaputra Floodplain',  lat: 26.14, lng: 91.74, radius: 20000, pop: 82000, desc: 'Active flood inundation zone' },
    { id: 'RZ003', level: 'ORANGE', name: 'Chamoli High-Risk Zone',  lat: 30.37, lng: 79.32, radius: 12000, pop: 12400, desc: 'Landslide-prone hillside zone' },
    { id: 'RZ004', level: 'ORANGE', name: 'Imphal Valley Risk Zone', lat: 24.81, lng: 93.94, radius: 18000, pop: 34000, desc: 'Seismic vulnerability zone' },
    { id: 'RZ005', level: 'ORANGE', name: 'Kolkata Flood Risk',      lat: 22.57, lng: 88.36, radius: 25000, pop: 120000, desc: 'Urban flood inundation risk' },
    { id: 'RZ006', level: 'YELLOW', name: 'Mumbai Coastal Risk',     lat: 19.07, lng: 72.87, radius: 30000, pop: 210000, desc: 'Moderate coastal storm surge risk' },
    { id: 'RZ007', level: 'YELLOW', name: 'Jaipur Heat Zone',        lat: 26.91, lng: 75.78, radius: 35000, pop: 95000,  desc: 'Extreme heat stress zone' },
    { id: 'RZ008', level: 'GREEN',  name: 'Bengaluru Safe Zone',     lat: 12.97, lng: 77.59, radius: 40000, pop: 450000, desc: 'Low multi-hazard risk' },
    { id: 'RZ009', level: 'GREEN',  name: 'Pune Safe Zone',          lat: 18.52, lng: 73.85, radius: 30000, pop: 280000, desc: 'Minimal active hazard risk' }
  ],

  // ---- Safe Sites / Evacuation Shelters ----
  safeSites: [
    { id: 'SS001', name: 'Surat Relief Camp A',      lat: 21.22, lng: 72.92, capacity: 5000, current: 1240, type: 'Relief Camp',  amenities: ['Food','Water','Medical','Power'], district: 'Surat' },
    { id: 'SS002', name: 'Surat School Shelter',     lat: 21.18, lng: 72.95, capacity: 2000, current: 890,  type: 'Shelter',      amenities: ['Food','Water','Power'],           district: 'Surat' },
    { id: 'SS003', name: 'Guwahati Evacuation Hub',  lat: 26.18, lng: 91.73, capacity: 8000, current: 6200, type: 'Evacuation Hub',amenities: ['Food','Water','Medical','Power','Helipad'], district: 'Kamrup' },
    { id: 'SS004', name: 'Jorhat Relief Center',     lat: 26.75, lng: 94.21, capacity: 3000, current: 2100, type: 'Relief Camp',  amenities: ['Food','Water','Medical'],         district: 'Jorhat' },
    { id: 'SS005', name: 'Chamoli Safe Zone',        lat: 30.42, lng: 79.37, capacity: 1500, current: 220,  type: 'Shelter',      amenities: ['Food','Water'],                   district: 'Chamoli' },
    { id: 'SS006', name: 'Imphal Central Shelter',   lat: 24.82, lng: 93.97, capacity: 4000, current: 1800, type: 'Shelter',      amenities: ['Food','Water','Medical','Power'], district: 'Imphal East' },
    { id: 'SS007', name: 'Mandav Evacuation Point',  lat: 22.22, lng: 75.38, capacity: 2500, current: 0,    type: 'Evacuation Point', amenities: ['Water','Power'],              district: 'Dhar' }
  ],

  // ---- Habitations (villages/towns at risk) ----
  habitations: [
    { id: 'HAB001', name: 'Olpad',       lat: 21.33, lng: 72.74, pop: 18200, risk: 'RED',    hazard: 'Cyclone',   district: 'Surat',        evacuated: false },
    { id: 'HAB002', name: 'Hazira',      lat: 21.10, lng: 72.61, pop: 22000, risk: 'RED',    hazard: 'Cyclone',   district: 'Surat',        evacuated: true  },
    { id: 'HAB003', name: 'Majuli',      lat: 26.94, lng: 94.16, pop: 16700, risk: 'RED',    hazard: 'Flood',     district: 'Majuli',       evacuated: false },
    { id: 'HAB004', name: 'Joshimath',   lat: 30.55, lng: 79.56, pop: 4200,  risk: 'ORANGE', hazard: 'Landslide', district: 'Chamoli',      evacuated: false },
    { id: 'HAB005', name: 'Ukhrul',      lat: 25.09, lng: 94.35, pop: 5800,  risk: 'ORANGE', hazard: 'Earthquake',district: 'Ukhrul',       evacuated: false },
    { id: 'HAB006', name: 'Dharamshala', lat: 32.21, lng: 76.32, pop: 24000, risk: 'YELLOW', hazard: 'Cloudburst',district: 'Kangra',       evacuated: false },
    { id: 'HAB007', name: 'Leh',         lat: 34.16, lng: 77.58, pop: 30000, risk: 'YELLOW', hazard: 'Earthquake',district: 'Leh',          evacuated: false },
    { id: 'HAB008', name: 'Mysuru',      lat: 12.29, lng: 76.64, pop: 95000, risk: 'GREEN',  hazard: 'None',      district: 'Mysuru',       evacuated: false }
  ],

  // ---- Hospitals ----
  hospitals: [
    { id: 'HOSP001', name: 'AIIMS Raipur',          lat: 21.26, lng: 81.65, beds: 800,  emergency: true  },
    { id: 'HOSP002', name: 'GMCH Guwahati',          lat: 26.14, lng: 91.81, beds: 1200, emergency: true  },
    { id: 'HOSP003', name: 'Surat Civil Hospital',   lat: 21.20, lng: 72.86, beds: 1500, emergency: true  },
    { id: 'HOSP004', name: 'JNIMS Imphal',            lat: 24.83, lng: 93.96, beds: 600,  emergency: true  },
    { id: 'HOSP005', name: 'District Hospital Kullu', lat: 31.96, lng: 77.10, beds: 300,  emergency: true  }
  ],

  // ---- Citizen Reports ----
  citizenReports: [
    { id: 'REP001', lat: 21.20, lng: 72.80, type: 'Flood',     severity: 'High',   status: 'Verified',  desc: 'Roads submerged near Olpad market area, knee-deep water', time: '2h ago',  reporter: 'Ankit Shah',    phone: '+91-**-****-3421', upvotes: 14 },
    { id: 'REP002', lat: 26.15, lng: 91.70, type: 'Flood',     severity: 'High',   status: 'Pending',   desc: 'Bridge damaged on NH-27 near Jalukbari, traffic stopped', time: '45m ago', reporter: 'Priya Deka',    phone: '+91-**-****-8821', upvotes: 7  },
    { id: 'REP003', lat: 30.37, lng: 79.30, type: 'Landslide', severity: 'Medium', status: 'Reviewing', desc: 'Small landslide on Badrinath highway, minor debris', time: '3h ago',  reporter: 'Ram Rawat',     phone: '+91-**-****-5541', upvotes: 3  },
    { id: 'REP004', lat: 32.21, lng: 76.30, type: 'Storm',     severity: 'Low',    status: 'Pending',   desc: 'Heavy rainfall with hail stones, tree fell on road', time: '1h ago',  reporter: 'Sheetal Verma', phone: '+91-**-****-9921', upvotes: 2  },
    { id: 'REP005', lat: 24.82, lng: 93.92, type: 'Earthquake',severity: 'Medium', status: 'Verified',  desc: 'Cracks visible in 2 buildings in Sagolband area', time: '6h ago',  reporter: 'Ibomcha Singh', phone: '+91-**-****-1141', upvotes: 22 }
  ],

  // ---- Alert Feed ----
  alerts: [
    { id: 'ALT001', level: 'CRITICAL', type: 'Cyclone',    title: 'Cyclone Vayu Landfall Warning',     time: '14:32', area: 'Gujarat Coastline',   confidence: 91, sources: ['IMD','NCMRWF','Satellite'], active: true },
    { id: 'ALT002', level: 'HIGH',     type: 'Flood',      title: 'Brahmaputra Danger Level Exceeded', time: '13:15', area: 'Assam — 9 Districts', confidence: 96, sources: ['CWC','RFRC','Ground Station'], active: true },
    { id: 'ALT003', level: 'HIGH',     type: 'Landslide',  title: 'Landslide Susceptibility Alert',    time: '12:48', area: 'Uttarakhand Hills',   confidence: 74, sources: ['GSI','Rainfall Data'],       active: true },
    { id: 'ALT004', level: 'MODERATE', type: 'Earthquake', title: 'Aftershock Activity Ongoing',       time: '11:22', area: 'Manipur',             confidence: 68, sources: ['IMD Seismology','USGS'],     active: true },
    { id: 'ALT005', level: 'MODERATE', type: 'Cloudburst', title: 'Extreme Rainfall 6h Forecast',      time: '10:55', area: 'HP — Kangra, Kullu',  confidence: 79, sources: ['IMD','ECMWF','Radar'],       active: true },
    { id: 'ALT006', level: 'INFO',     type: 'Heat Wave',  title: 'Heat Wave Advisory Rajasthan',      time: '09:30', area: 'Rajasthan',           confidence: 88, sources: ['IMD'],                       active: false }
  ],

  // ---- Multi-Risk Data (for charts) ----
  multiRiskBreakdown: {
    labels: ['Flood','Cyclone','Landslide','Earthquake','Drought','Heat Wave','Cloudburst','Coastal Erosion'],
    affected: [82000, 48000, 12400, 34000, 5200, 95000, 8000, 12000],
    riskScores: [9.1, 8.7, 6.2, 5.8, 4.1, 5.4, 7.2, 3.8]
  },

  // ---- Historical Events ----
  historicalEvents: [
    { year: 2023, type: 'Cyclone',    name: 'Biparjoy', affected: 120000, state: 'Gujarat' },
    { year: 2022, type: 'Flood',      name: 'Assam Floods', affected: 5800000, state: 'Assam' },
    { year: 2021, type: 'Landslide',  name: 'Chamoli Disaster', affected: 200, state: 'Uttarakhand' },
    { year: 2020, type: 'Cyclone',    name: 'Amphan', affected: 4900000, state: 'West Bengal' },
    { year: 2019, type: 'Flood',      name: 'Kerala Floods', affected: 2100000, state: 'Kerala' }
  ],

  // ---- Summary Stats ----
  summary: {
    activeHazards: 5,
    highRiskHabitations: 24,
    populationAtRisk: 296000,
    safeSiteCapacity: 26000,
    safeOccupancy: 12450,
    activeAlerts: 5,
    verifiedReports: 2,
    pendingReports: 3,
    overallRiskScore: 7.8
  }
};

// Weather simulation
const WEATHER_DATA = {
  'Gujarat': { temp: 34, feels: 38, humidity: 78, wind: 85, condition: 'Stormy', icon: '⛈️' },
  'Assam':   { temp: 28, feels: 34, humidity: 92, wind: 22, condition: 'Heavy Rain', icon: '🌧️' },
  'Uttarakhand': { temp: 18, feels: 14, humidity: 88, wind: 35, condition: 'Rainy', icon: '🌨️' },
  'Manipur': { temp: 25, feels: 26, humidity: 82, wind: 18, condition: 'Cloudy', icon: '⛅' },
  'Himachal Pradesh': { temp: 16, feels: 12, humidity: 85, wind: 40, condition: 'Stormy', icon: '⛈️' },
  'default': { temp: 29, feels: 31, humidity: 65, wind: 12, condition: 'Partly Cloudy', icon: '⛅' }
};
