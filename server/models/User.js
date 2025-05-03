// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const Schema = mongoose.Schema;

// Define the User Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    // Prevent password from being returned in queries by default
    select: false,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  timestamps: true
});

// --- Mongoose Middleware for Password Hashing ---
// This function will run *before* a user document is saved ('save' hook)
UserSchema.pre('save', async function(next) {
  // 'this' refers to the current user document being saved

  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next(); // If password hasn't changed, proceed without hashing
  }

  try {
    // Generate a salt - higher rounds means more secure but slower
    const salt = await bcrypt.genSalt(10); // 10 rounds is generally recommended

    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);

    // Proceed with saving the document
    next();
  } catch (error) {
    // If an error occurs during hashing, pass it to the next middleware/error handler
    next(error);
  }
});

// --- Method to compare entered password with hashed password ---
// We add this method to the UserSchema so it's available on user instances
UserSchema.methods.comparePassword = async function(enteredPassword) {
  // 'this.password' refers to the hashed password stored in the database for this user
  // We need to explicitly select the password field when finding the user if it's set to 'select: false'
  return await bcrypt.compare(enteredPassword, this.password);
};


// Create and export the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;

