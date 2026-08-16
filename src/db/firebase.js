/**
 * Voyage Universal Cloud Database Service
 * 
 * Features:
 * 1. Zero-Setup Global Cloud Storage (Default) - Backed by live cloud JSON endpoint
 *    Live URL: https://api.restful-api.dev/objects/ff8081819ff5b11001a008db0604294f
 * 2. Optional Custom Firebase Firestore - If admin provides custom Firebase credentials, switches to dedicated Firestore.
 * 3. Automatic realtime polling & instant synchronization across all devices worldwide.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

const CLOUD_CONFIG_KEY = 'voyage_cloud_config';
const GLOBAL_CLOUD_ENDPOINT = 'https://api.restful-api.dev/objects/ff8081819ff5b11001a008db0604294f';

class CloudDBService {
  constructor() {
    this.app = null;
    this.db = null;
    this.mode = 'zero_config_cloud'; // 'custom_firebase' | 'zero_config_cloud'
    this.isInitialized = true;
    this.isConnected = true;
    this.unsubscribers = [];
    this.pollInterval = null;
    this.listeners = new Map();
    this.cachedCloudData = {
      users: [],
      trips: [],
      expenses: [],
      visited: [],
      custom_destinations: []
    };
    this.init();
  }

  getConfig() {
    try {
      if (typeof localStorage === 'undefined') return {};
      const stored = localStorage.getItem(CLOUD_CONFIG_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  saveConfig(config) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(config));
      }
      this.init(config);
      return true;
    } catch (err) {
      console.error('[CloudDB] Failed to save config:', err);
      return false;
    }
  }

  init(customConfig = null) {
    const config = customConfig || this.getConfig();

    // If real custom Firebase credentials are provided, use Firestore
    if (config && config.apiKey && config.projectId && config.projectId !== 'voyage-travel-planner' && !config.apiKey.includes('Dummy')) {
      try {
        this.unsubscribers.forEach(unsub => unsub && unsub());
        this.unsubscribers = [];
        if (this.pollInterval) clearInterval(this.pollInterval);

        this.app = !getApps().length ? initializeApp(config) : getApp();
        this.db = getFirestore(this.app);
        this.mode = 'custom_firebase';
        this.isInitialized = true;
        this.isConnected = true;
        console.log('[CloudDB] Connected to Custom Firebase Firestore:', config.projectId);
        return;
      } catch (err) {
        console.warn('[CloudDB] Custom Firebase error, falling back to Zero-Config Cloud:', err.message);
      }
    }

    // Default: Zero-Setup Live Global Cloud Mode
    this.mode = 'zero_config_cloud';
    this.isInitialized = true;
    this.isConnected = true;
    this._fetchFullCloudState().then(() => this._broadcastAll());
    this._startZeroConfigPolling();
    console.log('[CloudDB] Zero-Setup Global Cloud Active:', GLOBAL_CLOUD_ENDPOINT);
  }

  _startZeroConfigPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
    if (typeof window === 'undefined') return;

    // Poll cloud storage every 6 seconds for updates from other devices
    this.pollInterval = setInterval(async () => {
      if (this.mode !== 'zero_config_cloud') return;
      const changed = await this._fetchFullCloudState();
      if (changed) {
        this._broadcastAll();
      }
    }, 6000);
  }

  _broadcastAll() {
    for (const [colName, callbacks] of this.listeners.entries()) {
      const items = this.cachedCloudData[colName] || [];
      callbacks.forEach(cb => {
        try { cb(items); } catch (e) { /* silent */ }
      });
    }
  }

  // Fetch full cloud document
  async _fetchFullCloudState() {
    try {
      const res = await fetch(GLOBAL_CLOUD_ENDPOINT, {
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) return false;
      const json = await res.json();
      if (json && json.data) {
        const newData = {
          users: json.data.users || [],
          trips: json.data.trips || [],
          expenses: json.data.expenses || [],
          visited: json.data.visited || [],
          custom_destinations: json.data.custom_destinations || []
        };
        const isDifferent = JSON.stringify(newData) !== JSON.stringify(this.cachedCloudData);
        this.cachedCloudData = newData;
        return isDifferent;
      }
      return false;
    } catch {
      return false;
    }
  }

  // Push updated cloud document
  async _pushFullCloudState() {
    try {
      await fetch(GLOBAL_CLOUD_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "voyage_db",
          data: this.cachedCloudData
        })
      });
      return true;
    } catch (e) {
      console.warn('[CloudDB] Push error:', e);
      return false;
    }
  }

  // ==========================================
  // Public Unified Cloud CRUD API
  // ==========================================
  async set(colName, docId, data) {
    if (this.mode === 'custom_firebase' && this.db) {
      try {
        const docRef = doc(this.db, colName, String(docId));
        await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
        return true;
      } catch (err) {
        console.warn(`[CloudDB] Custom Firestore set error ${colName}/${docId}:`, err);
      }
    }

    // Zero-Config Cloud
    try {
      const list = this.cachedCloudData[colName] || [];
      const updated = list.filter(item => item.id !== docId && `${item.userId}_${item.id}` !== docId);
      updated.unshift({ ...data, id: data.id || docId, updatedAt: new Date().toISOString() });
      this.cachedCloudData[colName] = updated;
      await this._pushFullCloudState();
      this._broadcastAll();
      return true;
    } catch (e) {
      return false;
    }
  }

  async delete(colName, docId) {
    if (this.mode === 'custom_firebase' && this.db) {
      try {
        const docRef = doc(this.db, colName, String(docId));
        await deleteDoc(docRef);
        return true;
      } catch (err) {
        console.warn(`[CloudDB] Custom Firestore delete error ${colName}/${docId}:`, err);
      }
    }

    // Zero-Config Cloud
    try {
      const list = this.cachedCloudData[colName] || [];
      const updated = list.filter(item => item.id !== docId && `${item.userId}_${item.id}` !== docId);
      this.cachedCloudData[colName] = updated;
      await this._pushFullCloudState();
      this._broadcastAll();
      return true;
    } catch (e) {
      return false;
    }
  }

  async getAll(colName) {
    if (this.mode === 'custom_firebase' && this.db) {
      try {
        const colRef = collection(this.db, colName);
        const snapshot = await getDocs(colRef);
        const results = [];
        snapshot.forEach(docSnap => {
          results.push({ ...docSnap.data(), id: docSnap.id });
        });
        return results;
      } catch (err) {
        console.warn(`[CloudDB] Custom Firestore fetch error ${colName}:`, err);
      }
    }

    // Zero-Config Cloud
    if (!this.cachedCloudData[colName] || this.cachedCloudData[colName].length === 0) {
      await this._fetchFullCloudState();
    }
    return this.cachedCloudData[colName] || [];
  }

  subscribeCollection(colName, callback) {
    if (this.mode === 'custom_firebase' && this.db) {
      try {
        const colRef = collection(this.db, colName);
        const unsub = onSnapshot(colRef, (snapshot) => {
          const items = [];
          snapshot.forEach(docSnap => {
            items.push({ ...docSnap.data(), id: docSnap.id });
          });
          callback(items);
        }, (error) => {
          console.warn(`[CloudDB] Realtime listener error on ${colName}:`, error);
        });
        this.unsubscribers.push(unsub);
        return unsub;
      } catch (err) {
        console.warn(`[CloudDB] Subscribe error on ${colName}:`, err);
      }
    }

    // Zero-Config Cloud
    if (!this.listeners.has(colName)) {
      this.listeners.set(colName, new Set());
    }
    this.listeners.get(colName).add(callback);

    // Provide current state immediately
    const items = this.cachedCloudData[colName] || [];
    if (items.length > 0) callback(items);

    return () => {
      this.listeners.get(colName)?.delete(callback);
    };
  }
}

export const cloudDb = new CloudDBService();
export default cloudDb;
