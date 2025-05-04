const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

// --- Get Logged-in User's Profile ---
// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private (requires token)
router.get('/me', authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Return the user profile data
    res.json(user);

  } catch (err) {
    console.error('Get User Profile Error:', err.message);
    res.status(500).send('Server Error');
  }
});


// --- Update Logged-in User's Profile ---
// @route   PUT /api/users/me
// @desc    Update current user's profile (name, email, phone)
// @access  Private (requires token)
router.put(
    '/me',
    [
        authMiddleware, 
        body('name', 'Name is required').optional().not().isEmpty(),
        body('email', 'Please include a valid email').optional().isEmail(),
        body('phone', 'Phone number is required').optional().not().isEmpty(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Get fields to update from request body
        const { name, email, phone } = req.body;

        // Build user object with fields that were actually provided
        const userFields = {};
        if (name) userFields.name = name;
        if (email) userFields.email = email.toLowerCase(); // Store email in lowercase
        if (phone) userFields.phone = phone;

        // Ensure there's at least one field to update
        if (Object.keys(userFields).length === 0) {
            return res.status(400).json({ msg: 'No fields provided for update' });
        }

        try {
            // Find the user by ID from the token
            let user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({ msg: 'User not found' });
            }

            // --- Check for email conflict ---
            // If email is being updated, check if the new email already exists for another user
            if (userFields.email && userFields.email !== user.email) {
                const existingUser = await User.findOne({ email: userFields.email });
                if (existingUser && existingUser.id !== user.id) {
                    return res.status(400).json({ msg: 'Email already in use by another account' });
                }
            }

            // --- Update the user ---
            // Use findByIdAndUpdate to update the user document
            user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: userFields }, // $set to update only provided fields
                { new: true, runValidators: true } // runValidators ensures schema validations are checked on update
            ).select('-password');

            res.json(user); // Return the updated user profile

        } catch (err) {
            console.error('Update User Profile Error:', err.message);
             // Handle potential Mongoose validation errors during update
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(val => val.message);
                return res.status(400).json({ msg: messages.join(', ') });
            }
            res.status(500).send('Server Error');
        }
    }
);


module.exports = router;

