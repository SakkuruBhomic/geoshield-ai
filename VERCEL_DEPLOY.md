# 🚀 Deploying GeoShield AI to Vercel

GeoShield is pre-configured with a root [`vercel.json`](file:///c:/Users/Bhomic/Downloads/GeoShield-full-project/vercel.json) that enables instant, zero-build static hosting directly from `public/app` with clean URLs and edge caching.

---

## ⚡ Option 1: Deploy via GitHub (Recommended — 1 Click)

1. **Initialize and push the repository to your GitHub**:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment and Firebase live database sync"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>.git
   git push -u origin main
   ```

2. **Import into Vercel**:
   - Go to **[https://vercel.com](https://vercel.com)** and sign in.
   - Click **Add New…** &rarr; **Project**.
   - Select your GitHub repository.
   - Vercel will automatically read [`vercel.json`](file:///c:/Users/Bhomic/Downloads/GeoShield-full-project/vercel.json):
     - **Output Directory**: `public/app`
     - **Build Command**: *None needed (instant static)*
   - Click **Deploy**.

Within 10 seconds, your site will be live worldwide at `https://<your-project>.vercel.app`!

---

## 💻 Option 2: Deploy via Vercel CLI

If you prefer to deploy directly from your local terminal:

1. Open PowerShell / Command Prompt in this folder:
   ```bash
   npx vercel
   ```
2. Follow the interactive prompts:
   - *Set up and deploy?* &rarr; **Y**
   - *Which scope?* &rarr; Select your Vercel account
   - *Link to existing project?* &rarr; **N**
   - *What's your project's name?* &rarr; `geoshield-ai`
   - *In which directory is your code located?* &rarr; `./`
3. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

---

## 🔗 Live Route Structure on Vercel

| URL Route | Destination File | Description |
| :--- | :--- | :--- |
| `https://<your-app>.vercel.app/` | `/index.html` | Portal Gateway & Login Screen |
| `https://<your-app>.vercel.app/citizen` | `/citizen.html` | Citizen Hazard Map & Reporting |
| `https://<your-app>.vercel.app/authority` | `/authority.html` | Command Center & Report Verification |
| `https://<your-app>.vercel.app/citizen.html` | `/citizen.html` | Direct HTML file link |
| `https://<your-app>.vercel.app/authority.html` | `/authority.html` | Direct HTML file link |
| `https://<your-app>.vercel.app/app/*` | Rewritten to root | Backward-compatibility rewrite |
