const express = require('express');
const router = express.Router();

// Import controllers (to be created)
const {
  createBid,
  getAllBids,
  getBidsByProject,
  getBidsByMaterialRequest,
  getBidById,
  getCustomerBids,
  getBidderBids,
  updateBidStatus,
  deleteBid
} = require('../controllers/bidController');

// Import validation middleware
const { validateBid, validateBidStatusUpdate } = require('../middleware/bidValidation');

// @route   POST /api/bids
// @desc    Create a new bid
// @access  Private (Constructor, Architect, Supplier)
router.post('/', validateBid, createBid);

// @route   GET /api/bids
// @desc    Get all bids (for testing/admin)
// @access  Private
router.get('/', getAllBids);

// @route   GET /api/bids/project/:projectId
// @desc    Get bids for a specific project
// @access  Private (Customer - own projects, Constructor/Architect - can see all)
router.get('/project/:projectId', getBidsByProject);

// @route   GET /api/bids/material-request/:materialRequestId
// @desc    Get bids for a specific material request
// @access  Private (Customer - own requests, Supplier - can see all)
router.get('/material-request/:materialRequestId', getBidsByMaterialRequest);

// @route   GET /api/bids/customer/:userId
// @desc    Get all bids received by customer (for their projects and material requests)
// @access  Private (Customer only - own bids)
router.get('/customer/:userId', getCustomerBids);

// @route   GET /api/bids/bidder/:bidderId
// @desc    Get all bids submitted by bidder
// @access  Private (Bidder only - own bids)
router.get('/bidder/:bidderId', getBidderBids);

// @route   GET /api/bids/:id
// @desc    Get bid by ID
// @access  Private
router.get('/:id', getBidById);

// @route   PUT /api/bids/:id/status
// @desc    Update bid status (accept/reject)
// @access  Private (Customer only - for bids on their projects/requests)
router.put('/:id/status', validateBidStatusUpdate, updateBidStatus);

// @route   DELETE /api/bids/:id
// @desc    Delete/withdraw bid
// @access  Private (Bidder only - own bids)
router.delete('/:id', deleteBid);

module.exports = router;