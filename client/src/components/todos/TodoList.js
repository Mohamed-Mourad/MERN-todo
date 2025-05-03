import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos = [], onUpdate, onDelete }) {

  if (todos.length === 0) {
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

