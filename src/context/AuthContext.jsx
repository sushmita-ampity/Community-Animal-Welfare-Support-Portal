/**
 * Authentication Context
 * Manages user authentication state and role-based access
 */
import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../api/users.api';

const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * Provides authentication state and methods to child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login function
   * Authenticates user and stores in localStorage
   */
  const login = async (email, password) => {
    try {
      const response = await loginAPI(email, password);
      if (response.data) {
        setUser(response.data);
        localStorage.setItem('currentUser', JSON.stringify(response.data));
        return { success: true, user: response.data };
      }
      return { success: false, error: response.error || 'Invalid credentials' };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  };

  /**
   * Register function
   * Creates new user account
   */
  const register = async (userData) => {
    try {
      const response = await registerAPI(userData);
      if (response.data) {
        const newUser = { ...response.data };
        delete newUser.password; // Remove password before storing
        setUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        return { success: true, user: newUser };
      }
      return { success: false, error: response.error || 'Registration failed' };
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  /**
   * Logout function
   * Clears user data and localStorage
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  /**
   * Check if user has required role
   * @param {string|array} roles - Required role(s)
   * @returns {boolean}
   */
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const value = {
    user,
    login,
    register,
    logout,
    hasRole,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isVolunteer: user?.role === 'VOLUNTEER',
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth Hook
 * Provides access to authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

