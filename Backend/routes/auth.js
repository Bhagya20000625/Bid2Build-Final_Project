const express = require('express');
const router = express.Router();
const { registerUser, getUserByEmail, getUserProfile, loginUser } = require('../controllers/registrationController');
const { validateRegistration, validateRoleSpecificData } = require('../middleware/validation');
const { upload, handleUploadError } = require('../middleware/upload');

// Configure multer to accept any field for debugging
const uploadFields = upload.any();

// Test route to debug the issue
router.post('/test', (req, res) => {
  console.log('=== TEST ROUTE HIT ===');
  console.log('Request body:', req.body);
  res.json({ success: true, message: 'Test route working', body: req.body });
});

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', 
  uploadFields,
  handleUploadError,
  validateRegistration,
  validateRoleSpecificData,
  registerUser
);

// @route   POST /api/auth/login
// @desc    Login user (all roles)
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/user/:email
// @desc    Get user by email
// @access  Public (you may want to add authentication later)
router.get('/user/:email', getUserByEmail);

// @route   GET /api/auth/profile/:userId
// @desc    Get user profile with role-specific data
// @access  Public (you may want to add authentication later)
router.get('/profile/:userId', getUserProfile);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginUser);

module.exports = router;