// src/services/api.js
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // Make sure this matches the port your backend server is running on
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Request Interceptor:
  This function will run before each request is sent.
  It checks if a token exists in localStorage
  and adds it to the Authorization header if found.
*/
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Assuming you store the token with key 'authToken'

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
  Response Interceptor:
  This can be used to handle global errors, like 401 Unauthorized responses
*/
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized access - 401");
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);


export default api;
