const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware function to verify JWT token
const authMiddleware = async (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization'); // Common header name

  // Check if Authorization header exists
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied. Missing Authorization header.' });
  }

  // Check if token format is correct (Bearer <token>)
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ msg: 'Token format is "Bearer <token>", authorization denied.' });
  }

  const token = parts[1];

  // Check if token exists after splitting
  if (!token) {
    return res.status(401).json({ msg: 'No token found after Bearer, authorization denied.' });
  }

  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user payload (from token) to the request object
    // The payload typically contains { user: { id: '...' } } based on how we created it
    if (decoded.user && decoded.user.id) {
        req.user = decoded.user; // Attach the user payload { id: '...' } to req

        next(); // Call the next middleware or route handler
    } else {
        // If the token payload doesn't have the expected structure
        return res.status(401).json({ msg: 'Token payload is invalid, authorization denied.' });
    }

  } catch (err) {
    // Handle different JWT errors
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ msg: 'Token is expired, authorization denied.' });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ msg: 'Token is not valid, authorization denied.' });
    }
    // Generic server error for other issues
    console.error('Auth Middleware Error:', err.message);
    res.status(500).json({ msg: 'Server error during token validation.' });
  }
};

module.exports = authMiddleware;

