const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

/**
 * Admin Authentication Controller
 * Handles admin login, logout, and profile management
 * Separate from regular user authentication for security
 */

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Find admin by username or email
    const [admins] = await pool.execute(
      'SELECT * FROM admin_users WHERE (username = ? OR email = ?) AND status = "active"',
      [username, username]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const admin = admins[0];

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await pool.execute(
      'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
      [admin.id]
    );

    // Generate JWT token (separate from user tokens)
    const adminToken = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        type: 'admin' // Important: distinguish from user tokens
      },
      process.env.JWT_SECRET || 'admin_jwt_secret_key',
      { 
        expiresIn: '8h' // Shorter expiry for admin sessions
      }
    );

    // Remove password from response
    const { password: _, ...adminData } = admin;

    res.json({
      success: true,
      message: 'Admin login successful',
      admin: adminData,
      token: adminToken
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
};

// Get admin profile
const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;

    const [admins] = await pool.execute(
      'SELECT id, username, email, first_name, last_name, status, created_at, last_login FROM admin_users WHERE id = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: admins[0]
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting admin profile'
    });
  }
};

// Update admin profile
const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { first_name, last_name, email } = req.body;

    // Validation
    if (!first_name || !last_name || !email) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, and email are required'
      });
    }

    // Check if email is already used by another admin
    const [existingAdmin] = await pool.execute(
      'SELECT id FROM admin_users WHERE email = ? AND id != ?',
      [email, adminId]
    );

    if (existingAdmin.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email is already in use by another admin'
      });
    }

    // Update admin profile
    await pool.execute(
      'UPDATE admin_users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
      [first_name, last_name, email, adminId]
    );

    res.json({
      success: true,
      message: 'Admin profile updated successfully'
    });

  } catch (error) {
    console.error('Update admin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating admin profile'
    });
  }
};

// Change admin password
const changeAdminPassword = async (req, res) => {
  try {
    const adminId = req.admin.id;
    const { current_password, new_password } = req.body;

    // Validation
    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get current admin password
    const [admins] = await pool.execute(
      'SELECT password FROM admin_users WHERE id = ?',
      [adminId]
    );

    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(current_password, admins[0].password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    // Update password
    await pool.execute(
      'UPDATE admin_users SET password = ? WHERE id = ?',
      [hashedNewPassword, adminId]
    );

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change admin password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error changing password'
    });
  }
};

// Admin logout (optional - mainly handled on frontend)
const adminLogout = async (req, res) => {
  try {
    // In a JWT system, logout is typically handled client-side by removing the token
    // We can optionally log the logout event here

    res.json({
      success: true,
      message: 'Admin logged out successfully'
    });

  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

module.exports = {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  adminLogout
};