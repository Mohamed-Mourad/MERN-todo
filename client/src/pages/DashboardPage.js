import React, { useState, useEffect, useCallback } from 'react';
import todoService from '../services/todoService'; // Import the todo service
import { useAuth } from '../context/AuthContext'; // To get user info if needed

// Import child components
import AddTodoForm from '../components/todos/AddTodoForm';
import TodoList from '../components/todos/TodoList';
import TodoFilter from '../components/todos/TodoFilter';
import TodoSearch from '../components/todos/TodoSearch'; // Import TodoSearch

function DashboardPage() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);
  const [filter, setFilter] = useState('all'); // State for current filter
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // --- Fetch Todos Function ---
  // Added debouncing for search term changes
  const fetchTodos = useCallback(async (currentSearchTerm) => {
    setError(null);
    setAddError(null);
    console.log(`Fetching todos with filter: ${filter}, search: ${currentSearchTerm}`); // Use passed search term
    try {
      const params = {};
      if (filter !== 'all') params.status = filter;
      // Use the currentSearchTerm passed to the function
      if (currentSearchTerm) params.search = currentSearchTerm;
      const fetchedTodos = await todoService.getTodos(params);
      setTodos(fetchedTodos);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      setError(err.message || 'Could not fetch todos.');
      setTodos([]);
    } finally {
      if (isLoading) setIsLoading(false);
    }
  }, [filter, isLoading]); // Remove searchTerm from direct dependencies here

  // --- Debounced Fetch for Search ---
  useEffect(() => {
    // Set a timer to fetch todos after 500ms of inactivity
    const timerId = setTimeout(() => {
      // Pass the current searchTerm state to fetchTodos
      fetchTodos(searchTerm);
    }, 500); // Adjust delay as needed (e.g., 300ms, 500ms)

    // Cleanup function: Clear the timer if searchTerm changes before delay ends
    return () => clearTimeout(timerId);
  }, [searchTerm, fetchTodos]); // Re-run effect when searchTerm or fetchTodos changes

  // --- Effect to Fetch Todos on Filter Change ---
  useEffect(() => {
    // Fetch immediately when filter changes, using the current searchTerm
    fetchTodos(searchTerm);
  }, [filter, fetchTodos]); // Run only when filter changes

  // --- Handler Functions ---
  const handleAddTodo = async (todoData) => {
    setAddError(null);
    try {
      await todoService.addTodo(todoData);
      fetchTodos(searchTerm); // Refetch with current search term
      return true;
    } catch (err) {
      console.error("Failed to add todo:", err);
      const errorMsg = err.message || 'Could not add todo.';
      setAddError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const handleUpdateTodo = async (id, updateData) => {
    setError(null);
    try {
      await todoService.updateTodo(id, updateData);
      fetchTodos(searchTerm); // Refetch with current search term
    } catch (err) {
      console.error(`Failed to update todo ${id}:`, err);
      setError(err.message || `Could not update todo.`);
    }
  };

  const handleDeleteTodo = async (id) => {
     setError(null);
    try {
      await todoService.deleteTodo(id);
      fetchTodos(searchTerm); // Refetch with current search term
    } catch (err) {
      console.error(`Failed to delete todo ${id}:`, err);
       setError(err.message || `Could not delete todo.`);
    }
  };

  // --- Render Logic ---
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Welcome, {user?.name || 'User'}! Here's your To-Do List:
      </h1>

      {/* Render Add Todo Form */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Add New Task</h2>
        <AddTodoForm onAdd={handleAddTodo} />
        {addError && (
            <p className="mt-2 text-sm text-red-600">{addError}</p>
        )}
      </div>

      {/* Filter and Search Controls Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 p-4 bg-white rounded shadow">
         {/* Render TodoFilter */}
         <div className="flex-shrink-0">
             <TodoFilter
                currentFilter={filter}
                onChangeFilter={setFilter} // Pass the setFilter function
             />
         </div>
         {/* Render TodoSearch */}
         <div className="flex-grow md:ml-4 w-full md:w-auto"> {/* Adjust width */}
            <TodoSearch
                currentSearch={searchTerm}
                onSearchChange={setSearchTerm} // Pass the setSearchTerm function
            />
         </div>
      </div>


      {/* Display Todos or Loading/Error State */}
      <div className="bg-white rounded shadow p-4 min-h-[300px]">
        <h2 className="text-xl font-semibold mb-3">Your Tasks</h2>
        {error && !addError && (
             <p className="text-center text-red-600 bg-red-100 p-3 rounded border border-red-300 mb-4">{error}</p>
        )}
        {/* Show loading only during initial load */}
        {isLoading ? (
          <p className="text-center text-gray-500">Loading tasks...</p>
        ) : (
          <>
            {/* Render Todo List */}
            <TodoList
              todos={todos}
              onUpdate={handleUpdateTodo}
              onDelete={handleDeleteTodo}
            />
            {todos.length === 0 && !isLoading && (
                 <p className="text-center text-gray-500 mt-4">No tasks found matching your criteria. Try adjusting the filter/search or add a new task!</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;

