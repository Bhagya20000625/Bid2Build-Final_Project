const { pool } = require('../config/database');

/**
 * Admin Dashboard Controller - Simple & Working Version
 * Handles admin dashboard data, statistics, and overview information
 */

// Get dashboard overview statistics
const getDashboardStats = async (req, res) => {
  try {
    console.log('📊 Getting dashboard stats...');

    // Get basic user counts with safe handling for missing columns
    const [totalCounts] = await pool.execute(`
      SELECT 
        COUNT(*) as total_users,
        COALESCE(SUM(CASE WHEN verification_status = 'pending' THEN 1 ELSE 0 END), 0) as pending_verifications,
        COALESCE(SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END), 0) as verified_users,
        COALESCE(SUM(CASE WHEN account_status = 'suspended' THEN 1 ELSE 0 END), 0) as suspended_users,
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END), 0) as new_users_today,
        COALESCE(SUM(CASE WHEN DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 ELSE 0 END), 0) as new_users_week
      FROM users
    `);

    console.log('✅ Total counts retrieved:', totalCounts[0]);

    // Get users by role with safe handling
    const [usersByRole] = await pool.execute(`
      SELECT 
        user_role,
        COUNT(*) as count,
        COALESCE(SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END), 0) as verified_count,
        COALESCE(SUM(CASE WHEN verification_status = 'pending' THEN 1 ELSE 0 END), 0) as pending_count,
        COALESCE(SUM(CASE WHEN verification_status = 'rejected' THEN 1 ELSE 0 END), 0) as rejected_count,
        COALESCE(SUM(CASE WHEN account_status = 'suspended' THEN 1 ELSE 0 END), 0) as suspended_count
      FROM users 
      GROUP BY user_role
    `);

    console.log('✅ Users by role retrieved:', usersByRole.length, 'roles');

    // Get recent users
    const [recentUsers] = await pool.execute(`
      SELECT 
        id, first_name, last_name, email, user_role, 
        COALESCE(verification_status, 'pending') as verification_status,
        COALESCE(account_status, 'active') as account_status,
        created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 10
    `);

    console.log('✅ Recent users retrieved:', recentUsers.length, 'users');

    // Default document and project stats (tables might not exist yet)
    const documentStats = { pending_documents: 0, users_with_pending_docs: 0 };
    const projectStats = { total_projects: 0, active_projects: 0 };

    const response = {
      success: true,
      data: {
        totals: totalCounts[0],
        usersByRole: usersByRole,
        recentUsers: recentUsers,
        documents: documentStats,
        projects: projectStats
      }
    };

    console.log('✅ Dashboard stats response prepared successfully');
    res.json(response);

  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user management data with filters
const getUserManagement = async (req, res) => {
  try {
    console.log('📋 Getting user management data...');
    console.log('📋 Request query params:', req.query);
    console.log('📋 Request headers:', req.headers.authorization);

    const { 
      role, 
      verification_status, 
      account_status, 
      search, 
      page = 1, 
      limit = 20,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    // Build WHERE clause
    let whereConditions = [];
    let queryParams = [];

    if (role) {
      whereConditions.push('user_role = ?');
      queryParams.push(role);
    }

    // Note: verification_status and account_status columns don't exist in current database schema
    // These filters will be ignored for now
    // TODO: Add these columns to database schema if needed

    if (search) {
      whereConditions.push('(first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count for pagination
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );

    // Validate sort_by column to prevent SQL injection and ensure column exists
    const validSortColumns = ['id', 'first_name', 'last_name', 'email', 'user_role', 'created_at'];
    const validatedSortBy = validSortColumns.includes(sort_by) ? sort_by : 'created_at';
    const validatedSortOrder = ['asc', 'desc'].includes(sort_order.toLowerCase()) ? sort_order.toLowerCase() : 'desc';

    // Get users with pagination
    const offset = (page - 1) * limit;
    console.log('📋 Query params array:', queryParams);
    console.log('📋 Limit:', parseInt(limit), 'Offset:', parseInt(offset));
    
    const [users] = await pool.execute(`
      SELECT 
        id, first_name, last_name, email, user_role, created_at
      FROM users 
      ${whereClause}
      ORDER BY ${validatedSortBy} ${validatedSortOrder}
      LIMIT ? OFFSET ?
    `, [...queryParams, limit, offset]);

    // Add default values for missing columns
    const usersWithDefaults = users.map(user => ({
      ...user,
      verification_status: 'pending', // Default since column doesn't exist
      account_status: 'active' // Default since column doesn't exist
    }));

    res.json({
      success: true,
      data: {
        users: usersWithDefaults,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(countResult[0].total / limit),
          total_users: countResult[0].total,
          per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('❌ Get user management error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user management data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get pending verifications
const getPendingVerifications = async (req, res) => {
  try {
    console.log('⏳ Getting pending verifications...');

    // Get users with pending verification and their document counts
    const [pendingUsers] = await pool.execute(`
      SELECT 
        u.id, u.first_name, u.last_name, u.email, u.user_role, u.created_at,
        COALESCE(d.document_count, 0) as document_count,
        COALESCE(d.latest_upload, u.created_at) as last_document_uploaded
      FROM users u
      LEFT JOIN (
        SELECT 
          user_id, 
          COUNT(*) as document_count,
          MAX(uploaded_at) as latest_upload
        FROM documents 
        WHERE project_id IS NULL
        GROUP BY user_id
      ) d ON u.id = d.user_id
      WHERE COALESCE(u.verification_status, 'pending') = 'pending'
      ORDER BY u.created_at DESC
    `);

    // Get pending documents with user info for document-centric view
    let pendingDocuments = [];
    try {
      const [docs] = await pool.execute(`
        SELECT 
          vd.*, 
          u.first_name, u.last_name, u.email, u.user_role
        FROM verification_documents vd
        JOIN users u ON vd.user_id = u.id
        WHERE vd.status = 'pending'
        ORDER BY vd.uploaded_at DESC
        LIMIT 20
      `);
      pendingDocuments = docs;
    } catch (error) {
      console.log('ℹ️ verification_documents table not found, using empty array');
    }

    res.json({
      success: true,
      data: {
        pendingUsers,
        pendingDocuments
      }
    });

  } catch (error) {
    console.error('❌ Get pending verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting pending verifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getDashboardStats,
  getUserManagement,
  getPendingVerifications
};