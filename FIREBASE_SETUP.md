# 🌐 Live Firebase Database Setup Guide for GeoShield AI

GeoShield uses **Google Cloud Firestore** to synchronize citizen disaster reports, authority verifications, and regional emergency alert broadcasts in real time across multiple computers, phones, and tablets.

---

## ⚡ Quick Setup (Takes ~2 Minutes, 100% Free)

### Step 1: Create a Free Firebase Project
1. Open the **[Firebase Console](https://console.firebase.google.com/)** and sign in with your Google account.
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g. `geoshield-disaster-ai`) and click **Continue**.
4. (Optional) Disable Google Analytics to make setup faster, then click **Create project**.

---

### Step 2: Enable Cloud Firestore Database
1. In the left navigation menu of your Firebase console, click **Build** &rarr; **Firestore Database**.
2. Click the **Create database** button.
3. Select your preferred database location (e.g. `asia-south1 (Mumbai)` or `us-central`).
4. Under **Security rules**, select **Start in test mode**:
   > *Test mode allows immediate read/write access so your citizen reports and authority alerts sync instantly without complex login walls.*
5. Click **Enable**.

---

### Step 3: Register Web App & Get Config
1. Go to **Project Settings** (click the gear icon ⚙️ next to "Project Overview" in the top-left sidebar).
2. Scroll down to the **Your apps** section and click the **Web icon (`</>`)**.
3. Enter an app nickname (e.g. `GeoShield Web`) and click **Register app**.
4. You will see a `firebaseConfig` snippet that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-YourActualApiKeyHere123456",
  authDomain: "geoshield-disaster-ai.firebaseapp.com",
  projectId: "geoshield-disaster-ai",
  storageBucket: "geoshield-disaster-ai.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

### Step 4: Connect Config to GeoShield (Two Ways)

#### Method A: In-App UI (No Code Changes Required! ⭐ Recommended)
1. Open GeoShield in your browser ([Citizen Portal](http://localhost:5500/citizen.html) or [Authority Portal](http://localhost:5500/authority.html)).
2. In the top bar, click the **🟢 Firebase Live** (or **⚡ Live Sync Mesh**) badge.
3. Paste your Firebase config JSON into the text box.
4. Click **💾 Save & Connect Cloud**.
5. Click **🌱 Seed Scenarios** to immediately populate your Firestore database with the India multi-hazard simulation datasets!

#### Method B: In Code
Open [`public/app/js/firebase-config.js`](file:///c:/Users/Bhomic/Downloads/GeoShield-full-project/public/app/js/firebase-config.js) and replace the default object with your copied config:

```javascript
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 🛰️ How Real-time Sync Works in GeoShield

| Action | What Happens in Firebase | Real-time Impact |
| :--- | :--- | :--- |
| **Citizen submits report** | Document added to `citizen_reports` | Authority Command Center verification queue receives it instantly + triggers an alert chime. |
| **Officer verifies report** | Report marked `Verified` in `citizen_reports` & new record created in `emergency_alerts` | All connected citizen screens display a red Emergency Warning Banner + audio alert. |
| **Officer dismisses report** | Report status updated to `Rejected` | Report is removed from the active queue and citizen credibility is adjusted. |
| **Emergency broadcast** | High-priority document pushed to `emergency_alerts` | Immediate nationwide/regional warning broadcast banner triggered across all citizens. |
| **Offline / Mesh Mode** | Local Storage + `BroadcastChannel` | If offline or before setting up keys, all tabs/windows automatically sync in real-time. |
