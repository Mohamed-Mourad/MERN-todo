// src/components/common/Input.js
import React from 'react';

// Simple reusable Input component with Tailwind styling
function Input({ type = 'text', placeholder, value, onChange, name, id, required = false, ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id || name} // Use name as id if id not provided
      required={required}
      className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
      {...props} // Spread any other props like disabled, etc.
    />
  );
}

export default Input;

