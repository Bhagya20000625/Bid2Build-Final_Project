import jwt from 'jsonwebtoken';
import { getOne } from '../config/database.js';

// Verify JWT token middleware
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await getOne(
      'SELECT id, email, user_role, first_name, last_name, is_verified FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (!user) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'User not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Please login again'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Please provide a valid authentication token'
      });
    }

    res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error'
    });
  }
};

// Check user role middleware
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please login first'
      });
    }

    const userRole = req.user.user_role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Access denied',
        message: `This endpoint requires ${allowedRoles.join(' or ')} role`
      });
    }

    next();
  };
};

// Check if user is verified
export const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please login first'
    });
  }

  if (!req.user.is_verified) {
    return res.status(403).json({
      error: 'Account not verified',
      message: 'Please verify your email address first'
    });
  }

  next();
};

// Generate JWT token helper
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};