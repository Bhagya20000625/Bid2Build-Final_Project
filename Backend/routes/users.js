const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');

// @route   GET /api/users/:userId
// @desc    Get user profile by ID
// @access  Private
router.get('/:userId', getUserProfile);

module.exports = router;