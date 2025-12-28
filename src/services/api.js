/**
 * Local API Service
 * Simulates REST API calls using localStorage and JSON data
 * This provides a mock backend for the application
 */

// Helper function to get data from localStorage or fallback to initial data
const getStorageData = (key, initialData) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with default data if not exists
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return initialData;
  }
};

// Helper function to save data to localStorage
const saveStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    return false;
  }
};

// Simulate API delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Generic CRUD operations
 */
export const api = {
  // GET - Fetch all items
  async get(resource) {
    await delay();
    const data = getStorageData(resource, []);
    return { data, status: 200 };
  },

  // GET by ID - Fetch single item
  async getById(resource, id) {
    await delay();
    const items = getStorageData(resource, []);
    const item = items.find(item => item.id === parseInt(id));
    if (!item) {
      return { data: null, status: 404, error: 'Not found' };
    }
    return { data: item, status: 200 };
  },

  // POST - Create new item
  async post(resource, newItem) {
    await delay();
    const items = getStorageData(resource, []);
    const maxId = items.length > 0 ? Math.max(...items.map(item => item.id)) : 0;
    const item = {
      ...newItem,
      id: maxId + 1,
      createdAt: newItem.createdAt || new Date().toISOString()
    };
    items.push(item);
    saveStorageData(resource, items);
    return { data: item, status: 201 };
  },

  // PUT - Update existing item
  async put(resource, id, updatedItem) {
    await delay();
    const items = getStorageData(resource, []);
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index === -1) {
      return { data: null, status: 404, error: 'Not found' };
    }
    items[index] = { ...items[index], ...updatedItem };
    saveStorageData(resource, items);
    return { data: items[index], status: 200 };
  },

  // DELETE - Remove item
  async delete(resource, id) {
    await delay();
    const items = getStorageData(resource, []);
    const filtered = items.filter(item => item.id !== parseInt(id));
    if (filtered.length === items.length) {
      return { data: null, status: 404, error: 'Not found' };
    }
    saveStorageData(resource, filtered);
    return { data: { id }, status: 200 };
  },

  // Query - Filter items by condition
  async query(resource, condition) {
    await delay();
    const items = getStorageData(resource, []);
    const filtered = items.filter(condition);
    return { data: filtered, status: 200 };
  }
};

// Initialize default data on first load
export const initializeData = () => {
  // Import initial data (this will be done by individual API files)
  // Data is loaded from JSON files and stored in localStorage
};

