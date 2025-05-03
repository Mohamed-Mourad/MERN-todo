// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import Input from '../components/common/Input'; // Import reusable Input
import Button from '../components/common/Button'; // Import reusable Button

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '', // For client-side validation
  });
  const [error, setError] = useState(''); // State for API errors
  const [loading, setLoading] = useState(false); // State for loading indicator

  const { register, isAuthenticated } = useAuth(); // Get register function and auth status
  const navigate = useNavigate(); // Hook for navigation

  const { name, email, phone, password, confirmPassword } = formData;

   // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log("Already authenticated, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  // Handle input changes
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors

    // --- Client-side validation ---
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return; // Stop submission
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
    }
    // Add more validation if needed (e.g., phone format)

    setLoading(true); // Set loading state

    try {
      // Call register function from context (or authService directly if preferred)
      await register({ name, email, phone, password });
      // If register function in context handles login, redirection will happen via useEffect
      // If register function doesn't auto-login, redirect to login page
      console.log('Registration successful');
      // Check if context automatically logs in or if we need manual redirect
      if (!isAuthenticated) { // If context didn't log us in automatically
          navigate('/login', { state: { message: 'Registration successful! Please log in.' } }); // Redirect to login with a message
      }
      // If context *does* auto-login, the useEffect above will handle the redirect to dashboard
    } catch (err) {
      console.error('Registration failed:', err);
      // Set error message based on response or default
      setError(err.msg || err.message || 'Registration failed. Please try again.');
      setLoading(false); // Reset loading state on error
    }
     // setLoading(false); // Might need this if component doesn't unmount on success
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]"> {/* Adjust height as needed */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create your Account
        </h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
              {error}
            </div>
          )}
          <Input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={onChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={onChange}
            required
          />
          <Input
            type="tel" // Use tel type for phone numbers
            name="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={onChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password (min. 6 characters)"
            value={password}
            onChange={onChange}
            required
          />
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={onChange}
            required
          />

          <Button type="submit" disabled={loading} isLoading={loading}>
            Register
          </Button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

