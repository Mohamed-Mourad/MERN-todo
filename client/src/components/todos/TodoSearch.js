// src/components/todos/TodoSearch.js
import React from 'react';
import Input from '../common/Input'; // Use our reusable Input

function TodoSearch({ currentSearch, onSearchChange }) {

  // Handler for input changes
  const handleChange = (e) => {
    // Call the handler passed from DashboardPage to update the searchTerm state
    onSearchChange(e.target.value);
  };

  return (
    <div className="w-full md:w-auto"> {/* Control width */}
      <Input
        type="search" // Use search type for semantics and potential browser features (like clear button)
        placeholder="Search tasks by title..."
        value={currentSearch}
        onChange={handleChange}
        name="search"
        aria-label="Search tasks by title" // Accessibility label
        className="w-full" // Ensure it takes full width of its container
      />
      {/*
        Note: For performance on larger lists or frequent typing,
        you might want to debounce this input. This involves delaying the
        call to onSearchChange until the user stops typing for a short period.
        This can be implemented using a custom hook or a library like lodash.debounce.
        For now, we'll keep it simple and update on every keystroke.
      */}
    </div>
  );
}

export default TodoSearch;

