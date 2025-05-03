// src/services/authService.js
import api from './api'; // Import the configured Axios instance

/**
 * Registers a new user.
 * @param {object} userData - User data (name, email, password, phone).
 * @returns {Promise<object>} - The response data (likely including the token).
 */
const register = async (userData) => {
  try {
    // Make a POST request to the /auth/register endpoint
    const response = await api.post('/auth/register', userData);
    // Return the data from the response (e.g., { token: '...' })
    return response.data;
  } catch (error) {
    // Log the error or handle it as needed
    console.error('Registration failed:', error.response?.data || error.message);
    // Re-throw the error or return a specific error object
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
    // Make a POST request to the /auth/login endpoint
    const response = await api.post('/auth/login', credentials);
     // If login is successful, store the token (e.g., in localStorage)
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token); // Store token
    }
    // Return the data from the response (e.g., { token: '...' })
    return response.data;
  } catch (error) {
    // Log the error or handle it as needed
    console.error('Login failed:', error.response?.data || error.message);
    // Re-throw the error or return a specific error object
    throw error.response?.data || new Error('Login failed');
  }
};

/**
 * Logs out a user (client-side).
 * Removes the token from storage.
 */
const logout = () => {
  // Remove the token from local storage
  localStorage.removeItem('authToken');
  // Note: No API call needed for simple JWT logout
  // If using server-side sessions or token blocklisting, an API call might be required here.
};

// Optional: Function to get the currently stored token
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


