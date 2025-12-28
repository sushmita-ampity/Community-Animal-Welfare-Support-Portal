/**
 * Users API
 * Handles user authentication and user data operations
 */
import usersData from '../data/users.json';
import { api } from '../services/api';

const RESOURCE = 'users';

// Initialize users data
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(usersData));
}

/**
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} User object if authenticated, null otherwise
 */
export const login = async (email, password) => {
  const response = await api.query(RESOURCE, user => 
    user.email === email && user.password === password
  );
  
  if (response.data && response.data.length > 0) {
    const user = { ...response.data[0] };
    // Remove password from response
    delete user.password;
    return { data: user, status: 200 };
  }
  
  return { data: null, status: 401, error: 'Invalid credentials' };
};

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise} Created user object
 */
export const register = async (userData) => {
  // Check if email already exists
  const existing = await api.query(RESOURCE, user => user.email === userData.email);
  if (existing.data && existing.data.length > 0) {
    return { data: null, status: 400, error: 'Email already exists' };
  }

  const newUser = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'USER',
    phone: userData.phone || '',
    createdAt: new Date().toISOString()
  };

  return await api.post(RESOURCE, newUser);
};

/**
 * Get user by ID
 * @param {number} id - User ID
 * @returns {Promise} User object
 */
export const getUserById = async (id) => {
  const response = await api.getById(RESOURCE, id);
  if (response.data) {
    const user = { ...response.data };
    delete user.password; // Never return password
    return { ...response, data: user };
  }
  return response;
};

/**
 * Update user profile
 * @param {number} id - User ID
 * @param {object} updates - Updated user data
 * @returns {Promise} Updated user object
 */
export const updateUser = async (id, updates) => {
  const response = await api.put(RESOURCE, id, updates);
  if (response.data) {
    const user = { ...response.data };
    delete user.password;
    return { ...response, data: user };
  }
  return response;
};

/**
 * Get all users (Admin only)
 * @returns {Promise} Array of users
 */
export const getAllUsers = async () => {
  const response = await api.get(RESOURCE);
  // Remove passwords from all users
  if (response.data) {
    response.data = response.data.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
  return response;
};

