const express = require('express');
const router = express.Router();
const { getUserProfile, getDbTables } = require('../controllers/userController');

// @route   GET /api/users/debug/tables
// @desc    Get database tables (temporary for development)
// @access  Public
router.get('/debug/tables', getDbTables);

// @route   GET /api/users/:userId
// @desc    Get user profile by ID
// @access  Private
router.get('/:userId', getUserProfile);

module.exports = router;