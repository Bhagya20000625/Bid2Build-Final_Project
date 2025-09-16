const express = require('express');
const router = express.Router();

// Import controllers (to be created)
const {
  createMaterialRequest,
  getAllMaterialRequests,
  getMaterialRequestsForSuppliers,
  getMaterialRequestById,
  getCustomerMaterialRequests,
  updateMaterialRequest,
  deleteMaterialRequest
} = require('../controllers/materialRequestController');

// Import validation middleware
const { validateMaterialRequest } = require('../middleware/materialRequestValidation');

// @route   POST /api/material-requests
// @desc    Create a new material request
// @access  Private (Customer only)
router.post('/', validateMaterialRequest, createMaterialRequest);

// @route   GET /api/material-requests
// @desc    Get all material requests (for testing/admin)
// @access  Private
router.get('/', getAllMaterialRequests);

// @route   GET /api/material-requests/supplier
// @desc    Get material requests for suppliers
// @access  Private (Supplier only)
router.get('/supplier', getMaterialRequestsForSuppliers);

// @route   GET /api/material-requests/customer/:customerId
// @desc    Get material requests by customer
// @access  Private (Customer only - own requests)
router.get('/customer/:customerId', getCustomerMaterialRequests);

// @route   GET /api/material-requests/:id
// @desc    Get material request by ID
// @access  Private
router.get('/:id', getMaterialRequestById);

// @route   PUT /api/material-requests/:id
// @desc    Update material request
// @access  Private (Customer only - own requests)
router.put('/:id', validateMaterialRequest, updateMaterialRequest);

// @route   DELETE /api/material-requests/:id
// @desc    Delete material request
// @access  Private (Customer only - own requests)
router.delete('/:id', deleteMaterialRequest);

module.exports = router;