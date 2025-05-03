// src/services/authService.js
import api from './api'; // Import the configured Axios instance

/**
 * Registers a new user.
 * @param {object} userData - User data (name, email, password, phone).
 * @returns {Promise<object>} - The response data (likely including the token).
 */
const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data || error.message);
    throw error.response?.data || new Error('Registration failed');
  }
};

/**
 * Logs in a user.
 * @param {object} credentials - User credentials (email, password).
 * @returns {Promise<object>} - The response data (likely including the token).
 */
const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token); // Store token
    }
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    throw error.response?.data || new Error('Login failed');
  }
};

/**
 * Logs out a user (client-side).
 * Removes the token from storage.
 */
const logout = () => {
  localStorage.removeItem('authToken');
};

const getCurrentToken = () => {
    return localStorage.getItem('authToken');
}

// Export the functions
const authService = {
  register,
  login,
  logout,
  getCurrentToken
};

export default authService;


