// src/components/common/Button.js
import React from 'react';

// Simple reusable Button component with Tailwind styling
function Button({ children, type = 'button', onClick, disabled = false, isLoading = false, className = '', ...props }) {
  // Base classes
  const baseClasses = "w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ease-in-out";
  // Variant classes (you can add more variants: danger, secondary, etc.)
  const primaryClasses = "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500";
  // Disabled/loading classes
  const disabledClasses = "bg-gray-400 cursor-not-allowed";

  // Combine classes based on state
  const combinedClassName = `
    ${baseClasses}
    ${disabled || isLoading ? disabledClasses : primaryClasses}
    ${className} // Allow overriding or adding classes
  `;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={combinedClassName.trim()}
      {...props}
    >
      {isLoading ? (
        // Simple loading text, replace with spinner if desired
        <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        </span>
      ) : (
        children // Show button text
      )}
    </button>
  );
}

export default Button;

