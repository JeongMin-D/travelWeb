/**
 * Voyage Travel Planner - User-Partitioned Client Database Engine (AppDB)
 * 
 * Features:
 * - Multi-tenant User Authentication (login, signup, logout, demoLogin)
 * - User-scoped data isolation for:
 *   - Trips (trips)
 *   - Budgets & Expenses (budgets, expenses)
 *   - Visited Cities (visited)
 *   - Packing Checklists (checklists)
 * - Global shared data:
 *   - Custom Destinations (customDestinations)
 *   - User Preferences (preferences)
 * - Reactive Pub/Sub event bus
 * - JSON Backup & Restore
 */

const DB_PREFIX = 'voyage_db_';

class AppDB {
  constructor() {
    this.listeners = new Map();
    this._initSeed();
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

    login: (username, password) => {
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

      const users = this._getItem('users', []);
      const user = users.find(u => 
        u.username.toLowerCase() === cleanUsername && u.password === cleanPassword
      );

      if (!user) {
        return { success: false, error: '아이디 또는 비밀번호가 일치하지 않습니다.' };
      }

      this._setItem('current_session', { userId: user.id, loggedInAt: new Date().toISOString() });
      this._notify('auth', user);
      this._notify('*', 'login');
      return { success: true, user };
    },

    signup: ({ username, password, name, avatar = '✈️', email = '' }) => {
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
        role: 'user',
        email: email.trim(),
        createdAt: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      this._setItem('users', updatedUsers);
      this._setItem('current_session', { userId: newUser.id, loggedInAt: new Date().toISOString() });
      
      this._notify('auth', newUser);
      this._notify('*', 'signup');
      return { success: true, user: newUser };
    },

    isAdmin: () => {
      const u = this.auth.getCurrentUser();
      return u?.role === 'admin';
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
      this._notify('trips', this.trips.getAll());
      return newTrip;
    },

    update: (id, updates) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) throw new Error('로그인이 필요합니다.');

      const all = this._getItem('trips', []);
      const updated = all.map(t => {
        if (t.id === id && t.userId === uid) {
          return { ...t, ...updates, updatedAt: new Date().toISOString() };
        }
        return t;
      });

      this._setItem('trips', updated);
      this._notify('trips', this.trips.getAll());
      return this.trips.getById(id);
    },

    delete: (id) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('trips', []);
      const updated = all.filter(t => !(t.id === id && t.userId === uid));
      this._setItem('trips', updated);
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
      this._notify('expenses', this.expenses.getAll());
      return newExp;
    },

    delete: (id) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('expenses', []);
      const updated = all.filter(e => !(e.id === id && e.userId === uid));
      this._setItem('expenses', updated);
      this._notify('expenses', this.expenses.getAll());
      return this.expenses.getAll();
    },

    clear: () => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return;

      const all = this._getItem('expenses', []);
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
      this._notify('visited', this.visited.getAll());
      return this.visited.getAll();
    },

    remove: (destId) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('visited', []);
      const updated = all.filter(v => !(v.id === destId && v.userId === uid));
      this._setItem('visited', updated);
      this._notify('visited', this.visited.getAll());
      return this.visited.getAll();
    },

    update: (destId, updates) => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return [];

      const all = this._getItem('visited', []);
      const updated = all.map(v => {
        if (v.id === destId && v.userId === uid) {
          return { ...v, ...updates };
        }
        return v;
      });

      this._setItem('visited', updated);
      this._notify('visited', this.visited.getAll());
      return this.visited.getAll();
    }
  };

  // ==========================================
  // 5. USER-SCOPED CHECKLISTS
  // ==========================================
  checklists = {
    get: (destId, defaultItems = []) => {
      const uid = this.auth.getCurrentUserId() || 'guest';
      const key = `checklist_${uid}_${destId}`;
      const stored = this._getItem(key);
      if (stored) return stored;
      this._setItem(key, defaultItems);
      return defaultItems;
    },

    save: (destId, items) => {
      const uid = this.auth.getCurrentUserId() || 'guest';
      const key = `checklist_${uid}_${destId}`;
      this._setItem(key, items);
      this._notify(`checklist_${destId}`, items);
    },

    reset: (destId) => {
      const uid = this.auth.getCurrentUserId() || 'guest';
      const key = `checklist_${uid}_${destId}`;
      this._removeItem(key);
      this._notify(`checklist_${destId}`, null);
    }
  };

  // ==========================================
  // 6. GLOBAL SHARED: CUSTOM DESTINATIONS & PREFERENCES
  // ==========================================
  customDestinations = {
    getAll: () => this._getItem('custom_destinations', []),
    create: (dest) => {
      const items = this.customDestinations.getAll();
      const newDest = {
        ...dest,
        creatorId: this.auth.getCurrentUserId(),
        createdAt: dest.createdAt || new Date().toISOString()
      };
      const updated = [...items, newDest];
      this._setItem('custom_destinations', updated);
      this._notify('custom_destinations', updated);
      return newDest;
    },
    delete: (id) => {
      const items = this.customDestinations.getAll().filter(d => d.id !== id);
      this._setItem('custom_destinations', items);
      this._notify('custom_destinations', items);
      return items;
    }
  };

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
  // 7. BACKUP, RESTORE & STATS
  // ==========================================
  backup = {
    getStats: () => {
      const user = this.auth.getCurrentUser();
      return {
        currentUser: user ? user.name : null,
        tripsCount: this.trips.getAll().length,
        expensesCount: this.expenses.getAll().length,
        visitedCount: this.visited.getAll().length,
        totalExpensesKRW: this.expenses.getAll().reduce((sum, e) => sum + (e.amountInKRW || 0), 0),
        budgetLimit: this.budgets.getLimit(),
        customDestinationsCount: this.customDestinations.getAll().length
      };
    },

    exportJSON: () => {
      const user = this.auth.getCurrentUser();
      const uid = user ? user.id : null;
      const data = {
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        user: user ? { id: user.id, username: user.username, name: user.name } : null,
        tables: {
          trips: this.trips.getAll(),
          expenses: this.expenses.getAll(),
          budget_limit: this.budgets.getLimit(),
          visited: this.visited.getAll(),
          custom_destinations: this.customDestinations.getAll()
        }
      };
      return JSON.stringify(data, null, 2);
    },

    importJSON: (jsonString) => {
      try {
        const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        if (!parsed.tables) throw new Error('Invalid backup format.');
        const uid = this.auth.getCurrentUserId();
        if (!uid) throw new Error('로그인 후 백업을 복원할 수 있습니다.');

        const { tables } = parsed;
        if (Array.isArray(tables.trips)) {
          const remappedTrips = tables.trips.map(t => ({ ...t, userId: uid }));
          const otherTrips = this._getItem('trips', []).filter(t => t.userId !== uid);
          this._setItem('trips', [...remappedTrips, ...otherTrips]);
          this._notify('trips', this.trips.getAll());
        }

        if (Array.isArray(tables.expenses)) {
          const remappedExps = tables.expenses.map(e => ({ ...e, userId: uid }));
          const otherExps = this._getItem('expenses', []).filter(e => e.userId !== uid);
          this._setItem('expenses', [...remappedExps, ...otherExps]);
          this._notify('expenses', this.expenses.getAll());
        }

        if (tables.budget_limit !== undefined) {
          this.budgets.setLimit(tables.budget_limit);
        }

        if (Array.isArray(tables.visited)) {
          const remappedVisited = tables.visited.map(v => ({ ...v, userId: uid }));
          const otherVisited = this._getItem('visited', []).filter(v => v.userId !== uid);
          this._setItem('visited', [...remappedVisited, ...otherVisited]);
          this._notify('visited', this.visited.getAll());
        }

        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    resetAll: () => {
      const uid = this.auth.getCurrentUserId();
      if (!uid) return;

      const trips = this._getItem('trips', []).filter(t => t.userId !== uid);
      const exps = this._getItem('expenses', []).filter(e => e.userId !== uid);
      const visited = this._getItem('visited', []).filter(v => v.userId !== uid);

      this._setItem('trips', trips);
      this._setItem('expenses', exps);
      this._setItem('visited', visited);
      this._removeItem(`budget_limit_${uid}`);

      this._notify('*', 'reset');
    }
  };
}

export const appDb = new AppDB();
export default appDb;
