// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Removed useAuth import as it's not directly used here anymore

// Import Page Components
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Import Layout/Shared Components
import Navbar from './components/layout/Navbar'; // Import Navbar
// import Footer from './components/layout/Footer'; // Keep Footer commented for now

// Import PrivateRoute Component
import PrivateRoute from './components/PrivateRoute';

function App() {

  return (
    <Router> {/* Wrap everything in BrowserRouter */}
      <div className="flex flex-col min-h-screen bg-gray-100"> {/* Added background color */}
        {/* Render the Navbar at the top */}
        <Navbar />

        <main className="flex-grow container mx-auto px-4 py-8"> {/* Main content area */}
          <Routes> {/* Define all the routes */}

            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Private Routes Wrapper */}
            <Route element={<PrivateRoute />}>
              {/* Routes nested inside PrivateRoute require authentication */}
              <Route path="/" element={<DashboardPage />} /> {/* Default route */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* Add other private routes here */}
            </Route>

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />

          </Routes>
        </main>

        {/* Footer could go here */}
        {/* <Footer /> */}
      </div>
    </Router>
  );
}

export default App;

