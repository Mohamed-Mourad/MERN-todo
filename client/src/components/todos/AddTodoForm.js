// src/components/todos/AddTodoForm.js
import React, { useState } from 'react';
import Input from '../common/Input'; // Reusable Input
import Button from '../common/Button'; // Reusable Button

function AddTodoForm({ onAdd }) { // Receive onAdd function as a prop
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(''); // Store as string YYYY-MM-DD
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Basic validation
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    setIsLoading(true); // Set loading state

    const todoData = {
      title: title.trim(),
      description: description.trim(),
      // Only include dueDate if it's not empty
      ...(dueDate && { dueDate: dueDate }),
    };

    try {
      // Call the handler passed from the parent (DashboardPage)
      await onAdd(todoData);
      // Clear the form on successful submission
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      // Error handling might be done in the parent, but can show local error too
      console.error("Error in AddTodoForm submit:", err);
      setError(err.message || 'Failed to add task. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-100 p-2 rounded border border-red-300">
          {error}
        </p>
      )}
      <Input
        type="text"
        name="title"
        placeholder="Task Title (required)"
        value={title}
        onChange={(e) => {setTitle(e.target.value); setError('');}} // Clear error on change
        required
        disabled={isLoading}
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="3"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        disabled={isLoading}
      />
      <Input
        type="date" // Use date type input
        name="dueDate"
        placeholder="Due Date (optional)"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        // Add min attribute to prevent past dates if desired
        // min={new Date().toISOString().split("T")[0]}
        disabled={isLoading}
      />
      <Button type="submit" disabled={isLoading} isLoading={isLoading}>
        Add Task
      </Button>
    </form>
  );
}

export default AddTodoForm;

