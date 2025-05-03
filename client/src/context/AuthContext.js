// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('authToken') || null, // Initialize token from localStorage
    user: null,
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
  }, [authState.token]);

  // Effect to run on initial load to check token and fetch user
  useEffect(() => {
    console.log("AuthContext: Checking initial auth state...");
    setAuthState(prev => ({ ...prev, isLoading: true })); // Ensure loading is true initially
    fetchUserProfile();
  }, [fetchUserProfile]); // Run when fetchUserProfile function reference changes

  // Login function
  const login = async (credentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const data = await authService.login(credentials);
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
      throw error;
    } finally {
    }
  };

  
  const register = async (userData) => {
     setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
        const data = await authService.register(userData); 
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
  };

  // Value provided to consuming components
  const value = {
    ...authState, // token, user, isAuthenticated, isLoading
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

