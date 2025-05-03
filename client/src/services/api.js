// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Set the base URL for all API requests
  // Make sure this matches the port your backend server is running on
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api', // Default to 5001 if env var not set
  headers: {
    'Content-Type': 'application/json', // Default content type for requests
  },
});

/*
  Request Interceptor:
  This function will run before each request is sent.
  It checks if a token exists in localStorage (or wherever you store it)
  and adds it to the Authorization header if found.
*/
api.interceptors.request.use(
  (config) => {
    // Get the token from local storage (or your state management solution)
    const token = localStorage.getItem('authToken'); // Assuming you store the token with key 'authToken'

    // If a token exists, add it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

/*
  Response Interceptor (Optional but Recommended):
  This can be used to handle global errors, like 401 Unauthorized responses
  (e.g., redirecting to login if the token is invalid or expired).
*/
api.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    if (error.response && error.response.status === 401) {
      // Handle 401 Unauthorized error (e.g., token expired or invalid)
      console.error("Unauthorized access - 401");
      // Example: Clear token and redirect to login
      localStorage.removeItem('authToken');
      // Redirect logic might depend on your routing setup
      // window.location.href = '/login'; // Simple redirect, might cause full page reload
      // Or use history.push('/login') if using react-router's history object
    }
    // Return any error which is not due to authentication back to the caller
    return Promise.reject(error);
  }
);


export default api; // Export the configured instance

