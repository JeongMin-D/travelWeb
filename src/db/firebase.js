/**
 * Google Firebase Firestore Cloud Database Service
 * 
 * Project ID: my-travel-web-a1cb7
 * Features:
 * - Real-time synchronization across all devices via Firestore onSnapshot
 * - Persistent Cloud collections: users, trips, expenses, visited, custom_destinations
 * - Safe offline / local fallback
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

// User's Google Firebase Configuration
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBtAkLtJdJ3aOoGlcHu0VdOGmABG7l_8Is",
  authDomain: "my-travel-web-a1cb7.firebaseapp.com",
  projectId: "my-travel-web-a1cb7",
  storageBucket: "my-travel-web-a1cb7.firebasestorage.app",
  messagingSenderId: "535718528471",
  appId: "1:535718528471:web:3ea9e3916f55c6fd273792",
  measurementId: "G-559P8TCQXX"
};

class CloudDBService {
  constructor() {
    this.app = null;
    this.db = null;
    this.isInitialized = false;
    this.isConnected = false;
    this.unsubscribers = [];
    this.listeners = new Map();
    this.init();
  }

  getConfig() {
    try {
      if (typeof localStorage === 'undefined') return DEFAULT_FIREBASE_CONFIG;
      const stored = localStorage.getItem(CLOUD_CONFIG_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_FIREBASE_CONFIG;
    } catch {
      return DEFAULT_FIREBASE_CONFIG;
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

    try {
      this.unsubscribers.forEach(unsub => unsub && unsub());
      this.unsubscribers = [];

      this.app = !getApps().length ? initializeApp(config) : getApp();
      this.db = getFirestore(this.app);
      this.isInitialized = true;
      this.isConnected = true;
      console.log('[CloudDB] Connected to Google Firebase Firestore Project:', config.projectId);
    } catch (err) {
      console.warn('[CloudDB] Firestore initialization warning:', err.message);
      this.isInitialized = false;
      this.isConnected = false;
    }
  }

  // ==========================================
  // Public Firestore CRUD API
  // ==========================================
  async set(colName, docId, data) {
    if (!this.isInitialized || !this.db) return false;
    try {
      const cleanId = String(docId).replace(/\//g, '_');
      const docRef = doc(this.db, colName, cleanId);
      await setDoc(docRef, { ...data, id: data.id || cleanId, updatedAt: new Date().toISOString() }, { merge: true });
      return true;
    } catch (err) {
      console.warn(`[CloudDB] Firestore set error on ${colName}/${docId}:`, err);
      return false;
    }
  }

  async delete(colName, docId) {
    if (!this.isInitialized || !this.db) return false;
    try {
      const cleanId = String(docId).replace(/\//g, '_');
      const docRef = doc(this.db, colName, cleanId);
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn(`[CloudDB] Firestore delete error on ${colName}/${docId}:`, err);
      return false;
    }
  }

  async getAll(colName) {
    if (!this.isInitialized || !this.db) return [];
    try {
      const colRef = collection(this.db, colName);
      const snapshot = await getDocs(colRef);
      const results = [];
      snapshot.forEach(docSnap => {
        results.push({ ...docSnap.data(), id: docSnap.id });
      });
      return results;
    } catch (err) {
      console.warn(`[CloudDB] Firestore fetch error on ${colName}:`, err);
      return [];
    }
  }

  subscribeCollection(colName, callback) {
    if (!this.isInitialized || !this.db) return () => {};
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
      return () => {};
    }
  }
}

export const cloudDb = new CloudDBService();
export default cloudDb;
