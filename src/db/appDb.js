/**
 * Voyage Travel Planner - Unified Client Database Engine (AppDB)
 * 
 * Manages persistent structured storage for:
 * - Custom Destinations (customDestinations)
 * - Custom Trips & Day Schedules (trips)
 * - Budget Limits & Daily Expenses (budgets, expenses)
 * - Visited Places, Ratings & Notes (visited)
 * - Packing Checklists per Destination (checklists)
 * - User Preferences (preferences)
 * 
 * Provides:
 * - Reactive Pub/Sub event listeners
 * - One-click JSON backup export & restore
 * - Automatic schema migration from legacy localStorage keys
 */

const DB_PREFIX = 'voyage_db_';

class AppDB {
  constructor() {
    this.listeners = new Map();
    this._initMigration();
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
        try {
          cb(data);
        } catch (err) {
          console.error(`[AppDB] Listener error on table ${table}:`, err);
        }
      });
    }
    // Also notify global wildcard listeners
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

  // Automatic Migration from Legacy Keys
  _initMigration() {
    try {
      if (typeof localStorage === 'undefined') return;
      // 1. Custom Destinations
      const legacyDests = localStorage.getItem('custom_dests');
      if (legacyDests && !localStorage.getItem(DB_PREFIX + 'custom_destinations')) {
        this._setItem('custom_destinations', JSON.parse(legacyDests));
      }

      // 2. Custom Trips
      const legacyTrips = localStorage.getItem('custom_trips');
      if (legacyTrips && !localStorage.getItem(DB_PREFIX + 'trips')) {
        this._setItem('trips', JSON.parse(legacyTrips));
      }

      // 3. Expenses & Budget Limit
      const legacyBudget = localStorage.getItem('budget_limit');
      if (legacyBudget && !localStorage.getItem(DB_PREFIX + 'budget_limit')) {
        this._setItem('budget_limit', Number(legacyBudget));
      }

      const legacyExpenses = localStorage.getItem('budget_expenses');
      if (legacyExpenses && !localStorage.getItem(DB_PREFIX + 'expenses')) {
        this._setItem('expenses', JSON.parse(legacyExpenses));
      }

      // 4. Visited Cities
      const legacyVisited = localStorage.getItem('visited_cities');
      if (legacyVisited && !localStorage.getItem(DB_PREFIX + 'visited')) {
        this._setItem('visited', JSON.parse(legacyVisited));
      }

      // 5. Preferences
      const legacyTheme = localStorage.getItem('app_theme');
      if (legacyTheme && !localStorage.getItem(DB_PREFIX + 'pref_theme')) {
        this._setItem('pref_theme', legacyTheme);
      }

      const legacyLang = localStorage.getItem('app_lang');
      if (legacyLang && !localStorage.getItem(DB_PREFIX + 'pref_lang')) {
        this._setItem('pref_lang', legacyLang);
      }
    } catch (e) {
      console.warn('[AppDB] Migration notice:', e);
    }
  }

  // 1. Custom Destinations API
  customDestinations = {
    getAll: () => this._getItem('custom_destinations', []),
    getById: (id) => this.customDestinations.getAll().find(d => d.id === id) || null,
    create: (dest) => {
      const items = this.customDestinations.getAll();
      const newDest = {
        ...dest,
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

  // 2. Custom Trips API
  trips = {
    getAll: () => this._getItem('trips', []),
    getById: (id) => this.trips.getAll().find(t => t.id === id) || null,
    create: (trip) => {
      const items = this.trips.getAll();
      const newTrip = {
        ...trip,
        id: trip.id || `trip_${Date.now()}`,
        createdAt: trip.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const updated = [newTrip, ...items];
      this._setItem('trips', updated);
      this._notify('trips', updated);
      return newTrip;
    },
    update: (id, tripData) => {
      const items = this.trips.getAll().map(t => 
        t.id === id ? { ...t, ...tripData, updatedAt: new Date().toISOString() } : t
      );
      this._setItem('trips', items);
      this._notify('trips', items);
      return items.find(t => t.id === id);
    },
    delete: (id) => {
      const items = this.trips.getAll().filter(t => t.id !== id);
      this._setItem('trips', items);
      this._notify('trips', items);
      return items;
    }
  };

  // 3. Expenses API
  expenses = {
    getAll: () => this._getItem('expenses', []),
    create: (expense) => {
      const items = this.expenses.getAll();
      const newExp = {
        ...expense,
        id: expense.id || `exp_${Date.now()}`,
        createdAt: expense.createdAt || new Date().toISOString()
      };
      const updated = [newExp, ...items];
      this._setItem('expenses', updated);
      this._notify('expenses', updated);
      return newExp;
    },
    delete: (id) => {
      const items = this.expenses.getAll().filter(e => e.id !== id);
      this._setItem('expenses', items);
      this._notify('expenses', items);
      return items;
    },
    clear: () => {
      this._setItem('expenses', []);
      this._notify('expenses', []);
    }
  };

  // 4. Budget Settings API
  budgets = {
    getLimit: (defaultLimit = 1500000) => this._getItem('budget_limit', defaultLimit),
    setLimit: (limit) => {
      this._setItem('budget_limit', Number(limit));
      this._notify('budget_limit', Number(limit));
    }
  };

  // 5. Visited Cities API
  visited = {
    getAll: () => this._getItem('visited', []),
    isVisited: (id) => this.visited.getAll().some(v => v.id === id),
    add: (city) => {
      const items = this.visited.getAll();
      if (items.some(v => v.id === city.id)) return items;
      const newVisited = {
        ...city,
        visitedDate: city.visitedDate || new Date().toISOString().split('T')[0],
        rating: city.rating || 5,
        memo: city.memo || '',
        createdAt: new Date().toISOString()
      };
      const updated = [newVisited, ...items];
      this._setItem('visited', updated);
      this._notify('visited', updated);
      return updated;
    },
    remove: (id) => {
      const items = this.visited.getAll().filter(v => v.id !== id);
      this._setItem('visited', items);
      this._notify('visited', items);
      return items;
    },
    update: (id, updates) => {
      const items = this.visited.getAll().map(v => 
        v.id === id ? { ...v, ...updates } : v
      );
      this._setItem('visited', items);
      this._notify('visited', items);
      return items;
    }
  };

  // 6. Packing Checklists API
  checklists = {
    get: (destId, defaultItems = []) => {
      const key = `checklist_${destId}`;
      const stored = this._getItem(key);
      if (stored) return stored;
      this._setItem(key, defaultItems);
      return defaultItems;
    },
    save: (destId, items) => {
      const key = `checklist_${destId}`;
      this._setItem(key, items);
      this._notify(`checklist_${destId}`, items);
    },
    reset: (destId) => {
      const key = `checklist_${destId}`;
      this._removeItem(key);
      this._notify(`checklist_${destId}`, null);
    }
  };

  // 7. Preferences API
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

  // 8. Database Statistics, Backup & Restore
  backup = {
    getStats: () => {
      return {
        customDestinationsCount: this.customDestinations.getAll().length,
        tripsCount: this.trips.getAll().length,
        expensesCount: this.expenses.getAll().length,
        visitedCount: this.visited.getAll().length,
        totalExpensesKRW: this.expenses.getAll().reduce((sum, e) => sum + (e.amountInKRW || 0), 0),
        budgetLimit: this.budgets.getLimit()
      };
    },
    exportJSON: () => {
      const data = {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        tables: {
          custom_destinations: this.customDestinations.getAll(),
          trips: this.trips.getAll(),
          expenses: this.expenses.getAll(),
          budget_limit: this.budgets.getLimit(),
          visited: this.visited.getAll(),
          preferences: {
            theme: this.preferences.getTheme(),
            language: this.preferences.getLang()
          }
        }
      };
      return JSON.stringify(data, null, 2);
    },
    importJSON: (jsonString) => {
      try {
        const parsed = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
        if (!parsed.tables) throw new Error('Invalid backup file structure.');

        const { tables } = parsed;
        if (Array.isArray(tables.custom_destinations)) {
          this._setItem('custom_destinations', tables.custom_destinations);
          this._notify('custom_destinations', tables.custom_destinations);
        }
        if (Array.isArray(tables.trips)) {
          this._setItem('trips', tables.trips);
          this._notify('trips', tables.trips);
        }
        if (Array.isArray(tables.expenses)) {
          this._setItem('expenses', tables.expenses);
          this._notify('expenses', tables.expenses);
        }
        if (tables.budget_limit !== undefined) {
          this._setItem('budget_limit', tables.budget_limit);
          this._notify('budget_limit', tables.budget_limit);
        }
        if (Array.isArray(tables.visited)) {
          this._setItem('visited', tables.visited);
          this._notify('visited', tables.visited);
        }
        if (tables.preferences) {
          if (tables.preferences.theme) this.preferences.setTheme(tables.preferences.theme);
          if (tables.preferences.language) this.preferences.setLang(tables.preferences.language);
        }
        return { success: true };
      } catch (err) {
        console.error('[AppDB] Import error:', err);
        return { success: false, error: err.message };
      }
    },
    resetAll: () => {
      this._setItem('custom_destinations', []);
      this._setItem('trips', []);
      this._setItem('expenses', []);
      this._setItem('budget_limit', 1500000);
      this._setItem('visited', []);
      this._notify('*', 'reset');
    }
  };
}

export const appDb = new AppDB();
export default appDb;
