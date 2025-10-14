const mysql = require('mysql2/promise');
const { createDesignNotification } = require('./notificationController');

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

// @desc    Submit design with files
// @route   POST /api/designs
// @access  Private (Architect only)
const submitDesign = async (req, res) => {
  try {
    const {
      project_id,
      bid_id,
      architect_id,
      client_id,
      title,
      description,
      payment_amount
    } = req.body;

    console.log('📐 Received design submission:', {
      project_id,
      bid_id,
      title,
      payment_amount
    });

    // Validate required fields
    if (!project_id || !bid_id || !architect_id || !client_id || !title || !payment_amount) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, Bid ID, Architect ID, Client ID, Title, and Payment Amount are required'
      });
    }

    // Verify the bid belongs to this architect and is accepted
    const [bids] = await pool.execute(
      `SELECT b.*, p.user_id as project_owner_id, p.title as project_title
       FROM bids b
       JOIN projects p ON b.project_id = p.id
       WHERE b.id = ? AND b.project_id = ? AND b.bidder_user_id = ? AND b.bidder_role = 'architect' AND b.status = 'accepted'`,
      [bid_id, project_id, architect_id]
    );

    if (bids.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found or you do not have permission to submit design for this project'
      });
    }

    const bid = bids[0];

    // Check if design already submitted for this project
    const [existingSubmissions] = await pool.execute(
      'SELECT * FROM design_submissions WHERE project_id = ? AND bid_id = ?',
      [project_id, bid_id]
    );

    if (existingSubmissions.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Design already submitted for this project. Please contact support to resubmit.'
      });
    }

    // Insert design submission
    const [result] = await pool.execute(
      `INSERT INTO design_submissions (
        project_id, bid_id, architect_id, client_id, title, description, payment_amount, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_review', NOW())`,
      [project_id, bid_id, architect_id, client_id, title, description || '', parseFloat(payment_amount)]
    );

    console.log('✅ Design submission created with ID:', result.insertId);

    const designSubmissionId = result.insertId;

    // Handle file uploads if any
    if (req.files && req.files.length > 0) {
      console.log('Processing design file uploads:', req.files.length);
      for (const file of req.files) {
        await pool.execute(
          `INSERT INTO design_files (
            design_submission_id, file_path, file_name, file_type, file_size, uploaded_at
          ) VALUES (?, ?, ?, ?, ?, NOW())`,
          [designSubmissionId, file.path, file.originalname, file.mimetype, file.size]
        );
      }
      console.log(`✅ Uploaded ${req.files.length} design files`);
    }

    // Create notification for client
    const io = req.app.get('io');
    await createDesignNotification({
      client_id: client_id,
      project_title: bid.project_title,
      design_title: title
    }, 'design_submitted', io);

    // Get the created design submission with files
    const [submissions] = await pool.execute(
      `SELECT ds.*,
              u.first_name as architect_first_name, u.last_name as architect_last_name
       FROM design_submissions ds
       JOIN users u ON ds.architect_id = u.id
       WHERE ds.id = ?`,
      [designSubmissionId]
    );

    // Get files
    const [files] = await pool.execute(
      'SELECT * FROM design_files WHERE design_submission_id = ?',
      [designSubmissionId]
    );

    res.status(201).json({
      success: true,
      message: 'Design submitted successfully',
      submission: {
        ...submissions[0],
        files: files
      }
    });

  } catch (error) {
    console.error('Submit design error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit design',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get architect's design submissions
// @route   GET /api/designs/architect/:architectId
// @access  Private (Architect only)
const getArchitectSubmissions = async (req, res) => {
  try {
    const { architectId } = req.params;

    const [submissions] = await pool.execute(
      `SELECT ds.*,
              p.title as project_title,
              c.first_name as client_first_name,
              c.last_name as client_last_name,
              (SELECT COUNT(*) FROM design_files WHERE design_submission_id = ds.id) as file_count
       FROM design_submissions ds
       JOIN projects p ON ds.project_id = p.id
       JOIN users c ON ds.client_id = c.id
       WHERE ds.architect_id = ?
       ORDER BY ds.submitted_at DESC`,
      [architectId]
    );

    res.json({
      success: true,
      count: submissions.length,
      submissions: submissions
    });

  } catch (error) {
    console.error('Get architect submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get design submission for a project
// @route   GET /api/designs/project/:projectId
// @access  Private (Client or Architect)
const getProjectDesignSubmission = async (req, res) => {
  try {
    const { projectId } = req.params;

    console.log('🔍 Backend: Searching for design submission with project_id:', projectId);

    // First check if design submission exists without JOINs
    const [simpleCheck] = await pool.execute(
      'SELECT * FROM design_submissions WHERE project_id = ?',
      [projectId]
    );
    console.log('📋 Backend: Simple check found', simpleCheck.length, 'submissions');
    if (simpleCheck.length > 0) {
      console.log('📋 Backend: Submission data:', {
        id: simpleCheck[0].id,
        project_id: simpleCheck[0].project_id,
        bid_id: simpleCheck[0].bid_id,
        architect_id: simpleCheck[0].architect_id,
        client_id: simpleCheck[0].client_id
      });
    }

    const [submissions] = await pool.execute(
      `SELECT ds.*,
              a.first_name as architect_first_name,
              a.last_name as architect_last_name,
              a.email as architect_email,
              COALESCE(c.first_name, p_owner.first_name) as client_first_name,
              COALESCE(c.last_name, p_owner.last_name) as client_last_name,
              p.title as project_title,
              p.user_id as actual_client_id,
              b.bid_amount,
              b.proposed_timeline
       FROM design_submissions ds
       JOIN users a ON ds.architect_id = a.id
       LEFT JOIN users c ON ds.client_id = c.id
       JOIN projects p ON ds.project_id = p.id
       JOIN users p_owner ON p.user_id = p_owner.id
       JOIN bids b ON ds.bid_id = b.id
       WHERE ds.project_id = ?
       ORDER BY ds.submitted_at DESC
       LIMIT 1`,
      [projectId]
    );

    console.log('📊 Backend: Query returned', submissions.length, 'submissions');

    if (submissions.length === 0) {
      // Debug: Check what design submissions exist in the database
      const [allSubmissions] = await pool.execute(
        'SELECT id, project_id, title, status FROM design_submissions'
      );
      console.log('🔍 Backend: All design submissions in DB:', allSubmissions);

      return res.json({
        success: true,
        submission: null,
        message: 'No design submission found for this project'
      });
    }

    console.log('✅ Backend: Found design submission:', submissions[0]);

    // Get files for this submission
    const [files] = await pool.execute(
      'SELECT * FROM design_files WHERE design_submission_id = ? ORDER BY uploaded_at',
      [submissions[0].id]
    );

    res.json({
      success: true,
      submission: {
        ...submissions[0],
        files: files
      }
    });

  } catch (error) {
    console.error('Get project design submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch design submission',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Review design submission (approve or reject)
// @route   PUT /api/designs/:id/review
// @access  Private (Client only)
const reviewDesignSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewed_by, status, review_comments } = req.body;

    console.log('📝 Reviewing design submission:', { id, status, reviewed_by });

    // Validate status
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be either "approved" or "rejected"'
      });
    }

    // Get the design submission with project owner info
    const [submissions] = await pool.execute(
      `SELECT ds.*, p.user_id as project_owner_id
       FROM design_submissions ds
       JOIN projects p ON ds.project_id = p.id
       WHERE ds.id = ?`,
      [id]
    );

    if (submissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Design submission not found'
      });
    }

    const submission = submissions[0];

    console.log('🔐 Permission check:', {
      project_owner_id: submission.project_owner_id,
      reviewed_by: reviewed_by,
      client_id_in_submission: submission.client_id
    });

    // Verify reviewer is the project owner (not client_id which might be 0)
    if (submission.project_owner_id !== reviewed_by) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to review this design submission'
      });
    }

    // Update submission status
    await pool.execute(
      `UPDATE design_submissions
       SET status = ?, reviewed_by = ?, reviewed_at = NOW(), review_comments = ?
       WHERE id = ?`,
      [status, reviewed_by, review_comments || null, id]
    );

    console.log(`✅ Design submission ${status}`);

    // If approved, create payment record
    if (status === 'approved') {
      console.log('💰 Creating payment record for approved design...');

      const [paymentResult] = await pool.execute(
        `INSERT INTO payments (
          project_id, design_submission_id, bid_id, payer_id, payee_id, amount, payment_status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
        [
          submission.project_id,
          submission.id,
          submission.bid_id,
          submission.project_owner_id, // Use project_owner_id instead of client_id
          submission.architect_id,
          parseFloat(submission.payment_amount)
        ]
      );

      console.log('✅ Payment record created with ID:', paymentResult.insertId);

      // Create notification for architect
      const io = req.app.get('io');
      await createDesignNotification({
        architect_id: submission.architect_id,
        design_title: submission.title
      }, 'design_approved', io);
    } else {
      // Create notification for rejection
      const io = req.app.get('io');
      await createDesignNotification({
        architect_id: submission.architect_id,
        design_title: submission.title,
        review_comments: review_comments || ''
      }, 'design_rejected', io);
    }

    // Get updated submission
    const [updatedSubmissions] = await pool.execute(
      `SELECT ds.*,
              reviewer.first_name as reviewed_by_first_name,
              reviewer.last_name as reviewed_by_last_name
       FROM design_submissions ds
       LEFT JOIN users reviewer ON ds.reviewed_by = reviewer.id
       WHERE ds.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: `Design ${status} successfully`,
      submission: updatedSubmissions[0]
    });

  } catch (error) {
    console.error('Review design submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review design submission',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get design files
// @route   GET /api/designs/:id/files
// @access  Private
const getDesignFiles = async (req, res) => {
  try {
    const { id } = req.params;

    const [files] = await pool.execute(
      'SELECT * FROM design_files WHERE design_submission_id = ? ORDER BY uploaded_at',
      [id]
    );

    res.json({
      success: true,
      count: files.length,
      files: files
    });

  } catch (error) {
    console.error('Get design files error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch design files',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  submitDesign,
  getArchitectSubmissions,
  getProjectDesignSubmission,
  reviewDesignSubmission,
  getDesignFiles
};
