const express = require('express');
const router = express.Router();

// Import controllers
const {
  createPayment,
  updatePaymentStatus,
  getProjectPayments,
  getUserPayments,
  getPayment
} = require('../controllers/paymentController');

// @route   POST /api/payments
// @desc    Create a payment
// @access  Private (Client only)
router.post('/', createPayment);

// @route   PUT /api/payments/:id/status
// @desc    Update payment status
// @access  Private
router.put('/:id/status', updatePaymentStatus);

// @route   GET /api/payments/project/:projectId
// @desc    Get all payments for a project
// @access  Private
router.get('/project/:projectId', getProjectPayments);

// @route   GET /api/payments/user/:userId
// @desc    Get payments for a user (sent or received)
// @access  Private
router.get('/user/:userId', getUserPayments);

// @route   GET /api/payments/:id
// @desc    Get single payment details
// @access  Private
router.get('/:id', getPayment);

module.exports = router;
