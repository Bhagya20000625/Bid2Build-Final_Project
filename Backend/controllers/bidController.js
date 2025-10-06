const mysql = require('mysql2/promise');
const { createBidNotification } = require('./notificationController');

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

// @desc    Create a new bid
// @route   POST /api/bids
// @access  Private (Constructor, Architect, Supplier)
const createBid = async (req, res) => {
  try {
    const {
      project_id,
      material_request_id,
      bidder_user_id,
      bidder_role,
      bid_amount,
      proposed_timeline,
      description
    } = req.validatedData;

    // Check if project or material request exists
    if (project_id) {
      const [projects] = await pool.execute(
        'SELECT * FROM projects WHERE id = ? AND status = "active"',
        [project_id]
      );
      
      if (projects.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found or not active'
        });
      }
    }

    if (material_request_id) {
      const [materialRequests] = await pool.execute(
        'SELECT * FROM material_requests WHERE id = ? AND status = "active"',
        [material_request_id]
      );
      
      if (materialRequests.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Material request not found or not active'
        });
      }
    }

    // Check if bidder has already submitted a bid for this project/material request
    let existingBidQuery;
    let existingBidParams;

    if (project_id) {
      existingBidQuery = 'SELECT * FROM bids WHERE project_id = ? AND bidder_user_id = ?';
      existingBidParams = [project_id, bidder_user_id];
    } else {
      existingBidQuery = 'SELECT * FROM bids WHERE material_request_id = ? AND bidder_user_id = ?';
      existingBidParams = [material_request_id, bidder_user_id];
    }

    const [existingBids] = await pool.execute(existingBidQuery, existingBidParams);

    if (existingBids.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a bid for this ' + (project_id ? 'project' : 'material request')
      });
    }

    // Insert bid into database
    const [result] = await pool.execute(
      `INSERT INTO bids (
        bidder_user_id, bidder_role, project_id, material_request_id,
        bid_amount, proposed_timeline, description, status, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        bidder_user_id,
        bidder_role,
        project_id || null,
        material_request_id || null,
        bid_amount,
        proposed_timeline,
        description
      ]
    );

    const bidId = result.insertId;

    // Get the created bid with bidder details
    const [bids] = await pool.execute(
      `SELECT b.*, u.first_name, u.last_name, u.email,
              CASE 
                WHEN b.project_id IS NOT NULL THEN p.title
                ELSE mr.title
              END as item_title
       FROM bids b 
       JOIN users u ON b.bidder_user_id = u.id
       LEFT JOIN projects p ON b.project_id = p.id
       LEFT JOIN material_requests mr ON b.material_request_id = mr.id
       WHERE b.id = ?`,
      [bidId]
    );

    res.status(201).json({
      success: true,
      message: 'Bid submitted successfully',
      bid: bids[0]
    });

  } catch (error) {
    console.error('Create bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bid',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all bids (for testing/admin)
// @route   GET /api/bids
// @access  Private
const getAllBids = async (req, res) => {
  try {
    const [bids] = await pool.execute(
      `SELECT b.*, u.first_name, u.last_name, u.email,
              CASE 
                WHEN b.project_id IS NOT NULL THEN p.title
                ELSE mr.title
              END as item_title,
              CASE 
                WHEN b.project_id IS NOT NULL THEN 'project'
                ELSE 'material_request'
              END as bid_type
       FROM bids b 
       JOIN users u ON b.bidder_user_id = u.id
       LEFT JOIN projects p ON b.project_id = p.id
       LEFT JOIN material_requests mr ON b.material_request_id = mr.id
       ORDER BY b.submitted_at DESC`
    );

    res.json({
      success: true,
      count: bids.length,
      bids: bids
    });

  } catch (error) {
    console.error('Get all bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bids',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get bids for a specific project
// @route   GET /api/bids/project/:projectId
// @access  Private
const getBidsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Check if project exists
    const [projects] = await pool.execute('SELECT * FROM projects WHERE id = ?', [projectId]);
    
    if (projects.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const [bids] = await pool.execute(
      `SELECT b.*, u.first_name, u.last_name, u.email, u.user_role,
              p.title as project_title
       FROM bids b 
       JOIN users u ON b.bidder_user_id = u.id
       JOIN projects p ON b.project_id = p.id
       WHERE b.project_id = ?
       ORDER BY b.submitted_at DESC`,
      [projectId]
    );

    res.json({
      success: true,
      projectId: projectId,
      count: bids.length,
      bids: bids
    });

  } catch (error) {
    console.error('Get bids by project error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project bids',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get bids for a specific material request
// @route   GET /api/bids/material-request/:materialRequestId
// @access  Private
const getBidsByMaterialRequest = async (req, res) => {
  try {
    const { materialRequestId } = req.params;

    // Check if material request exists
    const [materialRequests] = await pool.execute(
      'SELECT * FROM material_requests WHERE id = ?',
      [materialRequestId]
    );
    
    if (materialRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material request not found'
      });
    }

    const [bids] = await pool.execute(
      `SELECT b.*, u.first_name, u.last_name, u.email, u.user_role,
              mr.title as material_request_title
       FROM bids b 
       JOIN users u ON b.bidder_user_id = u.id
       JOIN material_requests mr ON b.material_request_id = mr.id
       WHERE b.material_request_id = ?
       ORDER BY b.submitted_at DESC`,
      [materialRequestId]
    );

    res.json({
      success: true,
      materialRequestId: materialRequestId,
      count: bids.length,
      bids: bids
    });

  } catch (error) {
    console.error('Get bids by material request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch material request bids',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all bids received by customer
// @route   GET /api/bids/customer/:customerId
// @access  Private (Customer only)
const getCustomerBids = async (req, res) => {
  try {
    const { userId } = req.params;

    const [bids] = await pool.execute(
      `SELECT b.*, u.first_name, u.last_name, u.email, u.user_role,
              CASE
                WHEN b.project_id IS NOT NULL THEN p.title
                ELSE mr.title
              END as item_title,
              CASE
                WHEN b.project_id IS NOT NULL THEN 'project'
                ELSE 'material_request'
              END as bid_type
       FROM bids b
       JOIN users u ON b.bidder_user_id = u.id
       LEFT JOIN projects p ON b.project_id = p.id
       LEFT JOIN material_requests mr ON b.material_request_id = mr.id
       WHERE (p.user_id = ? OR mr.user_id = ?)
       ORDER BY b.submitted_at DESC`,
      [userId, userId]
    );

    res.json({
      success: true,
      userId: userId,
      count: bids.length,
      bids: bids
    });

  } catch (error) {
    console.error('Get customer bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer bids',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all bids submitted by bidder
// @route   GET /api/bids/bidder/:bidderId
// @access  Private (Bidder only)
const getBidderBids = async (req, res) => {
  try {
    const { bidderId } = req.params;

    const [bids] = await pool.execute(
      `SELECT b.*,
              CASE 
                WHEN b.project_id IS NOT NULL THEN p.title
                ELSE mr.title
              END as item_title,
              CASE 
                WHEN b.project_id IS NOT NULL THEN 'project'
                ELSE 'material_request'
              END as bid_type,
              CASE 
                WHEN b.project_id IS NOT NULL THEN cu.first_name
                ELSE cmu.first_name
              END as customer_first_name,
              CASE 
                WHEN b.project_id IS NOT NULL THEN cu.last_name
                ELSE cmu.last_name
              END as customer_last_name
       FROM bids b
       LEFT JOIN projects p ON b.project_id = p.id
       LEFT JOIN users cu ON p.user_id = cu.id
       LEFT JOIN material_requests mr ON b.material_request_id = mr.id
       LEFT JOIN users cmu ON mr.user_id = cmu.id
       WHERE b.bidder_user_id = ?
       ORDER BY b.submitted_at DESC`,
      [bidderId]
    );

    res.json({
      success: true,
      bidderId: bidderId,
      count: bids.length,
      bids: bids
    });

  } catch (error) {
    console.error('Get bidder bids error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bidder bids',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get bid by ID
// @route   GET /api/bids/:id
// @access  Private
const getBidById = async (req, res) => {
  try {
    const { id } = req.params;

    const [bids] = await pool.execute(
      `SELECT b.*, u.first_name, u.last_name, u.email, u.user_role,
              CASE 
                WHEN b.project_id IS NOT NULL THEN p.title
                ELSE mr.title
              END as item_title,
              CASE 
                WHEN b.project_id IS NOT NULL THEN 'project'
                ELSE 'material_request'
              END as bid_type
       FROM bids b 
       JOIN users u ON b.bidder_user_id = u.id
       LEFT JOIN projects p ON b.project_id = p.id
       LEFT JOIN material_requests mr ON b.material_request_id = mr.id
       WHERE b.id = ?`,
      [id]
    );

    if (bids.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    res.json({
      success: true,
      bid: bids[0]
    });

  } catch (error) {
    console.error('Get bid by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bid',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update bid status (accept/reject)
// @route   PUT /api/bids/:id/status
// @access  Private (Customer only)
const updateBidStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.validatedData;

    // Check if bid exists
    const [existingBids] = await pool.execute('SELECT * FROM bids WHERE id = ?', [id]);
    
    if (existingBids.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Update bid status
    await pool.execute(
      'UPDATE bids SET status = ? WHERE id = ?',
      [status, id]
    );

    // Get updated bid with project/material request details
    const [updatedBids] = await pool.execute(
      `SELECT b.*, u.first_name, u.last_name, u.email,
              CASE
                WHEN b.project_id IS NOT NULL THEN p.title
                ELSE mr.title
              END as item_title,
              CASE
                WHEN b.project_id IS NOT NULL THEN p.title
                ELSE mr.title
              END as project_title
       FROM bids b
       JOIN users u ON b.bidder_user_id = u.id
       LEFT JOIN projects p ON b.project_id = p.id
       LEFT JOIN material_requests mr ON b.material_request_id = mr.id
       WHERE b.id = ?`,
      [id]
    );

    const updatedBid = updatedBids[0];

    // Update project/material request status when bid is accepted
    if (status === 'accepted') {
      if (updatedBid.project_id) {
        // Update project status to 'awarded'
        await pool.execute(
          'UPDATE projects SET status = ? WHERE id = ?',
          ['awarded', updatedBid.project_id]
        );
      } else if (updatedBid.material_request_id) {
        // Update material request status to 'awarded'
        await pool.execute(
          'UPDATE material_requests SET status = ? WHERE id = ?',
          ['awarded', updatedBid.material_request_id]
        );
      }

      await createBidNotification(updatedBid, 'bid_accepted');
    } else if (status === 'rejected') {
      await createBidNotification(updatedBid, 'bid_rejected');
    }

    res.json({
      success: true,
      message: `Bid ${status} successfully`,
      bid: updatedBid
    });

  } catch (error) {
    console.error('Update bid status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bid status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete/withdraw bid
// @route   DELETE /api/bids/:id
// @access  Private (Bidder only)
const deleteBid = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if bid exists
    const [existingBids] = await pool.execute('SELECT * FROM bids WHERE id = ?', [id]);
    
    if (existingBids.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    // Check if bid can be withdrawn (only pending bids)
    if (existingBids[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw a bid that has already been responded to'
      });
    }

    // Delete bid
    await pool.execute('DELETE FROM bids WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Bid withdrawn successfully'
    });

  } catch (error) {
    console.error('Delete bid error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bid',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createBid,
  getAllBids,
  getBidsByProject,
  getBidsByMaterialRequest,
  getBidById,
  getCustomerBids,
  getBidderBids,
  updateBidStatus,
  deleteBid
};