// src/pages/RegisterPage.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
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

    setLoading(true);

    try {
      await register({ name, email, phone, password });
      console.log('Registration successful');
      if (!isAuthenticated) {
          navigate('/login', { state: { message: 'Registration successful! Please log in.' } }); 
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.msg || err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
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
            type="tel"
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

