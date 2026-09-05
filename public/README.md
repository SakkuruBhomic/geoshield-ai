# GeoShield — Disaster Intelligence Platform (standalone build)

This folder is the complete, self-contained web app. No build step, no accounts, no keys.

## Option 1 — Open instantly (fastest for a demo)
Double-click `index.html`. It opens in any browser and everything works
(portal → citizen dashboard → authority dashboard, maps, hazard intelligence).

## Option 2 — Run a tiny local server (recommended, most reliable)
From inside this folder run any one of these:

```bash
python -m http.server 5500       # then open http://localhost:5500
npx serve .                      # Node
php -S localhost:5500            # PHP
```

## Option 3 — VS Code / Antigravity
1. Open this folder as the workspace.
2. Install the "Live Server" extension.
3. Right-click `index.html` → "Open with Live Server".

## What's inside
```
index.html        portal / entry screen
citizen.html      citizen dashboard (hazard intelligence map)
authority.html    authority dashboard
css/              base, login, citizen, authority styles
js/  map.js       Leaflet map setup + basemap switching
     hazards.js   hazard datasets + risk/safe/alert/history rendering engine
     citizen.js   citizen dashboard logic
     authority.js authority dashboard logic
     data.js      shared reference data
     alerts.js    live alert feed
     reports.js   citizen reports
```

## Requirements
- Any modern browser.
- Internet connection (map tiles + Leaflet are loaded from public CDNs).

## Hazard colour scale
- Red — very high risk / red zones
- Orange — high risk
- Yellow — moderate / small risk
- Green — clean / safe zones

Supported hazards: cyclone, flood, landslide, earthquake, tsunami, cloudburst,
coastal erosion — each with its own red zones, safe zones, current risk,
previously affected areas, historical events, and affected population.
