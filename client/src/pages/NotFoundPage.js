import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
      <p className="mb-4">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Go to Home
      </Link>
    </div>
  );
}
export default NotFoundPage;

