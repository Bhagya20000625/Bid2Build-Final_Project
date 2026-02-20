const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middleware/upload');

// Import controllers
const {
  submitProgressUpdate,
  getProjectProgress,
  getProgressUpdate,
  reviewProgressUpdate,
  uploadProgressPhotos
} = require('../controllers/progressController');

// @route   POST /api/progress
// @desc    Submit progress update with photos
// @access  Private (Constructor only)
router.post('/', upload.array('photos', 10), handleUploadError, submitProgressUpdate);

// @route   GET /api/progress/project/:projectId
// @desc    Get all progress updates for a project
// @access  Private
router.get('/project/:projectId', getProjectProgress);

// @route   GET /api/progress/:id
// @desc    Get single progress update with photos
// @access  Private
router.get('/:id', getProgressUpdate);

// @route   PUT /api/progress/:id/review
// @desc    Review progress update (approve/reject)
// @access  Private (Client only)
router.put('/:id/review', reviewProgressUpdate);

// @route   POST /api/progress/:id/photos
// @desc    Upload progress photos
// @access  Private (Constructor only)
router.post('/:id/photos', uploadProgressPhotos);

module.exports = router;
