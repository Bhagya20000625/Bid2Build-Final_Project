const mysql = require('mysql2/promise');
const { createProgressNotification } = require('./notificationController');

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

// @desc    Submit progress update
// @route   POST /api/progress
// @access  Private (Constructor only)
const submitProgressUpdate = async (req, res) => {
  try {
    const {
      project_id,
      bid_id,
      submitted_by,
      description,
      milestone_name,
      progress_percentage,
      payment_amount
    } = req.body;

    console.log('📊 Received progress update:', {
      project_id,
      milestone_name,
      progress_percentage,
      payment_amount
    });

    // Validate required fields
    if (!project_id || !bid_id || !submitted_by || !description) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, Bid ID, Submitted By, and Description are required'
      });
    }

    // Verify the bid belongs to this constructor and project
    const [bids] = await pool.execute(
      `SELECT b.*, p.user_id as client_id, p.title as project_title
       FROM bids b
       JOIN projects p ON b.project_id = p.id
       WHERE b.id = ? AND b.project_id = ? AND b.bidder_user_id = ? AND b.status = 'accepted'`,
      [bid_id, project_id, submitted_by]
    );

    if (bids.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found or you do not have permission to submit progress for this project'
      });
    }

    const bid = bids[0];

    // Insert progress update
    const [result] = await pool.execute(
      `INSERT INTO progress_updates (
        project_id, bid_id, submitted_by, description, milestone_name, progress_percentage, payment_amount, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_review', NOW())`,
      [project_id, bid_id, submitted_by, description, milestone_name || 'Progress Update', parseFloat(progress_percentage) || 0, parseFloat(payment_amount) || 0]
    );

    console.log('✅ Progress update created with ID:', result.insertId);

    const progressUpdateId = result.insertId;

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      console.log('Processing progress photo uploads:', req.files.length);
      for (const file of req.files) {
        await pool.execute(
          `INSERT INTO progress_photos (
            progress_update_id, file_path, file_name, file_size, mime_type, uploaded_at
          ) VALUES (?, ?, ?, ?, ?, NOW())`,
          [progressUpdateId, file.path, file.originalname, file.size, file.mimetype]
        );
      }
    }

    // Create notification for client
    const io = req.app.get('io');
    await createProgressNotification({
      client_id: bid.client_id,
      project_title: bid.project_title,
      milestone_name: milestone_name || 'Progress Update',
      progress_percentage: parseFloat(progress_percentage) || 0
    }, 'progress_submitted', io);

    // Get the created progress update
    const [progressUpdates] = await pool.execute(
      `SELECT pu.*,
              u.first_name, u.last_name, u.email
       FROM progress_updates pu
       JOIN users u ON pu.submitted_by = u.id
       WHERE pu.id = ?`,
      [progressUpdateId]
    );

    // Get photos
    const [photos] = await pool.execute(
      'SELECT * FROM progress_photos WHERE progress_update_id = ?',
      [progressUpdateId]
    );

    res.status(201).json({
      success: true,
      message: 'Progress update submitted successfully',
      progressUpdate: {
        ...progressUpdates[0],
        photos: photos
      }
    });

  } catch (error) {
    console.error('Submit progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit progress update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get progress updates for a project
// @route   GET /api/progress/project/:projectId
// @access  Private
const getProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [progressUpdates] = await pool.execute(
      `SELECT pu.*,
              u.first_name as submitted_by_first_name,
              u.last_name as submitted_by_last_name,
              u.email as submitted_by_email,
              reviewer.first_name as reviewed_by_first_name,
              reviewer.last_name as reviewed_by_last_name,
              (SELECT COUNT(*) FROM progress_photos WHERE progress_update_id = pu.id) as photo_count
       FROM progress_updates pu
       JOIN users u ON pu.submitted_by = u.id
       LEFT JOIN users reviewer ON pu.reviewed_by = reviewer.id
       WHERE pu.project_id = ?
       ORDER BY pu.submitted_at DESC`,
      [projectId]
    );

    res.json({
      success: true,
      count: progressUpdates.length,
      progressUpdates: progressUpdates
    });

  } catch (error) {
    console.error('Get project progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress updates',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single progress update with photos
// @route   GET /api/progress/:id
// @access  Private
const getProgressUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    // Get progress update
    const [progressUpdates] = await pool.execute(
      `SELECT pu.*,
              u.first_name as submitted_by_first_name,
              u.last_name as submitted_by_last_name,
              u.email as submitted_by_email,
              reviewer.first_name as reviewed_by_first_name,
              reviewer.last_name as reviewed_by_last_name
       FROM progress_updates pu
       JOIN users u ON pu.submitted_by = u.id
       LEFT JOIN users reviewer ON pu.reviewed_by = reviewer.id
       WHERE pu.id = ?`,
      [id]
    );

    if (progressUpdates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Progress update not found'
      });
    }

    // Get photos
    const [photos] = await pool.execute(
      'SELECT * FROM progress_photos WHERE progress_update_id = ? ORDER BY uploaded_at DESC',
      [id]
    );

    res.json({
      success: true,
      progressUpdate: {
        ...progressUpdates[0],
        photos: photos
      }
    });

  } catch (error) {
    console.error('Get progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Review progress update (approve/reject)
// @route   PUT /api/progress/:id/review
// @access  Private (Client only)
const reviewProgressUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewed_by, status, review_comments } = req.body;

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    // Check if progress update exists and belongs to this client's project
    const [progressUpdates] = await pool.execute(
      `SELECT pu.*, p.user_id as client_id, b.bidder_user_id as constructor_id
       FROM progress_updates pu
       JOIN projects p ON pu.project_id = p.id
       JOIN bids b ON pu.bid_id = b.id
       WHERE pu.id = ?`,
      [id]
    );

    if (progressUpdates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Progress update not found'
      });
    }

    const progressUpdate = progressUpdates[0];

    console.log('📋 Progress Update Data Retrieved:', {
      id: progressUpdate.id,
      project_id: progressUpdate.project_id,
      milestone_name: progressUpdate.milestone_name,
      progress_percentage: progressUpdate.progress_percentage,
      status: progressUpdate.status
    });

    // Verify reviewer is the project owner
    if (progressUpdate.client_id !== reviewed_by) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to review this progress update'
      });
    }

    // Update progress review
    await pool.execute(
      `UPDATE progress_updates
       SET status = ?, reviewed_by = ?, reviewed_at = NOW(), review_comments = ?
       WHERE id = ?`,
      [status, reviewed_by, review_comments || null, id]
    );

    // If approved, update project's overall_progress (cumulative/additive)
    if (status === 'approved') {
      // Get current overall_progress
      const [currentProject] = await pool.execute(
        'SELECT overall_progress FROM projects WHERE id = ?',
        [progressUpdate.project_id]
      );

      const currentProgress = parseFloat(currentProject[0].overall_progress || 0);
      const progressToAdd = parseFloat(progressUpdate.progress_percentage || 0);
      const newProgress = Math.min(currentProgress + progressToAdd, 100); // Cap at 100%

      console.log('🔄 Updating project overall_progress (CUMULATIVE):', {
        project_id: progressUpdate.project_id,
        current_progress: currentProgress,
        progress_to_add: progressToAdd,
        new_total_progress: newProgress,
        capped_at_100: newProgress === 100 && (currentProgress + progressToAdd) > 100
      });

      const [updateResult] = await pool.execute(
        `UPDATE projects
         SET overall_progress = ?
         WHERE id = ?`,
        [newProgress, progressUpdate.project_id]
      );

      console.log('✅ Project overall_progress update result:', {
        affectedRows: updateResult.affectedRows,
        changedRows: updateResult.changedRows
      });

      // Verify the update
      const [verifyProject] = await pool.execute(
        'SELECT id, title, overall_progress FROM projects WHERE id = ?',
        [progressUpdate.project_id]
      );
      console.log('✅ Verified project data:', verifyProject[0]);

      // Create payment record in pending status
      console.log('💰 Creating payment record for approved progress update...');
      const [paymentResult] = await pool.execute(
        `INSERT INTO payments (
          project_id, progress_update_id, bid_id, payer_id, payee_id, amount, payment_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
        [
          progressUpdate.project_id,
          progressUpdate.id,
          progressUpdate.bid_id,
          progressUpdate.client_id,
          progressUpdate.constructor_id,
          parseFloat(progressUpdate.payment_amount || 0)
        ]
      );

      console.log('✅ Payment record created with ID:', paymentResult.insertId);
    }

    // Create notification for constructor
    const io = req.app.get('io');
    const notificationType = status === 'approved' ? 'progress_approved' : 'progress_rejected';
    await createProgressNotification({
      constructor_id: progressUpdate.constructor_id,
      milestone_name: progressUpdate.milestone_name || 'Progress Update',
      review_comments: review_comments
    }, notificationType, io);

    // Get updated progress
    const [updated] = await pool.execute(
      `SELECT pu.*,
              u.first_name as submitted_by_first_name,
              u.last_name as submitted_by_last_name,
              reviewer.first_name as reviewed_by_first_name,
              reviewer.last_name as reviewed_by_last_name
       FROM progress_updates pu
       JOIN users u ON pu.submitted_by = u.id
       LEFT JOIN users reviewer ON pu.reviewed_by = reviewer.id
       WHERE pu.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: `Progress update ${status} successfully`,
      progressUpdate: updated[0]
    });

  } catch (error) {
    console.error('Review progress update error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review progress update',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Upload progress photos
// @route   POST /api/progress/:id/photos
// @access  Private (Constructor only)
const uploadProgressPhotos = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files; // Assuming multer middleware

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No photos uploaded'
      });
    }

    // Verify progress update exists
    const [progressUpdates] = await pool.execute(
      'SELECT * FROM progress_updates WHERE id = ?',
      [id]
    );

    if (progressUpdates.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Progress update not found'
      });
    }

    // Insert photos
    const photoInserts = files.map(file => {
      return pool.execute(
        `INSERT INTO progress_photos (progress_update_id, file_path, file_name, uploaded_at)
         VALUES (?, ?, ?, NOW())`,
        [id, file.path, file.originalname]
      );
    });

    await Promise.all(photoInserts);

    // Get all photos for this progress update
    const [photos] = await pool.execute(
      'SELECT * FROM progress_photos WHERE progress_update_id = ? ORDER BY uploaded_at DESC',
      [id]
    );

    res.json({
      success: true,
      message: 'Photos uploaded successfully',
      photos: photos
    });

  } catch (error) {
    console.error('Upload progress photos error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload photos',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  submitProgressUpdate,
  getProjectProgress,
  getProgressUpdate,
  reviewProgressUpdate,
  uploadProgressPhotos
};
