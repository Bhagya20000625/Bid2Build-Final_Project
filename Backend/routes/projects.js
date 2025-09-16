const express = require('express');
const router = express.Router();

// Import controllers (to be created)
const {
  createProject,
  getAllProjects,
  getProjectsByRole,
  getProjectById,
  updateProject,
  deleteProject,
  getCustomerProjects,
  downloadProjectFile
} = require('../controllers/projectController');

// Import validation middleware
const { validateProject, validateProjectUpdate } = require('../middleware/projectValidation');
const { upload } = require('../middleware/upload');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private (Customer only)
router.post('/', upload.any(), validateProject, createProject);

// @route   GET /api/projects
// @desc    Get all projects (for testing/admin)
// @access  Private
router.get('/', getAllProjects);

// @route   GET /api/projects/constructor
// @desc    Get projects for constructors (has_project_plans = true)
// @access  Private (Constructor only)
router.get('/constructor', getProjectsByRole);

// @route   GET /api/projects/architect
// @desc    Get projects for architects (has_project_plans = false AND needs_architect = true)
// @access  Private (Architect only)
router.get('/architect', getProjectsByRole);

// @route   GET /api/projects/customer/:customerId
// @desc    Get projects by customer
// @access  Private (Customer only - own projects)
router.get('/customer/:customerId', getCustomerProjects);

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', getProjectById);

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Customer only - own projects)
router.put('/:id', upload.any(), validateProjectUpdate, updateProject);

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Customer only - own projects)
router.delete('/:id', deleteProject);

// @route   GET /api/projects/:id/files/:fileId/download
// @desc    Download project file
// @access  Private
router.get('/:id/files/:fileId/download', downloadProjectFile);

module.exports = router;