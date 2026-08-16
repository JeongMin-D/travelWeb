/**
 * Voyage Travel Planner - User-Partitioned Client Database Engine (AppDB)
 * 
 * Features:
 * - Multi-tenant User Authentication (login, signup, logout, role-based access control)
 * - User-scoped data isolation (trips, budgets, expenses, visited, checklists)
 * - Full Global Cloud Database for all 911+ Destinations (destinations)
 * - Comprehensive Administrator Data Engine (admin)
 * - Direct Google Firebase Firestore Cloud Database Sync (cloud)
 * - Reactive Pub/Sub event bus
 */

import cloudDb from './firebase.js';

const DB_PREFIX = 'voyage_db_';

class AppDB {
  constructor() {
    this.listeners = new Map();
    this._initSeed();
    this._initCloudListeners();
  }

  // Pub/Sub Event System
  subscribe(table, callback) {
    if (!this.listeners.has(table)) {
      this.listeners.set(table, new Set());
    }
    this.listeners.get(table).add(callback);
    return () => this.listeners.get(table)?.delete(callback);
  }

  _notify(table, data) {
    if (this.listeners.has(table)) {
      this.listeners.get(table).forEach(cb => {
        try { cb(data); } catch (err) { console.error(`[AppDB] Listener error on ${table}:`, err); }
      });
    }
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach(cb => cb(table, data));
    }
  }

  // Low-level storage helpers
  _getItem(key, defaultVal = null) {
    try {
      if (typeof localStorage === 'undefined') return defaultVal;
      const raw = localStorage.getItem(DB_PREFIX + key);
      return raw ? JSON.parse(raw) : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  _setItem(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(DB_PREFIX + key, JSON.stringify(value));
    } catch (err) {
      console.error(`[AppDB] Failed to set ${key}:`, err);
    }
  }

  _removeItem(key) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.removeItem(DB_PREFIX + key);
    } catch (err) {
      console.error(`[AppDB] Failed to remove ${key}:`, err);
    }
  }

  // Seed default system administrator and initial setup
  _initSeed() {
    try {
      if (typeof localStorage === 'undefined') return;

      let users = this._getItem('users', []);
      let modified = false;

      // Ensure root system admin account always exists
      if (!users.some(u => u.username === 'admin')) {
        users.push({
          id: 'user_admin_001',
          username: 'admin',
          password: 'admin1234',
          name: '시스템 관리자',
          avatar: '🛡️',
          role: 'admin',
          email: 'admin@voyage.travel',
          createdAt: new Date().toISOString()
        });
        modified = true;
      }

      if (modified) {
        this._setItem('users', users);
      }
    } catch (e) {
      console.warn('[AppDB] Seed notice:', e);
    }
  }

  // Subscribe to real-time Cloud Firestore updates across all collections
  _initCloudListeners() {
    if (!cloudDb.isInitialized) return;

    try {
      // 1. Listen to cloud users
      cloudDb.subscribeCollection('users', (cloudUsers) => {
        if (cloudUsers && cloudUsers.length > 0) {
          this._setItem('users', cloudUsers);
          this._notify('users', cloudUsers);
          this._notify('auth', this.auth.getCurrentUser());
        }
      });

      // 2. Listen to cloud all destinations
      cloudDb.subscribeCollection('destinations', (cloudDests) => {
        if (cloudDests && cloudDests.length > 0) {
          this._setItem('destinations', cloudDests);
          this._notify('destinations', cloudDests);
        }
      });

      // 3. Listen to cloud trips
      cloudDb.subscribeCollection('trips', (cloudTrips) => {
        if (cloudTrips && cloudTrips.length > 0) {
          this._setItem('trips', cloudTrips);
          this._notify('trips', this.trips.getAll());
        }
      });

      // 4. Listen to cloud expenses
      cloudDb.subscribeCollection('expenses', (cloudExpenses) => {
        if (cloudExpenses && cloudExpenses.length > 0) {
          this._setItem('expenses', cloudExpenses);
          this._notify('expenses', this.expenses.getAll());
        }
      });

      // 5. Listen to cloud visited records
      cloudDb.subscribeCollection('visited', (cloudVisited) => {
        if (cloudVisited && cloudVisited.length > 0) {
          this._setItem('visited', cloudVisited);
          this._notify('visited', this.visited.getAll());
        }
      });
    } catch (e) {
      console.warn('[AppDB] Cloud listener setup notice:', e);
    }
  }

  // ==========================================
  // 1. AUTH & USER SESSION MANAGEMENT
  // ==========================================
  auth = {
    getCurrentUser: () => {
      const session = this._getItem('current_session', null);
      if (!session) return null;
      const users = this._getItem('users', []);
      return users.find(u => u.id === session.userId) || null;
    },

    getCurrentUserId: () => {
      const u = this.auth.getCurrentUser();
      return u ? u.id : null;
    },

    isAdmin: () => {
      const u = this.auth.getCurrentUser();
      return u?.role === 'admin';
    },

    login: async (username, password) => {
      const cleanUsername = (username || '').trim().toLowerCase();
      const cleanPassword = (password || '').trim();

      // Ensure admin check is always infallible
      if (cleanUsername === 'admin' && cleanPassword === 'admin1234') {
        let users = this._getItem('users', []);
        let adminUser = users.find(u => u.username === 'admin');
        if (!adminUser) {
          adminUser = {
            id: 'user_admin_001',
            username: 'admin',
            password: 'admin1234',
            name: '시스템 관리자',
            avatar: '🛡️',
            role: 'admin',
            email: 'admin@voyage.travel',
            createdAt: new Date().toISOString()
          };
          users.push(adminUser);
          this._setItem('users', users);
        }
        this._setItem('current_session', { userId: adminUser.id, loggedInAt: new Date().toISOString() });
        this._notify('auth', adminUser);
        this._notify('*', 'login');
        return { success: true, user: adminUser };
      }

      let users = this._getItem('users', []);
      let user = users.find(u => 
        u.username.toLowerCase() === cleanUsername && u.password === cleanPassword
      );

      // If not in local cache, check cloud Firestore
      if (!user && cloudDb.isInitialized) {
        try {
          const cloudUsers = await cloudDb.getAll('users');
          user = cloudUsers.find(u => 
            u.username.toLowerCase() === cleanUsername && u.password === cleanPassword
          );
          if (user) {
            this._setItem('users', [...users, user]);
          }
        } catch (e) {
          console.warn('[AppDB] Cloud user lookup error:', e);
        }
      }

      if (!user) {
        return { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' };
      }

      this._setItem('current_session', { userId: user.id, loggedInAt: new Date().toISOString() });
      this._notify('auth', user);
      this._notify('*', 'login');
      return { success: true, user };
    },

    signup: async ({ username, password, name, avatar = '✈️', email = '' }) => {
      const cleanUsername = (username || '').trim().toLowerCase();
      if (!cleanUsername || cleanUsername.length < 3) {
        return { success: false, error: '아이디는 3글자 이상이어야 합니다.' };
      }
      if (!password || password.length < 4) {
        return { success: false, error: '비밀번호는 4글자 이상이어야 합니다.' };
      }

      const users = this._getItem('users', []);
      if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
        return { success: false, error: '이미 존재하는 아이디입니다.' };
      }

      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        username: cleanUsername,
        password: password,
        name: (name || cleanUsername).trim(),
        avatar: avatar || '✈️',
        role: cleanUsername === 'admin' ? 'admin' : 'user',
        email: email.trim(),
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      this._setItem('users', updatedUsers);
      this._setItem('current_session', { userId: newUser.id, loggedInAt: new Date().toISOString() });
      
      // Async sync to Cloud Firestore
      cloudDb.set('users', newUser.id, newUser);

      this._notify('auth', newUser);
      this._notify('*', 'signup');
      return { success: true, user: newUser };
    },

    logout: () => {
      this._removeItem('current_session');
      this._notify('auth', null);
      this._notify('*', 'logout');
    }
  };

  // ==========================================
  // 2. USER-SCOPED TRIPS (Manual Planner)
  // ==========================================
  trips = {
    getAll: () => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];
      const all = this._getItem('trips', []);
      return all.filter(t => t.userId === uid);
    },

    getById: (id) => {
      const list = this.trips.getAll();
      return list.find(t => t.id === id) || null;
    },

    create: (tripData) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) throw new Error('로그인이 필요합니다.');

      const all = this._getItem('trips', []);
      const newTrip = {
        ...tripData,
        id: tripData.id || `trip_${Date.now()}`,
        userId: uid,
        createdAt: tripData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updated = [newTrip, ...all];
      this._setItem('trips', updated);
      cloudDb.set('trips', newTrip.id, newTrip);

      this._notify('trips', this.trips.getAll());
      return newTrip;
    },

    update: (id, updates) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) throw new Error('로그인이 필요합니다.');

      const all = this._getItem('trips', []);
      let updatedTrip = null;
      const updated = all.map(t => {
        if (t.id === id && t.userId === uid) {
          updatedTrip = { ...t, ...updates, updatedAt: new Date().toISOString() };
          return updatedTrip;
        }
        return t;
      });

      this._setItem('trips', updated);
      if (updatedTrip) cloudDb.set('trips', id, updatedTrip);

      this._notify('trips', this.trips.getAll());
      return this.trips.getById(id);
    },

    delete: (id) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('trips', []);
      const updated = all.filter(t => !(t.id === id && t.userId === uid));
      this._setItem('trips', updated);
      cloudDb.delete('trips', id);

      this._notify('trips', this.trips.getAll());
      return this.trips.getAll();
    }
  };

  // ==========================================
  // 3. USER-SCOPED EXPENSES & BUDGETS
  // ==========================================
  expenses = {
    getAll: () => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];
      const all = this._getItem('expenses', []);
      return all.filter(e => e.userId === uid);
    },

    create: (expense) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) throw new Error('로그인이 필요합니다.');

      const all = this._getItem('expenses', []);
      const newExp = {
        ...expense,
        id: expense.id || `exp_${Date.now()}`,
        userId: uid,
        createdAt: expense.createdAt || new Date().toISOString()
      };

      const updated = [newExp, ...all];
      this._setItem('expenses', updated);
      cloudDb.set('expenses', newExp.id, newExp);

      this._notify('expenses', this.expenses.getAll());
      return newExp;
    },

    delete: (id) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('expenses', []);
      const updated = all.filter(e => !(e.id === id && e.userId === uid));
      this._setItem('expenses', updated);
      cloudDb.delete('expenses', id);

      this._notify('expenses', this.expenses.getAll());
      return this.expenses.getAll();
    },

    clear: () => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return;

      const all = this._getItem('expenses', []);
      const userExps = all.filter(e => e.userId === uid);
      userExps.forEach(e => cloudDb.delete('expenses', e.id));

      const updated = all.filter(e => e.userId !== uid);
      this._setItem('expenses', updated);
      this._notify('expenses', []);
    }
  };

  budgets = {
    getLimit: (defaultLimit = 1500000) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return defaultLimit;
      return this._getItem(`budget_limit_${uid}`, defaultLimit);
    },

    setLimit: (limit) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return;
      this._setItem(`budget_limit_${uid}`, Number(limit));
      cloudDb.set('budgets', uid, { limit: Number(limit), userId: uid });
      this._notify('budget_limit', Number(limit));
    }
  };

  // ==========================================
  // 4. USER-SCOPED VISITED CITIES
  // ==========================================
  visited = {
    getAll: () => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];
      const all = this._getItem('visited', []);
      return all.filter(v => v.userId === uid);
    },

    isVisited: (destId) => {
      const list = this.visited.getAll();
      return list.some(v => v.id === destId);
    },

    add: (city) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) throw new Error('로그인이 필요합니다.');

      const all = this._getItem('visited', []);
      if (all.some(v => v.id === city.id && v.userId === uid)) {
        return this.visited.getAll();
      }

      const newVisited = {
        ...city,
        userId: uid,
        visitedDate: city.visitedDate || new Date().toISOString().split('T')[0],
        rating: city.rating || 5,
        memo: city.memo || '',
        createdAt: new Date().toISOString()
      };

      const updated = [newVisited, ...all];
      this._setItem('visited', updated);
      cloudDb.set('visited', `${uid}_${city.id}`, newVisited);

      this._notify('visited', this.visited.getAll());
      return this.visited.getAll();
    },

    remove: (destId) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('visited', []);
      const updated = all.filter(v => !(v.id === destId && v.userId === uid));
      this._setItem('visited', updated);
      cloudDb.delete('visited', `${uid}_${destId}`);

      this._notify('visited', this.visited.getAll());
      return this.visited.getAll();
    },

    update: (destId, updates) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('visited', []);
      let updatedRecord = null;
      const updated = all.map(v => {
        if (v.id === destId && v.userId === uid) {
          updatedRecord = { ...v, ...updates };
          return updatedRecord;
        }
        return v;
      });

      this._setItem('visited', updated);
      if (updatedRecord) cloudDb.set('visited', `${uid}_${destId}`, updatedRecord);

      this._notify('visited', this.visited.getAll());
      return this.visited.getAll();
    }
  };

  // ==========================================
  // 5. GLOBAL DESTINATIONS (Managed in Firebase Firestore)
  // ==========================================
  destinations = {
    getAll: () => this._getItem('destinations', []),
    getById: (id) => {
      const all = this.destinations.getAll();
      return all.find(d => d.id === id || d.name === id) || null;
    },
    create: (dest) => {
      const items = this.destinations.getAll();
      const newDest = {
        ...dest,
        id: dest.id || `dest_${Date.now()}`,
        createdAt: dest.createdAt || new Date().toISOString()
      };
      const updated = [newDest, ...items];
      this._setItem('destinations', updated);
      cloudDb.set('destinations', newDest.id, newDest);

      this._notify('destinations', updated);
      return newDest;
    },
    update: (id, updates) => {
      const items = this.destinations.getAll();
      let updatedDest = null;
      const updated = items.map(d => {
        if (d.id === id || d.name === id) {
          updatedDest = { ...d, ...updates, updatedAt: new Date().toISOString() };
          return updatedDest;
        }
        return d;
      });
      this._setItem('destinations', updated);
      if (updatedDest) cloudDb.set('destinations', id, updatedDest);

      this._notify('destinations', updated);
      return updatedDest;
    },
    delete: (id) => {
      const items = this.destinations.getAll().filter(d => d.id !== id && d.name !== id);
      this._setItem('destinations', items);
      cloudDb.delete('destinations', id);

      this._notify('destinations', items);
      return items;
    }
  };

  // Alias for backward compatibility
  customDestinations = this.destinations;

  preferences = {
    getTheme: () => this._getItem('pref_theme', 'light'),
    setTheme: (theme) => {
      this._setItem('pref_theme', theme);
      this._notify('pref_theme', theme);
    },
    getLang: () => this._getItem('pref_lang', 'en'),
    setLang: (lang) => {
      this._setItem('pref_lang', lang);
      this._notify('pref_lang', lang);
    }
  };

  // ==========================================
  // 6. CLOUD DB CONTROLS & SYNCHRONIZATION
  // ==========================================
  cloud = {
    getStatus: () => {
      return {
        isInitialized: cloudDb.isInitialized,
        isConnected: cloudDb.isConnected,
        projectId: cloudDb.getConfig()?.projectId || ''
      };
    },

    getConfig: () => cloudDb.getConfig(),

    saveConfig: (config) => {
      const ok = cloudDb.saveConfig(config);
      this._initCloudListeners();
      this._notify('*', 'cloud_config_update');
      return ok;
    },

    // Sync all local records to cloud Firestore
    syncLocalToCloud: async () => {
      if (!cloudDb.isInitialized) throw new Error('Cloud DB is not connected.');

      const users = this._getItem('users', []);
      for (const u of users) {
        await cloudDb.set('users', u.id, u);
      }

      const trips = this._getItem('trips', []);
      for (const t of trips) {
        await cloudDb.set('trips', t.id, t);
      }

      const expenses = this._getItem('expenses', []);
      for (const e of expenses) {
        await cloudDb.set('expenses', e.id, e);
      }

      const visited = this._getItem('visited', []);
      for (const v of visited) {
        await cloudDb.set('visited', `${v.userId}_${v.id}`, v);
      }

      const dests = this._getItem('destinations', []);
      for (const d of dests) {
        await cloudDb.set('destinations', d.id, d);
      }

      return {
        users: users.length,
        trips: trips.length,
        expenses: expenses.length,
        visited: visited.length,
        destinations: dests.length
      };
    },

    // Fetch all records from Cloud Firestore into local cache
    syncCloudToLocal: async () => {
      if (!cloudDb.isInitialized) throw new Error('Cloud DB is not connected.');

      const cloudUsers = await cloudDb.getAll('users');
      if (cloudUsers.length > 0) this._setItem('users', cloudUsers);

      const cloudTrips = await cloudDb.getAll('trips');
      if (cloudTrips.length > 0) this._setItem('trips', cloudTrips);

      const cloudExpenses = await cloudDb.getAll('expenses');
      if (cloudExpenses.length > 0) this._setItem('expenses', cloudExpenses);

      const cloudVisited = await cloudDb.getAll('visited');
      if (cloudVisited.length > 0) this._setItem('visited', cloudVisited);

      const cloudDests = await cloudDb.getAll('destinations');
      if (cloudDests.length > 0) this._setItem('destinations', cloudDests);

      this._notify('*', 'cloud_pull');
      return {
        users: cloudUsers.length,
        trips: cloudTrips.length,
        expenses: cloudExpenses.length,
        visited: cloudVisited.length,
        destinations: cloudDests.length
      };
    }
  };

  // ==========================================
  // 7. ADMINISTRATOR DATA MANAGEMENT API (Admin Only)
  // ==========================================
  admin = {
    _checkAdmin: () => {
      if (!this.auth.isAdmin()) {
        throw new Error('관리자 권한이 필요합니다.');
      }
    },

    getOverviewStats: () => {
      this.admin._checkAdmin();
      const users = this._getItem('users', []);
      const trips = this._getItem('trips', []);
      const expenses = this._getItem('expenses', []);
      const visited = this._getItem('visited', []);
      const dests = this._getItem('destinations', []);

      return {
        totalUsers: users.length,
        totalTrips: trips.length,
        totalExpenses: expenses.length,
        totalVisited: visited.length,
        totalDestinations: dests.length,
        totalExpenseKRW: expenses.reduce((sum, e) => sum + (e.amountInKRW || 0), 0)
      };
    },

    // Users CRUD
    getAllUsers: () => {
      this.admin._checkAdmin();
      return this._getItem('users', []);
    },

    updateUser: (userId, updates) => {
      this.admin._checkAdmin();
      const users = this._getItem('users', []);
      const updated = users.map(u => (u.id === userId ? { ...u, ...updates } : u));
      this._setItem('users', updated);
      const user = updated.find(u => u.id === userId);
      if (user) cloudDb.set('users', userId, user);

      this._notify('users', updated);
      return user;
    },

    deleteUser: (userId) => {
      this.admin._checkAdmin();
      if (userId === 'user_admin_001') {
        throw new Error('최고 관리자 계정은 삭제할 수 없습니다.');
      }
      const users = this._getItem('users', []).filter(u => u.id !== userId);
      this._setItem('users', users);
      cloudDb.delete('users', userId);

      // Cascade delete user data
      const trips = this._getItem('trips', []).filter(t => t.userId !== userId);
      const expenses = this._getItem('expenses', []).filter(e => e.userId !== userId);
      const visited = this._getItem('visited', []).filter(v => v.userId !== userId);
      this._setItem('trips', trips);
      this._setItem('expenses', expenses);
      this._setItem('visited', visited);
      this._removeItem(`budget_limit_${userId}`);

      this._notify('*', 'admin_update');
      return users;
    },

    // Trips Admin CRUD
    getAllTrips: () => {
      this.admin._checkAdmin();
      const trips = this._getItem('trips', []);
      const users = this._getItem('users', []);
      const userMap = Object.fromEntries(users.map(u => [u.id, u.name || u.username]));
      return trips.map(t => ({
        ...t,
        ownerName: userMap[t.userId] || '알 수 없는 사용자'
      }));
    },

    updateTrip: (tripId, updates) => {
      this.admin._checkAdmin();
      const trips = this._getItem('trips', []);
      let updatedTrip = null;
      const updated = trips.map(t => {
        if (t.id === tripId) {
          updatedTrip = { ...t, ...updates, updatedAt: new Date().toISOString() };
          return updatedTrip;
        }
        return t;
      });
      this._setItem('trips', updated);
      if (updatedTrip) cloudDb.set('trips', tripId, updatedTrip);

      this._notify('trips', updated);
      return updatedTrip;
    },

    deleteTrip: (tripId) => {
      this.admin._checkAdmin();
      const trips = this._getItem('trips', []).filter(t => t.id !== tripId);
      this._setItem('trips', trips);
      cloudDb.delete('trips', tripId);

      this._notify('trips', trips);
      return trips;
    },

    // Expenses Admin CRUD
    getAllExpenses: () => {
      this.admin._checkAdmin();
      const expenses = this._getItem('expenses', []);
      const users = this._getItem('users', []);
      const userMap = Object.fromEntries(users.map(u => [u.id, u.name || u.username]));
      return expenses.map(e => ({
        ...e,
        ownerName: userMap[e.userId] || '알 수 없는 사용자'
      }));
    },

    updateExpense: (expenseId, updates) => {
      this.admin._checkAdmin();
      const expenses = this._getItem('expenses', []);
      let updatedExp = null;
      const updated = expenses.map(e => {
        if (e.id === expenseId) {
          updatedExp = { ...e, ...updates };
          return updatedExp;
        }
        return e;
      });
      this._setItem('expenses', updated);
      if (updatedExp) cloudDb.set('expenses', expenseId, updatedExp);

      this._notify('expenses', updated);
      return updatedExp;
    },

    deleteExpense: (expenseId) => {
      this.admin._checkAdmin();
      const expenses = this._getItem('expenses', []).filter(e => e.id !== expenseId);
      this._setItem('expenses', expenses);
      cloudDb.delete('expenses', expenseId);

      this._notify('expenses', expenses);
      return expenses;
    },

    // Visited Records Admin CRUD
    getAllVisited: () => {
      this.admin._checkAdmin();
      const visited = this._getItem('visited', []);
      const users = this._getItem('users', []);
      const userMap = Object.fromEntries(users.map(u => [u.id, u.name || u.username]));
      return visited.map(v => ({
        ...v,
        ownerName: userMap[v.userId] || '알 수 없는 사용자'
      }));
    },

    updateVisited: (visitedId, updates) => {
      this.admin._checkAdmin();
      const visited = this._getItem('visited', []);
      let updatedVisited = null;
      const updated = visited.map(v => {
        if (v.id === visitedId) {
          updatedVisited = { ...v, ...updates };
          return updatedVisited;
        }
        return v;
      });
      this._setItem('visited', updated);
      if (updatedVisited) cloudDb.set('visited', `${updatedVisited.userId}_${visitedId}`, updatedVisited);

      this._notify('visited', updated);
      return updatedVisited;
    },

    deleteVisited: (visitedId) => {
      this.admin._checkAdmin();
      const visited = this._getItem('visited', []).filter(v => v.id !== visitedId);
      this._setItem('visited', visited);
      cloudDb.delete('visited', visitedId);

      this._notify('visited', visited);
      return visited;
    },

    // Destinations Admin CRUD (Full Firebase Firestore Management)
    getAllDestinations: () => {
      this.admin._checkAdmin();
      return this.destinations.getAll();
    },

    createDestination: (data) => {
      this.admin._checkAdmin();
      return this.destinations.create(data);
    },

    updateDestination: (id, updates) => {
      this.admin._checkAdmin();
      return this.destinations.update(id, updates);
    },

    deleteDestination: (id) => {
      this.admin._checkAdmin();
      return this.destinations.delete(id);
    }
  };
}

export const appDb = new AppDB();
export default appDb;
