// ================================================================
// FIREBASE-CONFIG.JS — Unified Cloud Backend Credentials (Supabase + Firebase)
// ================================================================

// Default Firebase Configuration
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDemoKey-GeoShieldLiveDisasterSync2026",
  authDomain: "geoshield-live-mesh.firebaseapp.com",
  projectId: "geoshield-live-mesh",
  storageBucket: "geoshield-live-mesh.firebasestorage.app",
  messagingSenderId: "721948301824",
  appId: "1:721948301824:web:98a4e1bc63812fa9b4d"
};

// Default Supabase Configuration (Placeholder)
const DEFAULT_SUPABASE_CONFIG = {
  url: "https://xyzcompany.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
};

/**
 * Returns active backend type: 'supabase' or 'firebase'
 */
function getBackendType() {
  try {
    const customType = localStorage.getItem('geoshield_backend_type');
    if (customType) return customType;
    const customSupabase = localStorage.getItem('geoshield_supabase_config');
    if (customSupabase) return 'supabase';
  } catch (e) {}
  return 'supabase'; // Supabase is primary fast backend
}

function setBackendType(type) {
  localStorage.setItem('geoshield_backend_type', type);
}

/**
 * Supabase Config Helpers
 */
function getSupabaseConfig() {
  try {
    const custom = localStorage.getItem('geoshield_supabase_config');
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.url && parsed.key) {
        return { ...parsed, isCustom: true };
      }
    }
  } catch (e) {}
  return { ...DEFAULT_SUPABASE_CONFIG, isCustom: false };
}

function saveSupabaseConfig(url, key) {
  try {
    if (!url || !key) {
      localStorage.removeItem('geoshield_supabase_config');
      return true;
    }
    localStorage.setItem('geoshield_supabase_config', JSON.stringify({ url: url.trim(), key: key.trim() }));
    localStorage.setItem('geoshield_backend_type', 'supabase');
    return true;
  } catch (e) {
    console.error('Error saving Supabase config:', e);
    return false;
  }
}

/**
 * Firebase Config Helpers
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
  } catch (e) {}
  return { ...DEFAULT_FIREBASE_CONFIG, isCustom: false };
}

function saveFirebaseConfig(config) {
  try {
    if (!config) {
      localStorage.removeItem('geoshield_firebase_config');
      return true;
    }
    localStorage.setItem('geoshield_firebase_config', JSON.stringify(config));
    localStorage.setItem('geoshield_backend_type', 'firebase');
    return true;
  } catch (e) {
    console.error('Error saving Firebase config:', e);
    return false;
  }
}
