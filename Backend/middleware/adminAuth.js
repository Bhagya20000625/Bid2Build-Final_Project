const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Admin Authentication Middleware
 * Protects admin routes and verifies admin JWT tokens
 * Separate from regular user authentication
 */

const adminAuth = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No admin token provided.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'admin_jwt_secret_key');

    // Check if token is for admin (important security check)
    if (decoded.type !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    // Verify admin still exists and is active
    const [admins] = await pool.execute(
      'SELECT id, username, email, first_name, last_name, status FROM admin_users WHERE id = ? AND status = "active"',
      [decoded.id]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin account not found or inactive.'
      });
    }

    // Add admin info to request object
    req.admin = {
      id: admins[0].id,
      username: admins[0].username,
      email: admins[0].email,
      first_name: admins[0].first_name,
      last_name: admins[0].last_name,
      status: admins[0].status
    };

    next();

  } catch (error) {
    console.error('Admin auth middleware error:', error);

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid admin token.'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Admin token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during admin authentication.'
    });
  }
};

/**
 * Optional: Role-based admin access control
 * For future use if you want different admin roles (super admin, moderator, etc.)
 */
const requireAdminRole = (roles = []) => {
  return (req, res, next) => {
    // For now, all admins have the same privileges
    // In the future, you can add role checking here
    next();
  };
};

/**
 * Middleware to log admin actions for audit trail
 */
const logAdminAction = (action) => {
  return async (req, res, next) => {
    try {
      // Store the action info for logging after the request
      req.adminAction = {
        admin_id: req.admin?.id,
        action: action,
        ip_address: req.ip || req.connection.remoteAddress,
        user_agent: req.get('User-Agent'),
        timestamp: new Date()
      };

      // Continue to the actual route handler
      next();

    } catch (error) {
      console.error('Admin action logging error:', error);
      next(); // Don't block the request if logging fails
    }
  };
};

module.exports = {
  adminAuth,
  requireAdminRole,
  logAdminAction
};