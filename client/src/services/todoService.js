// src/services/todoService.js
import api from './api'; // Import the configured Axios instance

/**
 * Fetches todos for the logged-in user.
 * @param {object} [params] - Optional query parameters for filtering and searching.
 * @param {string} [params.status] - Filter by status ('pending', 'completed').
 * @param {string} [params.search] - Search term for title matching.
 * @returns {Promise<Array>} - A promise that resolves to an array of todo items.
 */
const getTodos = async (params = {}) => {
  try {
    // Make a GET request to the /todos endpoint
    // Axios automatically serializes the params object into query string
    const response = await api.get('/todos', { params });
    // Return the array of todos from the response data
    return response.data;
  } catch (error) {
    console.error('Failed to fetch todos:', error.response?.data || error.message);
    // Re-throw error for the component to handle
    throw error.response?.data || new Error('Failed to fetch todos');
  }
};

/**
 * Adds a new todo item.
 * @param {object} todoData - The data for the new todo.
 * @param {string} todoData.title - The title of the todo.
 * @param {string} [todoData.description] - The description (optional).
 * @param {Date|string} [todoData.dueDate] - The due date (optional).
 * @returns {Promise<object>} - A promise that resolves to the newly created todo item.
 */
const addTodo = async (todoData) => {
  try {
    // Make a POST request to the /todos endpoint with the new todo data
    const response = await api.post('/todos', todoData);
    // Return the created todo item from the response data
    return response.data;
  } catch (error) {
    console.error('Failed to add todo:', error.response?.data || error.message);
    // Re-throw error for the component to handle
    throw error.response?.data || new Error('Failed to add todo');
  }
};

/**
 * Updates an existing todo item.
 * @param {string} id - The ID of the todo item to update.
 * @param {object} updateData - An object containing the fields to update.
 * @param {string} [updateData.title] - New title.
 * @param {string} [updateData.description] - New description.
 * @param {string} [updateData.status] - New status ('pending', 'completed').
 * @param {Date|string|null} [updateData.dueDate] - New due date (or null to clear).
 * @returns {Promise<object>} - A promise that resolves to the updated todo item.
 */
const updateTodo = async (id, updateData) => {
  try {
    // Make a PUT request to the specific todo's endpoint (/todos/:id)
    const response = await api.put(`/todos/${id}`, updateData);
    // Return the updated todo item from the response data
    return response.data;
  } catch (error) {
    console.error(`Failed to update todo ${id}:`, error.response?.data || error.message);
    // Re-throw error for the component to handle
    throw error.response?.data || new Error(`Failed to update todo ${id}`);
  }
};

/**
 * Deletes a todo item.
 * @param {string} id - The ID of the todo item to delete.
 * @returns {Promise<object>} - A promise that resolves to the success message from the backend.
 */
const deleteTodo = async (id) => {
  try {
    // Make a DELETE request to the specific todo's endpoint (/todos/:id)
    const response = await api.delete(`/todos/${id}`);
    // Return the success message (e.g., { msg: 'Todo removed successfully' })
    return response.data;
  } catch (error) {
    console.error(`Failed to delete todo ${id}:`, error.response?.data || error.message);
    // Re-throw error for the component to handle
    throw error.response?.data || new Error(`Failed to delete todo ${id}`);
  }
};


// Export the service functions
const todoService = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo,
};

export default todoService;

