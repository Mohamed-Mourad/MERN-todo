// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth(); // Get auth state from context

  // 1. If authentication state is still loading, show a loading indicator
  if (isLoading) {
    // You can replace this with a more sophisticated loading spinner/component
    return <div className="p-4 text-center">Loading...</div>;
  }

  // 2. If authenticated, render the child route (using Outlet)
  // 3. If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
  // 'replace' prevents the login route from being added to the history stack
};

export default PrivateRoute;

