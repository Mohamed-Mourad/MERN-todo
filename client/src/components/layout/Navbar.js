import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Define active link style for NavLink
  const activeClassName = "text-white bg-gray-900 px-3 py-2 rounded-md text-sm font-medium";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-xl font-bold">
              ToDo App
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Authenticated Links */}
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                  >
                    Profile
                  </NavLink>
                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout ({user?.name || user?.email})
                  </button>
                </>
              ) : (
                <>
                  {/* Unauthenticated Links */}
                  <NavLink
                    to="/login"
                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

