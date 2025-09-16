const mysql = require('mysql2/promise');

// Get database connection from config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'registration_database',
  port: process.env.DB_PORT || 3306
};

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// @desc    Create a new material request
// @route   POST /api/material-requests
// @access  Private (Customer only)
const createMaterialRequest = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      quantity,
      deadline,
      specifications,
      customer_id
    } = req.validatedData;

    // Check if customer exists first
    const [customers] = await pool.execute(
      'SELECT id FROM customers WHERE id = ?',
      [customer_id]
    );

    if (customers.length === 0) {
      return res.status(400).json({
        success: false,
        message: `Customer with ID ${customer_id} does not exist. Please ensure you are logged in with a valid customer account.`
      });
    }

    // Insert material request into database
    const [result] = await pool.execute(
      `INSERT INTO material_requests (
        customer_id, title, category, description, quantity,
        deadline, specifications, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [
        customer_id,
        title,
        category,
        description,
        quantity,
        deadline,
        specifications || null
      ]
    );

    const materialRequestId = result.insertId;

    if (!materialRequestId) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create material request. Database insert failed.'
      });
    }

    // Get the created material request with customer details
    const [materialRequests] = await pool.execute(
      `SELECT mr.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email
       FROM material_requests mr
       LEFT JOIN customers c ON mr.customer_id = c.id
       LEFT JOIN users u ON c.user_id = u.id
       WHERE mr.id = ?`,
      [materialRequestId]
    );

    res.status(201).json({
      success: true,
      message: 'Material request created successfully',
      materialRequest: materialRequests[0]
    });

  } catch (error) {
    console.error('Create material request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create material request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all material requests (for testing/admin)
// @route   GET /api/material-requests
// @access  Private
const getAllMaterialRequests = async (req, res) => {
  try {
    const [materialRequests] = await pool.execute(
      `SELECT mr.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email,
              COUNT(b.id) as bid_count
       FROM material_requests mr
       LEFT JOIN customers c ON mr.customer_id = c.id
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN bids b ON mr.id = b.material_request_id
       GROUP BY mr.id
       ORDER BY mr.created_at DESC`
    );

    res.json({
      success: true,
      count: materialRequests.length,
      materialRequests: materialRequests
    });

  } catch (error) {
    console.error('Get all material requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch material requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get material requests for suppliers
// @route   GET /api/material-requests/supplier
// @access  Private (Supplier only)
const getMaterialRequestsForSuppliers = async (req, res) => {
  try {
    const [materialRequests] = await pool.execute(
      `SELECT mr.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email,
              COUNT(b.id) as bid_count
       FROM material_requests mr
       LEFT JOIN customers c ON mr.customer_id = c.id
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN bids b ON mr.id = b.material_request_id
       WHERE mr.status = 'active'
       GROUP BY mr.id
       ORDER BY mr.deadline ASC, mr.created_at DESC`
    );

    res.json({
      success: true,
      count: materialRequests.length,
      materialRequests: materialRequests
    });

  } catch (error) {
    console.error('Get material requests for suppliers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch material requests for suppliers',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get material requests by customer
// @route   GET /api/material-requests/customer/:customerId
// @access  Private (Customer only - own requests)
const getCustomerMaterialRequests = async (req, res) => {
  try {
    const { customerId } = req.params;

    const [materialRequests] = await pool.execute(
      `SELECT mr.*, COUNT(b.id) as bid_count
       FROM material_requests mr 
       LEFT JOIN bids b ON mr.id = b.material_request_id
       WHERE mr.customer_id = ?
       GROUP BY mr.id
       ORDER BY mr.created_at DESC`,
      [customerId]
    );

    res.json({
      success: true,
      count: materialRequests.length,
      materialRequests: materialRequests
    });

  } catch (error) {
    console.error('Get customer material requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer material requests',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get material request by ID
// @route   GET /api/material-requests/:id
// @access  Private
const getMaterialRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const [materialRequests] = await pool.execute(
      `SELECT mr.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email,
              COUNT(b.id) as bid_count
       FROM material_requests mr
       LEFT JOIN customers c ON mr.customer_id = c.id
       LEFT JOIN users u ON c.user_id = u.id
       LEFT JOIN bids b ON mr.id = b.material_request_id
       WHERE mr.id = ?
       GROUP BY mr.id`,
      [id]
    );

    if (materialRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material request not found'
      });
    }

    res.json({
      success: true,
      materialRequest: materialRequests[0]
    });

  } catch (error) {
    console.error('Get material request by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch material request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update material request
// @route   PUT /api/material-requests/:id
// @access  Private (Customer only - own requests)
const updateMaterialRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.validatedData;

    // Check if material request exists
    const [existingRequests] = await pool.execute(
      'SELECT * FROM material_requests WHERE id = ?',
      [id]
    );

    if (existingRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material request not found'
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
      `UPDATE material_requests SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    // Get updated material request
    const [updatedRequests] = await pool.execute(
      `SELECT mr.*,
              COALESCE(u.first_name, 'Unknown') as first_name,
              COALESCE(u.last_name, 'Customer') as last_name,
              COALESCE(u.email, 'unknown@example.com') as email
       FROM material_requests mr
       LEFT JOIN customers c ON mr.customer_id = c.id
       LEFT JOIN users u ON c.user_id = u.id
       WHERE mr.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Material request updated successfully',
      materialRequest: updatedRequests[0]
    });

  } catch (error) {
    console.error('Update material request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update material request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete material request
// @route   DELETE /api/material-requests/:id
// @access  Private (Customer only - own requests)
const deleteMaterialRequest = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if material request exists
    const [existingRequests] = await pool.execute(
      'SELECT * FROM material_requests WHERE id = ?',
      [id]
    );

    if (existingRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Material request not found'
      });
    }

    // Delete material request (CASCADE will handle related records)
    await pool.execute('DELETE FROM material_requests WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Material request deleted successfully'
    });

  } catch (error) {
    console.error('Delete material request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete material request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  createMaterialRequest,
  getAllMaterialRequests,
  getMaterialRequestsForSuppliers,
  getCustomerMaterialRequests,
  getMaterialRequestById,
  updateMaterialRequest,
  deleteMaterialRequest
};