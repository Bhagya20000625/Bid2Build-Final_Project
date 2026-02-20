const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const portfolioController = require('../controllers/portfolioController');
const { verifyToken } = require('../middleware/userAuth');
const {
  validateCreatePortfolio,
  validateUpdatePortfolio,
  validateDeleteImage
} = require('../middleware/portfolioValidation');

// Ensure portfolio uploads directory exists
const portfolioDir = path.join(__dirname, '../uploads/portfolio');
if (!fs.existsSync(portfolioDir)) {
  fs.mkdirSync(portfolioDir, { recursive: true });
}

// Configure multer for portfolio images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, portfolioDir);
  },
  filename: function (req, file, cb) {
    const uniqueFilename = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueFilename);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files are allowed.'), false);
  }
};

// Multer upload configuration (max 10 images, 5MB each)
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 10 // Max 10 files
  }
});

// Public routes (anyone can view)
// Get all portfolio projects for a user
router.get(
  '/user/:userId',
  portfolioController.getUserPortfolio
);

// Get single portfolio project
router.get(
  '/:projectId',
  portfolioController.getPortfolioProject
);

// Protected routes (requires authentication)
// Create new portfolio project
router.post(
  '/',
  verifyToken,
  upload.array('images', 10),
  validateCreatePortfolio,
  portfolioController.createPortfolioProject
);

// Update portfolio project
router.put(
  '/:projectId',
  verifyToken,
  upload.array('images', 10),
  validateUpdatePortfolio,
  portfolioController.updatePortfolioProject
);

// Delete portfolio project
router.delete(
  '/:projectId',
  verifyToken,
  portfolioController.deletePortfolioProject
);

// Delete specific image from project
router.delete(
  '/:projectId/image',
  verifyToken,
  validateDeleteImage,
  portfolioController.deletePortfolioImage
);

module.exports = router;
