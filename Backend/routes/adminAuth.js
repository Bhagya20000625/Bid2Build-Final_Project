const express = require('express');
const router = express.Router();

// Import admin controllers
const {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  adminLogout
} = require('../controllers/adminAuthController');

// Import admin middleware
const { adminAuth, logAdminAction } = require('../middleware/adminAuth');

// @route   POST /api/admin/auth/login
// @desc    Admin login (separate from user login)
// @access  Public
router.post('/login', adminLogin);

// @route   POST /api/admin/auth/logout
// @desc    Admin logout
// @access  Private (Admin only)
router.post('/logout', adminAuth, adminLogout);

// @route   GET /api/admin/auth/profile
// @desc    Get admin profile
// @access  Private (Admin only)
router.get('/profile', adminAuth, getAdminProfile);

// @route   PUT /api/admin/auth/profile
// @desc    Update admin profile
// @access  Private (Admin only)
router.put('/profile', adminAuth, logAdminAction('update_profile'), updateAdminProfile);

// @route   PUT /api/admin/auth/change-password
// @desc    Change admin password
// @access  Private (Admin only)
router.put('/change-password', adminAuth, logAdminAction('change_password'), changeAdminPassword);

module.exports = router;