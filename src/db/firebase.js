/**
 * Firebase Firestore Cloud Database Integration Module
 * 
 * Provides:
 * - Dynamic Firebase App & Firestore Initialization
 * - Multi-device Real-time Synchronization (Firestore onSnapshot)
 * - Safe Offline / Local Fallback
 * - Cloud Configuration persistence in localStorage
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot,
  enableIndexedDbPersistence
} from 'firebase/firestore';

const CLOUD_CONFIG_KEY = 'voyage_cloud_config';

// Default / Sample Firebase Configuration
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDummyKeyForVoyageTravelPlannerDemo123",
  authDomain: "voyage-travel-planner.firebaseapp.com",
  projectId: "voyage-travel-planner",
  storageBucket: "voyage-travel-planner.appspot.com",
  messagingSenderId: "1029384756",
  appId: "1:1029384756:web:abcdef123456789"
};

class CloudDBService {
  constructor() {
    this.app = null;
    this.db = null;
    this.isInitialized = false;
    this.isConnected = false;
    this.unsubscribers = [];
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
    
    // Validate config
    if (!config || !config.projectId || config.projectId === 'voyage-travel-planner') {
      // Mock / Local mode until real Firebase credentials are provided
      this.isInitialized = false;
      this.isConnected = false;
      return;
    }

    try {
      // Clean up previous listeners
      this.unsubscribers.forEach(unsub => unsub && unsub());
      this.unsubscribers = [];

      this.app = !getApps().length ? initializeApp(config) : getApp();
      this.db = getFirestore(this.app);
      this.isInitialized = true;
      this.isConnected = true;
      console.log('[CloudDB] Firebase Firestore successfully initialized for project:', config.projectId);
    } catch (err) {
      console.warn('[CloudDB] Firestore initialization note (Running in Local Mode):', err.message);
      this.isInitialized = false;
      this.isConnected = false;
    }
  }

  // Generic Cloud Document Setter
  async set(colName, docId, data) {
    if (!this.isInitialized || !this.db) return false;
    try {
      const docRef = doc(this.db, colName, String(docId));
      await setDoc(docRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      return true;
    } catch (err) {
      console.warn(`[CloudDB] Failed to set ${colName}/${docId}:`, err);
      return false;
    }
  }

  // Generic Cloud Document Remover
  async delete(colName, docId) {
    if (!this.isInitialized || !this.db) return false;
    try {
      const docRef = doc(this.db, colName, String(docId));
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.warn(`[CloudDB] Failed to delete ${colName}/${docId}:`, err);
      return false;
    }
  }

  // Fetch all documents in a collection
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
      console.warn(`[CloudDB] Failed to fetch ${colName}:`, err);
      return [];
    }
  }

  // Listen to collection in real time
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
