// src/pages/ProfilePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

function ProfilePage() {
  const { user, isLoading: authLoading, fetchUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Effect to initialize form data when user data is loaded or changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Handle input changes in the form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on change
    setSuccessMessage(''); // Clear success message on change
  };

  // Handle form submission for updating profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setIsLoading(true);

    // Filter out fields that haven't changed from the original user data
    const updatedFields = {};
    if (formData.name !== user.name) updatedFields.name = formData.name;
    if (formData.email !== user.email) updatedFields.email = formData.email;
    if (formData.phone !== user.phone) updatedFields.phone = formData.phone;

    if (Object.keys(updatedFields).length === 0) {
        setSuccessMessage("No changes detected.");
        setIsLoading(false);
        setIsEditing(false); // Exit edit mode if no changes
        return;
    }

    try {
      // Call the update service function
      const updatedUser = await userService.updateProfile(updatedFields);
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode on success

      await fetchUserProfile(); // Re-fetch to update context with latest data

    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(err.msg || err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle edit mode and reset form to current user data if cancelling
  const handleToggleEdit = () => {
    if (isEditing) {
      // If cancelling edit, reset form data to original user data
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
      });
      setError(null); // Clear any errors from edit mode
      setSuccessMessage(''); // Clear any success messages
    }
    setIsEditing(!isEditing); // Toggle edit state
  };

  // Display loading indicator if auth context is loading user
  if (authLoading && !user) {
    return <div className="text-center p-4">Loading profile...</div>;
  }

  // Display message if user data couldn't be loaded
  if (!user) {
    return <div className="text-center p-4 text-red-600">Could not load user profile.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Your Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Display Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded-md border border-green-300">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-md border border-red-300">
            {error}
          </div>
        )}

        {!isEditing ? (
          // --- View Mode ---
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Name</label>
              <p className="mt-1 text-lg text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-lg text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Phone</label>
              <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
            </div>
            <div className="pt-4">
              <Button onClick={handleToggleEdit}>
                Edit Profile
              </Button>
            </div>
          </div>
        ) : (
          // --- Edit Mode ---
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <Input
                type="tel"
                name="phone"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button type="submit" isLoading={isLoading} disabled={isLoading}>
                Save Changes
              </Button>
              <Button
                type="button"
                onClick={handleToggleEdit}
                disabled={isLoading}
                className="!bg-gray-500 hover:!bg-gray-600 focus:!ring-gray-400" 
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;

