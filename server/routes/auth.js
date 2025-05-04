const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Registration Route ---
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  // Destructure required fields from request body
  const { name, email, password, phone } = req.body;

  try {
    // --- Basic Validation ---
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    // --- Check if user already exists ---
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // --- Create new user instance ---
    user = new User({
      name,
      email: email.toLowerCase(),
      password,
      phone,
    });

    // --- Save user to database ---
    await user.save(); // Triggers pre-save hook for hashing

    // --- Generate JWT ---
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration time
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token }); // Respond with status 201 (Created) and the token
      }
    );

  } catch (err) {
    console.error('Registration Error:', err.message);
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ msg: messages.join(', ') });
    }
    res.status(500).send('Server error during registration');
  }
});

// --- Login Route ---
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  try {
    // --- Basic Validation ---
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // --- Find user by email ---
    // We need to explicitly select the password field as it's set to 'select: false' in the schema
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // --- Check if user exists ---
    if (!user) {
      // Return a generic error message for security (don't reveal if email exists)
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // --- Compare entered password with stored hashed password ---
    const isMatch = await user.comparePassword(password);

    // --- Check if password matches ---
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' }); // Generic error message
    }

    // --- User authenticated, Generate JWT ---
    const payload = {
      user: {
        id: user.id // Use the user's MongoDB ID
      }
    };

    // Sign the token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expiration time
      (err, token) => {
        if (err) throw err; // Handle potential errors during signing
        // Send the token back to the client
        res.status(200).json({ token });
      }
    );

  } catch (err) {
    console.error('Login Error:', err.message);
    res.status(500).send('Server error during login');
  }
});


module.exports = router;

