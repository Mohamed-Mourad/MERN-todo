// src/pages/LoginPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import Input from '../components/common/Input'; // Import reusable Input
import Button from '../components/common/Button'; // Import reusable Button

function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // State for API errors
  const [loading, setLoading] = useState(false); // State for loading indicator

  const { login, isAuthenticated } = useAuth(); // Get login function and auth status
  const navigate = useNavigate(); // Hook for navigation
  const location = useLocation(); // Hook to get location state (for redirects)

  const { email, password } = formData;

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to dashboard or intended page after login
      const from = location.state?.from?.pathname || '/dashboard';
      console.log(`Already authenticated, redirecting to ${from}`);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  // Handle input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    try {
      await login({ email, password }); // Call login function from context
      // No need for manual navigation here, the useEffect above and PrivateRoute handle it
      console.log('Login successful, context/route will handle redirect.');
      // navigate('/dashboard'); // Context/PrivateRoute should handle this redirection
    } catch (err) {
      console.error('Login failed:', err);
      // Set error message based on response or default
      setError(err.msg || err.message || 'Login failed. Please check your credentials.');
      setLoading(false); // Reset loading state on error
    }
    // Note: setLoading(false) is handled implicitly on success by the redirect/unmount
    // or explicitly in the catch block. If the component doesn't unmount on success,
    // you might need setLoading(false) outside the try-catch.
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]"> {/* Adjust height as needed */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Login to your Account
        </h1>
        <form className="space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 sr-only">
              Email address
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              placeholder="Email address"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 sr-only">
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          <Button type="submit" disabled={loading} isLoading={loading}>
            Sign In
          </Button>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

