// ================================================================
// FIREBASE-CONFIG.JS — Live Firebase Firestore Database Credentials
// ================================================================

// Default Firebase Configuration
// Replace these values with your own project config from the Firebase Console:
// https://console.firebase.google.com/ -> Project Settings -> General -> Your apps -> Web app
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemoKey-GeoShieldLiveDisasterSync2026",
  authDomain: "geoshield-live-mesh.firebaseapp.com",
  projectId: "geoshield-live-mesh",
  storageBucket: "geoshield-live-mesh.firebasestorage.app",
  messagingSenderId: "721948301824",
  appId: "1:721948301824:web:98a4e1bc63812fa9b4d"
};

/**
 * Retrieves the active Firebase configuration.
 * Prioritizes user-supplied runtime keys in localStorage so users can
 * paste their Firebase credentials directly via the UI settings modal.
 */
function getFirebaseConfig() {
  try {
    const custom = localStorage.getItem('geoshield_firebase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return { ...parsed, isCustom: true };
      }
    }
  } catch (e) {
    console.warn('Could not read custom Firebase config from localStorage:', e);
  }
  return { ...DEFAULT_FIREBASE_CONFIG, isCustom: false };
}

/**
 * Saves custom Firebase configuration to localStorage.
 */
function saveFirebaseConfig(config) {
  try {
    if (!config) {
      localStorage.removeItem('geoshield_firebase_config');
      return true;
    }
    localStorage.setItem('geoshield_firebase_config', JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Error saving Firebase config to localStorage:', e);
    return false;
  }
}

/**
 * Checks if the current config is a user-provided custom project.
 */
function isCustomFirebaseConfig() {
  return getFirebaseConfig().isCustom;
}
