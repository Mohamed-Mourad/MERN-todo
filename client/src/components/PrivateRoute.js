// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth(); // Get auth state from context

  // If authentication state is still loading, show a loading indicator
  if (isLoading) {
    return <div className="p-4 text-center">Loading...</div>;
  }

  // If authenticated, render the child route (using Outlet)
  // If not authenticated, redirect to the login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

