const mysql = require('mysql2/promise');
const { createNotification } = require('./notificationController');

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

// @desc    Create payment
// @route   POST /api/payments
// @access  Private (Client only)
const createPayment = async (req, res) => {
  try {
    const {
      project_id,
      material_request_id,
      progress_update_id,
      bid_id,
      payer_id,
      payee_id,
      amount,
      payment_method,
      payment_notes
    } = req.body;

    // Validate required fields
    if (!bid_id || !payer_id || !payee_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Bid ID, Payer ID, Payee ID, and Amount are required'
      });
    }

    // Must have either project_id or material_request_id
    if (!project_id && !material_request_id) {
      return res.status(400).json({
        success: false,
        message: 'Either Project ID or Material Request ID is required'
      });
    }

    // Verify the bid and ownership
    let verifyQuery;
    let verifyParams;

    if (project_id) {
      verifyQuery = `
        SELECT b.*, p.user_id as owner_id
        FROM bids b
        JOIN projects p ON b.project_id = p.id
        WHERE b.id = ? AND b.project_id = ? AND b.status = 'accepted'`;
      verifyParams = [bid_id, project_id];
    } else {
      verifyQuery = `
        SELECT b.*, m.user_id as owner_id
        FROM bids b
        JOIN material_requests m ON b.material_request_id = m.id
        WHERE b.id = ? AND b.material_request_id = ? AND b.status = 'accepted'`;
      verifyParams = [bid_id, material_request_id];
    }

    const [bids] = await pool.execute(verifyQuery, verifyParams);

    if (bids.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found or not accepted'
      });
    }

    const bid = bids[0];

    // Verify payer is the project/material request owner
    if (bid.owner_id !== payer_id) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to make payment for this bid'
      });
    }

    // Verify payee is the bidder
    if (bid.bidder_user_id !== payee_id) {
      return res.status(400).json({
        success: false,
        message: 'Payee must be the bidder'
      });
    }

    // If progress_update_id is provided, verify it's approved
    if (progress_update_id) {
      const [progressUpdates] = await pool.execute(
        'SELECT * FROM progress_updates WHERE id = ? AND status = "approved"',
        [progress_update_id]
      );

      if (progressUpdates.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Progress update not found or not approved'
        });
      }
    }

    // Insert payment
    const [result] = await pool.execute(
      `INSERT INTO payments (
        project_id, material_request_id, progress_update_id, bid_id,
        payer_id, payee_id, amount, payment_method, payment_status,
        payment_notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, NOW())`,
      [
        project_id || null,
        material_request_id || null,
        progress_update_id || null,
        bid_id,
        payer_id,
        payee_id,
        amount,
        payment_method || 'bank_transfer',
        payment_notes || null
      ]
    );

    const paymentId = result.insertId;

    // Create notification for payee
    await createNotification({
      user_id: payee_id,
      type: 'payment_initiated',
      title: 'Payment Initiated',
      message: `Client has initiated a payment of $${amount}`,
      related_id: paymentId
    });

    // Get the created payment
    const [payments] = await pool.execute(
      `SELECT p.*,
              payer.first_name as payer_first_name,
              payer.last_name as payer_last_name,
              payee.first_name as payee_first_name,
              payee.last_name as payee_last_name
       FROM payments p
       JOIN users payer ON p.payer_id = payer.id
       JOIN users payee ON p.payee_id = payee.id
       WHERE p.id = ?`,
      [paymentId]
    );

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      payment: payments[0]
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/payments/:id/status
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status, transaction_reference } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(payment_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    // Check if payment exists
    const [payments] = await pool.execute(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const payment = payments[0];

    // Update payment status
    const updateData = [payment_status];
    let updateQuery = 'UPDATE payments SET payment_status = ?';

    if (transaction_reference) {
      updateQuery += ', transaction_reference = ?';
      updateData.push(transaction_reference);
    }

    if (payment_status === 'completed') {
      updateQuery += ', transaction_date = NOW()';
    }

    updateQuery += ' WHERE id = ?';
    updateData.push(id);

    await pool.execute(updateQuery, updateData);

    // Create notification for payee if completed
    if (payment_status === 'completed') {
      await createNotification({
        user_id: payment.payee_id,
        type: 'payment_completed',
        title: 'Payment Received',
        message: `Payment of $${payment.amount} has been completed`,
        related_id: id
      });
    }

    // Get updated payment
    const [updated] = await pool.execute(
      `SELECT p.*,
              payer.first_name as payer_first_name,
              payer.last_name as payer_last_name,
              payee.first_name as payee_first_name,
              payee.last_name as payee_last_name
       FROM payments p
       JOIN users payer ON p.payer_id = payer.id
       JOIN users payee ON p.payee_id = payee.id
       WHERE p.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      payment: updated[0]
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get payments for a project
// @route   GET /api/payments/project/:projectId
// @access  Private
const getProjectPayments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const [payments] = await pool.execute(
      `SELECT p.*,
              payer.first_name as payer_first_name,
              payer.last_name as payer_last_name,
              payee.first_name as payee_first_name,
              payee.last_name as payee_last_name,
              pu.description as progress_description
       FROM payments p
       JOIN users payer ON p.payer_id = payer.id
       JOIN users payee ON p.payee_id = payee.id
       LEFT JOIN progress_updates pu ON p.progress_update_id = pu.id
       WHERE p.project_id = ?
       ORDER BY p.created_at DESC`,
      [projectId]
    );

    // Calculate total paid and pending
    const totalPaid = payments
      .filter(p => p.payment_status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const totalPending = payments
      .filter(p => p.payment_status === 'pending' || p.payment_status === 'processing')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    res.json({
      success: true,
      count: payments.length,
      totalPaid: totalPaid,
      totalPending: totalPending,
      payments: payments
    });

  } catch (error) {
    console.error('Get project payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get payments for a user (payer or payee)
// @route   GET /api/payments/user/:userId
// @access  Private
const getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type } = req.query; // 'sent' or 'received'

    let query = `
      SELECT p.*,
             payer.first_name as payer_first_name,
             payer.last_name as payer_last_name,
             payee.first_name as payee_first_name,
             payee.last_name as payee_last_name,
             COALESCE(proj.title, mr.title) as item_title
      FROM payments p
      JOIN users payer ON p.payer_id = payer.id
      JOIN users payee ON p.payee_id = payee.id
      LEFT JOIN projects proj ON p.project_id = proj.id
      LEFT JOIN material_requests mr ON p.material_request_id = mr.id
      WHERE `;

    if (type === 'sent') {
      query += 'p.payer_id = ?';
    } else if (type === 'received') {
      query += 'p.payee_id = ?';
    } else {
      query += '(p.payer_id = ? OR p.payee_id = ?)';
    }

    query += ' ORDER BY p.created_at DESC';

    const params = type === 'sent' || type === 'received' ? [userId] : [userId, userId];
    const [payments] = await pool.execute(query, params);

    res.json({
      success: true,
      count: payments.length,
      payments: payments
    });

  } catch (error) {
    console.error('Get user payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single payment details
// @route   GET /api/payments/:id
// @access  Private
const getPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const [payments] = await pool.execute(
      `SELECT p.*,
              payer.first_name as payer_first_name,
              payer.last_name as payer_last_name,
              payer.email as payer_email,
              payee.first_name as payee_first_name,
              payee.last_name as payee_last_name,
              payee.email as payee_email,
              COALESCE(proj.title, mr.title) as item_title,
              pu.description as progress_description
       FROM payments p
       JOIN users payer ON p.payer_id = payer.id
       JOIN users payee ON p.payee_id = payee.id
       LEFT JOIN projects proj ON p.project_id = proj.id
       LEFT JOIN material_requests mr ON p.material_request_id = mr.id
       LEFT JOIN progress_updates pu ON p.progress_update_id = pu.id
       WHERE p.id = ?`,
      [id]
    );

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      payment: payments[0]
    });

  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get client payments with milestone details
// @route   GET /api/payments/client/:clientId
// @access  Private (Client only)
const getClientPayments = async (req, res) => {
  try {
    const { clientId } = req.params;

    const [payments] = await pool.execute(
      `SELECT p.*,
              payer.first_name as payer_first_name,
              payer.last_name as payer_last_name,
              payee.first_name as payee_first_name,
              payee.last_name as payee_last_name,
              COALESCE(proj.title, mr.title) as project_name,
              pu.milestone_name,
              pu.description as milestone_description,
              pu.progress_percentage,
              ds.title as design_title,
              ds.description as design_description,
              b.proposed_timeline,
              b.bidder_role
       FROM payments p
       JOIN users payer ON p.payer_id = payer.id
       JOIN users payee ON p.payee_id = payee.id
       LEFT JOIN projects proj ON p.project_id = proj.id
       LEFT JOIN material_requests mr ON p.material_request_id = mr.id
       LEFT JOIN progress_updates pu ON p.progress_update_id = pu.id
       LEFT JOIN design_submissions ds ON p.design_submission_id = ds.id
       LEFT JOIN bids b ON p.bid_id = b.id
       WHERE p.payer_id = ?
       ORDER BY p.created_at DESC`,
      [clientId]
    );

    // Calculate totals
    const totalPaid = payments
      .filter(p => p.payment_status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    const totalPending = payments
      .filter(p => p.payment_status === 'pending')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    res.json({
      success: true,
      count: payments.length,
      totalPaid: totalPaid,
      totalPending: totalPending,
      payments: payments
    });

  } catch (error) {
    console.error('Get client payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch client payments',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createPayment,
  updatePaymentStatus,
  getProjectPayments,
  getUserPayments,
  getPayment,
  getClientPayments
};
