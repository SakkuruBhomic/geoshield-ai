# GeoShield — full project setup

Two ways to run this project. For a live presentation, Option A is safest.

---

## Option A — Standalone disaster platform (no install, no internet risk)

The whole disaster platform lives in `public/app/` and is plain HTML/CSS/JS.

1. Open the folder `public/app/`.
2. Double-click `index.html`, or serve it: `python -m http.server 5500` inside that folder.
3. Open http://localhost:5500

In VS Code / Antigravity: open `public/app` as the workspace, install the
"Live Server" extension, right-click `index.html` → Open with Live Server.

See `public/app/README.md` for details.

---

## Option B — Full app (React + TanStack Start + Vite)

### Requirements
- Node.js 20+ (https://nodejs.org) — or Bun 1.1+ (https://bun.sh)

### Steps
```bash
npm install        # or: bun install
npm run dev        # or: bun run dev
```
Then open the URL printed in the terminal (usually http://localhost:8080).

`/` redirects to `/app/index.html`, the disaster platform.

### Production build
```bash
npm run build
npm run preview
```

---

## Project layout
```
public/app/        the disaster platform (HTML/CSS/JS, works on its own)
src/routes/        app routes (index.tsx redirects to the platform)
src/components/    UI components
src/styles.css     theme / design tokens
vite.config.ts     build config
package.json       dependencies + scripts
```

## Notes
- No API keys, no database, no login server needed — all demo data is bundled.
- Map tiles come from OpenStreetMap over the internet; keep a connection or a
  mobile hotspot handy during the demo.
- `node_modules` is not included in the ZIP; `npm install` recreates it.

## Troubleshooting
- Blank map → no internet for tiles; check the connection.
- `npm run dev` fails → confirm `node -v` shows 20 or higher.
- Port already in use → run `npm run dev -- --port 3000`.
