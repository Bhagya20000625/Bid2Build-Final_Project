const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

// Get database connection from config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bid2build',
  port: process.env.DB_PORT || 3306
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Customer only)
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      budget_range,
      timeline,
      needs_architect,
      user_id
    } = req.validatedData;

    // Log received data for debugging
    console.log('Creating project with data:', {
      title,
      description,
      location,
      category,
      budget_range,
      timeline,
      needs_architect,
      user_id
    });

    // Ensure no undefined values
    if (user_id === undefined || title === undefined || description === undefined ||
        location === undefined || category === undefined || budget_range === undefined ||
        timeline === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }


    // Determine if project has plans based on uploaded files
    const hasProjectPlans = req.files && req.files.length > 0 && req.files.some(file => 
      file.fieldname === 'project_plan' || file.fieldname === 'projectPlan'
    );

    // Insert project into database
    const [result] = await pool.execute(
      `INSERT INTO projects (
        user_id, title, description, location, category,
        budget_range, timeline, needs_architect, has_project_plans,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [
        user_id,
        title,
        description,
        location,
        category,
        budget_range,
        timeline,
        needs_architect ? 1 : 0,
        hasProjectPlans ? 1 : 0
      ]
    );

    const projectId = result.insertId;

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      console.log('Processing file uploads:', req.files.length);
      for (const file of req.files) {
        const fileType = file.fieldname === 'projectPlan' || file.fieldname === 'project_plan' 
          ? 'document' 
          : 'document';

        console.log('Inserting file:', file.originalname);
        
        try {
          // Insert file record into documents table
          await pool.execute(
            `INSERT INTO documents (
              user_id, project_id, document_type, original_name, 
              file_name, file_path, file_size, mime_type, uploaded_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [
              user_id,
              projectId,
              fileType,
              file.originalname,
              file.filename,
              file.path,
              file.size,
              file.mimetype
            ]
          );
          console.log('File saved to database:', file.originalname);
        } catch (fileError) {
          console.error('File upload error:', fileError);
          // Continue with project creation even if file upload fails
        }
      }
    }

    // Get the created project with details
    const [projects] = await pool.execute(
      `SELECT p.*, u.first_name, u.last_name, u.email
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [projectId]
    );

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: projects[0]
    });

  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all projects (for testing/admin)
// @route   GET /api/projects
// @access  Private
const getAllProjects = async (req, res) => {
  try {
    const [projects] = await pool.execute(
      `SELECT p.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email,
              COUNT(b.id) as bid_count
       FROM projects p
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN bids b ON p.id = b.project_id
       GROUP BY p.id
       ORDER BY p.created_at DESC`
    );

    res.json({
      success: true,
      count: projects.length,
      projects: projects
    });

  } catch (error) {
    console.error('Get all projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get projects by role (constructor/architect)
// @route   GET /api/projects/constructor or /api/projects/architect
// @access  Private
const getProjectsByRole = async (req, res) => {
  try {
    const role = req.path.split('/')[1]; // 'constructor' or 'architect'
    const { userId } = req.query; // Get user ID to check if they've already bid

    let whereClause;

    if (role === 'constructor') {
      // Projects with plans (for constructors)
      whereClause = 'WHERE p.has_project_plans = 1 AND (p.status = "active" OR p.status = "")';
    } else if (role === 'architect') {
      // Projects without plans but need architect
      whereClause = 'WHERE p.has_project_plans = 0 AND p.needs_architect = 1 AND (p.status = "active" OR p.status = "")';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Get all projects with bid information
    const [projects] = await pool.execute(
      `SELECT p.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email,
              COUNT(b.id) as bid_count
       FROM projects p
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN bids b ON p.id = b.project_id
       ${whereClause}
       GROUP BY p.id
       ORDER BY p.created_at DESC`
    );

    // If userId provided, check which projects this user has already bid on
    if (userId) {
      const [userBids] = await pool.execute(
        `SELECT project_id, id as bid_id, status as bid_status, bid_amount, proposed_timeline
         FROM bids
         WHERE bidder_user_id = ? AND project_id IS NOT NULL`,
        [userId]
      );

      // Create a map of project_id to bid info
      const bidMap = {};
      userBids.forEach(bid => {
        bidMap[bid.project_id] = {
          has_bid: true,
          bid_id: bid.bid_id,
          bid_status: bid.bid_status,
          bid_amount: bid.bid_amount,
          bid_timeline: bid.proposed_timeline
        };
      });

      // Add bid status to each project
      projects.forEach(project => {
        const bidInfo = bidMap[project.id];
        if (bidInfo) {
          project.user_has_bid = true;
          project.user_bid_id = bidInfo.bid_id;
          project.user_bid_status = bidInfo.bid_status;
          project.user_bid_amount = bidInfo.bid_amount;
          project.user_bid_timeline = bidInfo.bid_timeline;
        } else {
          project.user_has_bid = false;
          project.user_bid_id = null;
          project.user_bid_status = null;
          project.user_bid_amount = null;
          project.user_bid_timeline = null;
        }
      });
    }

    res.json({
      success: true,
      role: role,
      count: projects.length,
      projects: projects
    });

  } catch (error) {
    console.error('Get projects by role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get projects by customer
// @route   GET /api/projects/customer/:customerId
// @access  Private (Customer only - own projects)
const getCustomerProjects = async (req, res) => {
  try {
    const { customerId } = req.params;
    const userId = customerId; // Match route parameter name

    const [projects] = await pool.execute(
      `SELECT p.*,
              COUNT(b.id) as bid_count,
              COUNT(CASE WHEN b.status = 'accepted' THEN 1 END) as accepted_bids,
              COUNT(CASE WHEN b.status = 'rejected' THEN 1 END) as rejected_bids,
              COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bids
       FROM projects p
       LEFT JOIN bids b ON p.id = b.project_id
       WHERE p.user_id = ?
       GROUP BY p.id, p.awarded_bid_id
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      userId: userId,
      count: projects.length,
      projects: projects
    });

  } catch (error) {
    console.error('Get customer projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer projects',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const [projects] = await pool.execute(
      `SELECT p.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email,
              COUNT(b.id) as bid_count
       FROM projects p
       LEFT JOIN users u ON p.user_id = u.id
       LEFT JOIN bids b ON p.id = b.project_id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get project files
    const [files] = await pool.execute(
      'SELECT * FROM documents WHERE project_id = ?',
      [id]
    );

    const project = {
      ...projects[0],
      files: files
    };

    res.json({
      success: true,
      project: project
    });

  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Customer only - own projects)
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.validatedData;

    // Check if project exists
    const [existingProjects] = await pool.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (existingProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Build update query dynamically
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    // Add updated_at timestamp
    updateFields.push('updated_at = NOW()');
    updateValues.push(id);

    await pool.execute(
      `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated project
    const [updatedProjects] = await pool.execute(
      `SELECT p.*, u.first_name, u.last_name, u.email 
       FROM projects p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProjects[0]
    });

  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Customer only - own projects)
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if project exists
    const [existingProjects] = await pool.execute(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (existingProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Delete project (CASCADE will handle related records)
    await pool.execute('DELETE FROM projects WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Download project file
// @route   GET /api/projects/:id/files/:fileId/download
// @access  Private
const downloadProjectFile = async (req, res) => {
  try {
    const { id: projectId, fileId } = req.params;

    // Get file details from database
    const [files] = await pool.execute(
      'SELECT * FROM documents WHERE id = ? AND project_id = ?',
      [fileId, projectId]
    );

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = files[0];
    const filePath = file.file_path;

    // Check if file exists on disk
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: 'File not found on disk'
      });
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${file.original_name}"`);
    res.setHeader('Content-Type', file.mime_type || 'application/octet-stream');

    // Send file
    res.sendFile(path.resolve(filePath));

  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectsByRole,
  getCustomerProjects,
  getProjectById,
  updateProject,
  deleteProject,
  downloadProjectFile
};