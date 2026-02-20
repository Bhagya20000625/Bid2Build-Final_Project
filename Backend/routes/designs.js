const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  submitDesign,
  getArchitectSubmissions,
  getProjectDesignSubmission,
  reviewDesignSubmission,
  getDesignFiles
} = require('../controllers/designController');

// Ensure uploads/designs directory exists
const designsDir = path.join(__dirname, '..', 'uploads', 'designs');
if (!fs.existsSync(designsDir)) {
  fs.mkdirSync(designsDir, { recursive: true });
  console.log('✅ Created uploads/designs directory');
}

// Configure multer for file uploads (PDFs, CAD files, images)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, designsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `design-${uniqueSuffix}-${nameWithoutExt}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for CAD files and large PDFs
  },
  fileFilter: (req, file, cb) => {
    // Allowed file extensions
    const allowedExtensions = /\.(pdf|dwg|dxf|skp|rvt|ifc|3dm|blend|max|jpeg|jpg|png|gif|bmp|tiff|svg)$/i;
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${ext}. Allowed: PDF, CAD files (DWG, DXF, SKP, RVT, IFC, 3DM, BLEND, MAX), and images (JPEG, PNG, GIF, BMP, TIFF, SVG)`));
    }
  }
});

// Routes

// @route   POST /api/designs
// @desc    Submit design with files
// @access  Private (Architect only)
router.post('/', upload.array('designFiles', 10), submitDesign);

// @route   GET /api/designs/architect/:architectId
// @desc    Get architect's design submissions
// @access  Private (Architect only)
router.get('/architect/:architectId', getArchitectSubmissions);

// @route   GET /api/designs/project/:projectId
// @desc    Get design submission for a project
// @access  Private (Client or Architect)
router.get('/project/:projectId', getProjectDesignSubmission);

// @route   PUT /api/designs/:id/review
// @desc    Review design submission (approve or reject)
// @access  Private (Client only)
router.put('/:id/review', reviewDesignSubmission);

// @route   GET /api/designs/:id/files
// @desc    Get design files
// @access  Private
router.get('/:id/files', getDesignFiles);

module.exports = router;
