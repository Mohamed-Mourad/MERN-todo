// src/components/layout/Navbar.js
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Adjust path as needed

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth(); // Get auth state and logout function
  const navigate = useNavigate(); // Hook for navigation after logout

  const handleLogout = () => {
    logout(); // Call logout function from context
    navigate('/login'); // Redirect to login page
  };

  // Define active link style for NavLink
  const activeClassName = "text-white bg-gray-900 px-3 py-2 rounded-md text-sm font-medium";
  const inactiveClassName = "text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium";

  return (
    <nav className="bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
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
                    Logout ({user?.name || user?.email}) {/* Display user name/email if available */}
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

          {/* Mobile Menu Button (Placeholder/Optional) */}
          {/* Add logic here if you need a hamburger menu for smaller screens */}
          {/* <div className="-mr-2 flex md:hidden">
             <button type="button" className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
               <span className="sr-only">Open main menu</span>
               {/* Icon when menu is closed/open */}
          {/* </button>
           </div> */}

        </div>
      </div>

      {/* Mobile Menu Panel (Placeholder/Optional) */}
      {/* Add logic here to show/hide based on mobile menu button state */}
      {/* <div className="md:hidden">
         <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
           {isAuthenticated ? ( ... mobile links ... ) : ( ... mobile links ...)}
         </div>
       </div> */}
    </nav>
  );
}

export default Navbar;

