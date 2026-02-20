const express = require('express');
const router = express.Router();

// Import admin controllers
const {
  getDashboardStats,
  getUserManagement,
  getPendingVerifications
} = require('../controllers/adminDashboardController');

// Import admin middleware
const { adminAuth, logAdminAction } = require('../middleware/adminAuth');

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard overview statistics
// @access  Private (Admin only)
router.get('/dashboard/stats', adminAuth, getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get user management data with filters and pagination
// @access  Private (Admin only)
router.get('/users', adminAuth, getUserManagement);

// @route   GET /api/admin/verifications/pending
// @desc    Get pending verifications
// @access  Private (Admin only)
router.get('/verifications/pending', adminAuth, getPendingVerifications);

// @route   GET /api/admin/verifications/stats
// @desc    Get verification statistics
// @access  Private (Admin only)
router.get('/verifications/stats', adminAuth, require('../controllers/adminVerificationController').getVerificationStats);

// @route   GET /api/admin/verifications/user/:userId/documents
// @desc    Get user's verification documents
// @access  Private (Admin only)
router.get('/verifications/user/:userId/documents', adminAuth, require('../controllers/adminVerificationController').getUserDocuments);

// @route   POST /api/admin/verifications/user/:userId/approve
// @desc    Approve user verification
// @access  Private (Admin only)
router.post('/verifications/user/:userId/approve', adminAuth, logAdminAction, require('../controllers/adminVerificationController').approveVerification);

// @route   POST /api/admin/verifications/user/:userId/reject
// @desc    Reject user verification
// @access  Private (Admin only)
router.post('/verifications/user/:userId/reject', adminAuth, logAdminAction, require('../controllers/adminVerificationController').rejectVerification);

module.exports = router;