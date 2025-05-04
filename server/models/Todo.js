const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Todo Schema
const TodoSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: false, // Description is optional
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed'], // Only allow these two values
    default: 'pending', // Default status is pending
  },
  dueDate: {
    type: Date,
    required: false, // Due date is optional
  },
  // Reference to the User who owns this task
  user: {
    type: Schema.Types.ObjectId, // Store the User's MongoDB ID
    ref: 'User', // Reference the 'User' model we defined earlier
    required: true, // Each todo must belong to a user
  },
  // Optional: Timestamps for tracking creation and updates
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, {
  // Automatically manage createdAt and updatedAt fields
  timestamps: true
});

// Create and export the Todo model
// Mongoose will automatically create a collection named 'todos'
const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;

