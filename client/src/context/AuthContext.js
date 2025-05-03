// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService'; // Import your auth service
import api from '../services/api'; // Import the api instance to potentially fetch user data

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create the Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('authToken') || null, // Initialize token from localStorage
    user: null, // User details (id, name, email, etc.)
    isAuthenticated: !!localStorage.getItem('authToken'), // Initial auth status based on token
    isLoading: true, // Start in loading state to check token validity/fetch user
  });

  // Function to fetch user profile based on token
  const fetchUserProfile = useCallback(async () => {
    if (!authState.token) {
        setAuthState(prev => ({ ...prev, user: null, isAuthenticated: false, isLoading: false }));
        return;
    }
    try {
        // Use the API instance which automatically includes the token
        // Assuming you have a GET /users/me endpoint
        const response = await api.get('/users/me');
        setAuthState(prev => ({
            ...prev,
            user: response.data, // Store user data
            isAuthenticated: true,
            isLoading: false,
        }));
    } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Token might be invalid/expired, clear state
        localStorage.removeItem('authToken');
        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    }
  }, [authState.token]); // Dependency on token

  // Effect to run on initial load to check token and fetch user
  useEffect(() => {
    console.log("AuthContext: Checking initial auth state...");
    setAuthState(prev => ({ ...prev, isLoading: true })); // Ensure loading is true initially
    fetchUserProfile();
  }, [fetchUserProfile]); // Run when fetchUserProfile function reference changes (which depends on token)

  // Login function
  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await authService.login(credentials); // Calls API, stores token in localStorage
      setAuthState(prev => ({
        ...prev,
        token: data.token, // Update token in state
        isAuthenticated: true,
        // User data will be fetched by fetchUserProfile effect due to token change
      }));
       // Manually trigger profile fetch immediately after successful login
      await fetchUserProfile();
      return data; // Return response data to the component
    } catch (error) {
      console.error("Login failed in context:", error);
      setAuthState(prev => ({ ...prev, isLoading: false })); // Stop loading on error
      throw error; // Re-throw error to be caught by the component
    } finally {
        // Ensure loading is set to false eventually, though fetchUserProfile handles it on success/failure
        // setAuthState(prev => ({ ...prev, isLoading: false })); // Might be redundant
    }
  };

  // Register function (optional in context, could be handled directly in component)
  // If included, it might log the user in immediately after registration
  const register = async (userData) => {
     setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
        const data = await authService.register(userData); // Calls API
        // Decide if registration should automatically log the user in
        if (data.token) {
            localStorage.setItem('authToken', data.token); // Store token if returned
             setAuthState(prev => ({
                ...prev,
                token: data.token,
                isAuthenticated: true,
            }));
            // Manually trigger profile fetch immediately after successful registration+login
            await fetchUserProfile();
        } else {
             setAuthState(prev => ({ ...prev, isLoading: false }));
        }
        return data;
    } catch (error) {
        console.error("Registration failed in context:", error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        throw error;
    }
  };


  // Logout function
  const logout = () => {
    authService.logout(); // Clears token from localStorage
    setAuthState({ // Reset state
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Optionally redirect using useNavigate hook if needed (can be done in component)
  };

  // Value provided to consuming components
  const value = {
    ...authState, // token, user, isAuthenticated, isLoading
    login,
    logout,
    register, // Include register if implemented here
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Create a Custom Hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    // Added null check for robustness
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

