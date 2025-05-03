import React from 'react';
import Button from '../common/Button';

const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  try {
    const date = new Date(dateString);
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

    return adjustedDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return 'Invalid date';
  }
};


function TodoItem({ todo, onUpdate, onDelete }) {
  // Destructure todo properties for easier access
  const { _id, title, description, status, dueDate } = todo;

  // Handler to toggle status
  const handleToggleStatus = () => {
    const newStatus = status === 'pending' ? 'completed' : 'pending';
    onUpdate(_id, { status: newStatus }); // Call parent's update handler
  };

  // Handler for deletion
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete task: "${title}"?`)) {
      onDelete(_id); // Call parent's delete handler
    }
  };

  // Determine styling based on status
  const isCompleted = status === 'completed';
  const itemClasses = `
    flex flex-col md:flex-row items-start md:items-center justify-between
    p-4 border rounded-lg shadow-sm transition duration-200 ease-in-out
    ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
  `;
  const titleClasses = `
    font-semibold text-lg mb-1 md:mb-0
    ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}
  `;
  const descriptionClasses = `
    text-sm mb-2 md:mb-0
    ${isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}
  `;

  return (
    <div className={itemClasses}>
      {/* Checkbox and Text Content */}
      <div className="flex items-start flex-grow mr-4 mb-3 md:mb-0">
         {/* Custom styled checkbox */}
         <input
            type="checkbox"
            checked={isCompleted}
            onChange={handleToggleStatus}
            className="mt-1 h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer flex-shrink-0"
            aria-label={`Mark task ${title} as ${isCompleted ? 'pending' : 'completed'}`}
          />
        <div className="ml-3 flex-grow">
          <p className={titleClasses}>{title}</p>
          {description && (
            <p className={descriptionClasses}>{description}</p>
          )}
          {dueDate && (
             <p className={`text-xs mt-1 ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
               Due: {formatDate(dueDate)}
             </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 flex-shrink-0 self-end md:self-center">
         {/* <Button
           onClick={() => console.log("Edit clicked for", _id)}
           className="bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-400 text-white !w-auto px-3 py-1 text-sm" // !w-auto overrides default w-full
         >
           Edit
         </Button> */}
        <Button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 focus:ring-red-400 text-white !w-auto px-3 py-1 text-sm" // !w-auto overrides default w-full
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default TodoItem;

