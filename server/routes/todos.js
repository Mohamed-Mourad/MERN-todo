// routes/todos.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth'); // Import auth middleware
const Todo = require('../models/Todo'); // Import Todo model
const User = require('../models/User'); // Import User model (optional, maybe needed for validation)
const { body, validationResult, query } = require('express-validator'); // For request validation

// --- Create a new To-Do Item ---
// @route   POST /api/todos
// @desc    Create a new todo item
// @access  Private
router.post(
    '/',
    [
        authMiddleware, // Protect the route
        // Validation rules using express-validator
        body('title', 'Title is required').not().isEmpty().trim(),
        body('description', 'Description must be a string').optional().isString().trim(),
        body('status', 'Status must be either pending or completed').optional().isIn(['pending', 'completed']),
        body('dueDate', 'Due date must be a valid date').optional({ checkFalsy: true }).isISO8601().toDate(), // checkFalsy allows empty string or null
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructure validated data from request body
        const { title, description, status, dueDate } = req.body;

        try {
            // Create a new Todo object
            const newTodo = new Todo({
                title,
                description,
                status: status || 'pending', // Default to 'pending' if not provided
                dueDate,
                user: req.user.id // Assign the logged-in user's ID
            });

            // Save the todo item to the database
            const todo = await newTodo.save();

            // Respond with the created todo item
            res.status(201).json(todo);

        } catch (err) {
            console.error('Create Todo Error:', err.message);
            res.status(500).send('Server Error');
        }
    }
);

// --- Get All To-Do Items for User (with Filtering and Searching) ---
// @route   GET /api/todos
// @desc    Get all todos for the logged-in user, optionally filter by status and search by title
// @access  Private
router.get(
    '/',
    [
        authMiddleware, // Protect the route
        // Optional validation for query parameters
        query('status', 'Status filter must be pending or completed').optional().isIn(['pending', 'completed']),
        query('search', 'Search term must be a string').optional().isString().trim()
    ],
    async (req, res) => {
        // Check for validation errors in query params
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            // Base query to find todos belonging to the logged-in user
            const queryConditions = { user: req.user.id };

            // Apply status filter if provided in query parameters
            if (req.query.status) {
                queryConditions.status = req.query.status;
            }

            // Apply search filter if provided (case-insensitive search on title)
            if (req.query.search) {
                // Use regex for partial, case-insensitive matching
                queryConditions.title = { $regex: req.query.search, $options: 'i' };
            }

            // Execute the query and sort by creation date (newest first)
            const todos = await Todo.find(queryConditions).sort({ createdAt: -1 });

            // Respond with the list of todos
            res.json(todos);

        } catch (err) {
            console.error('Get Todos Error:', err.message);
            res.status(500).send('Server Error');
        }
    }
);


// --- Update a To-Do Item ---
// @route   PUT /api/todos/:id
// @desc    Update a specific todo item
// @access  Private
router.put(
    '/:id',
    [
        authMiddleware, // Protect the route
        // Validation rules for update fields
        body('title', 'Title cannot be empty').optional().not().isEmpty().trim(),
        body('description', 'Description must be a string').optional().isString().trim(),
        body('status', 'Status must be either pending or completed').optional().isIn(['pending', 'completed']),
        body('dueDate', 'Due date must be a valid date').optional({ checkFalsy: true }).isISO8601().toDate(),
    ],
    async (req, res) => {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Destructure validated fields from request body
        const { title, description, status, dueDate } = req.body;
        const todoId = req.params.id; // Get todo ID from URL parameters

        // Build object with fields to update
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        // Allow setting description to empty string
        if (description !== undefined) updateFields.description = description;
        if (status) updateFields.status = status;
        // Allow clearing the due date by passing null or empty string
        if (dueDate !== undefined) updateFields.dueDate = dueDate;


        // Ensure there's at least one field being updated
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ msg: 'No fields provided for update' });
        }

        try {
            // Find the todo item by ID
            let todo = await Todo.findById(todoId);

            // Check if todo item exists
            if (!todo) {
                return res.status(404).json({ msg: 'Todo not found' });
            }

            // --- Authorization Check ---
            // Ensure the logged-in user owns this todo item
            // Convert ObjectId to string for comparison
            if (todo.user.toString() !== req.user.id) {
                return res.status(401).json({ msg: 'User not authorized to modify this todo' });
            }

            // --- Perform the update ---
            // Use findByIdAndUpdate with $set to update only provided fields
            // { new: true } returns the modified document
            todo = await Todo.findByIdAndUpdate(
                todoId,
                { $set: updateFields },
                { new: true, runValidators: true } // runValidators ensures schema validation on update
            );

            // Respond with the updated todo item
            res.json(todo);

        } catch (err) {
            console.error('Update Todo Error:', err.message);
             // Handle potential Mongoose validation errors during update
            if (err.name === 'ValidationError') {
                const messages = Object.values(err.errors).map(val => val.message);
                return res.status(400).json({ msg: messages.join(', ') });
            }
             // Handle CastError if the ID format is invalid
            if (err.name === 'CastError') {
                 return res.status(400).json({ msg: 'Invalid Todo ID format' });
            }
            res.status(500).send('Server Error');
        }
    }
);


// --- Delete a To-Do Item ---
// @route   DELETE /api/todos/:id
// @desc    Delete a specific todo item
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
    const todoId = req.params.id; // Get todo ID from URL parameters

    try {
        // Find the todo item by ID
        const todo = await Todo.findById(todoId);

        // Check if todo item exists
        if (!todo) {
            return res.status(404).json({ msg: 'Todo not found' });
        }

        // --- Authorization Check ---
        // Ensure the logged-in user owns this todo item
        if (todo.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this todo' });
        }

        // --- Perform the deletion ---
        await Todo.findByIdAndDelete(todoId); // Use findByIdAndDelete

        // Respond with success message
        res.json({ msg: 'Todo removed successfully' });

    } catch (err) {
        console.error('Delete Todo Error:', err.message);
        // Handle CastError if the ID format is invalid
        if (err.name === 'CastError') {
            return res.status(400).json({ msg: 'Invalid Todo ID format' });
        }
        res.status(500).send('Server Error');
    }
});


module.exports = router; // Export the router

