import api from './api'; // Import the configured Axios instance

/**
 * Fetches the profile data for the currently logged-in user.
 * Uses the token automatically attached by the Axios interceptor.
 * @returns {Promise<object>} - A promise that resolves to the user profile object (e.g., { id, name, email, phone }).
 */
const getProfile = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user profile:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch user profile');
  }
};

/**
 * Updates the profile data for the currently logged-in user.
 * Uses the token automatically attached by the Axios interceptor.
 * @param {object} updateData - An object containing the fields to update.
 * @param {string} [updateData.name] - New name.
 * @param {string} [updateData.email] - New email.
 * @param {string} [updateData.phone] - New phone number.
 * @returns {Promise<object>} - A promise that resolves to the updated user profile object.
 */
const updateProfile = async (updateData) => {
  try {
    const response = await api.put('/users/me', updateData);
    return response.data;
  } catch (error) {
    console.error('Failed to update user profile:', error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to update user profile');
  }
};


// Export the service functions
const userService = {
  getProfile,
  updateProfile,
};

export default userService;

