import React from 'react';
import Input from '../common/Input';

function TodoSearch({ currentSearch, onSearchChange }) {

  // Handler for input changes
  const handleChange = (e) => {
    // Call the handler passed from DashboardPage to update the searchTerm state
    onSearchChange(e.target.value);
  };

  return (
    <div className="w-full md:w-auto">
      <Input
        type="search"
        placeholder="Search tasks by title..."
        value={currentSearch}
        onChange={handleChange}
        name="search"
        aria-label="Search tasks by title"
        className="w-full"
      />
    </div>
  );
}

export default TodoSearch;

