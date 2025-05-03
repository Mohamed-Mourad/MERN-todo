// src/components/todos/TodoFilter.js
import React from 'react';

// Define the available filter options
const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

function TodoFilter({ currentFilter, onChangeFilter }) {

  // Base classes for buttons
  const baseButtonClass = "px-4 py-1 rounded-md text-sm font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1";
  // Classes for the active button
  const activeButtonClass = "bg-blue-600 text-white focus:ring-blue-500";
  // Classes for inactive buttons
  const inactiveButtonClass = "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400";

  return (
    <div className="flex space-x-2">
      <span className="text-sm font-medium text-gray-700 self-center mr-2">Show:</span>
      {filterOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onChangeFilter(option.value)} // Call onChangeFilter with the new value
          className={`
            ${baseButtonClass}
            ${currentFilter === option.value ? activeButtonClass : inactiveButtonClass}
          `}
          aria-pressed={currentFilter === option.value} // Accessibility: indicate active state
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default TodoFilter;

