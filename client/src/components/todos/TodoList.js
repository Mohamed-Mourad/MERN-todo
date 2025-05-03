// src/components/todos/TodoList.js
import React from 'react';
// Import TodoItem
import TodoItem from './TodoItem'; // Import the actual TodoItem component

function TodoList({ todos = [], onUpdate, onDelete }) { // Default todos to empty array

  if (todos.length === 0) {
    // The "No tasks found" message is handled in DashboardPage,
    // so we can return null here if the list is empty.
    return null;
  }

  return (
    <div className="space-y-3"> {/* Add some spacing between items */}
      {todos.map((todo) => (
         // Render the actual TodoItem component
         <TodoItem
           key={todo._id} // Use todo._id as the key for mapping
           todo={todo}      // Pass the individual todo object
           onUpdate={onUpdate} // Pass the update handler down
           onDelete={onDelete} // Pass the delete handler down
         />
      ))}
    </div>
  );
}

export default TodoList;

