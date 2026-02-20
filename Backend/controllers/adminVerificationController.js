const { pool } = require('../config/database');

/**
 * Admin Verification Controller
 * Handles user verification approval/rejection and document management
 */

// Get verification statistics
const getVerificationStats = async (req, res) => {
  try {
    console.log('📊 Getting verification stats...');

    // Get overall verification counts
    const [verificationCounts] = await pool.execute(`
      SELECT 
        COALESCE(SUM(CASE WHEN verification_status = 'pending' THEN 1 ELSE 0 END), 0) as pending,
        COALESCE(SUM(CASE WHEN verification_status = 'verified' THEN 1 ELSE 0 END), 0) as verified,
        COALESCE(SUM(CASE WHEN verification_status = 'rejected' THEN 1 ELSE 0 END), 0) as rejected,
        COALESCE(SUM(CASE WHEN verification_status = 'verified' AND DATE(verified_at) = CURDATE() THEN 1 ELSE 0 END), 0) as approved_today
      FROM users
    `);

    // Get document verification stats if verification_documents table exists
    let documentStats = { pending: 0, approved: 0, rejected: 0 };
    try {
      const [docCounts] = await pool.execute(`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END), 0) as pending,
          COALESCE(SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END), 0) as approved,
          COALESCE(SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END), 0) as rejected
        FROM verification_documents
      `);
      documentStats = docCounts[0];
    } catch (error) {
      console.log('ℹ️ verification_documents table not found, using default stats');
    }

    res.json({
      success: true,
      data: {
        users: verificationCounts[0],
        documents: documentStats
      }
    });

  } catch (error) {
    console.error('❌ Get verification stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting verification statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get user's verification documents
const getUserDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('📄 Getting registration documents for user:', userId);

    // Get user info
    const [users] = await pool.execute(
      'SELECT id, first_name, last_name, email, user_role, verification_status FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Get registration documents from documents table (project_id IS NULL means registration documents)
    let documents = [];
    try {
      const [docs] = await pool.execute(
        `SELECT 
          id, document_type, original_name, file_name, file_path, 
          mime_type, file_size, uploaded_at
        FROM documents 
        WHERE user_id = ? AND project_id IS NULL
        ORDER BY uploaded_at DESC`,
        [userId]
      );
      
      // Format documents to match expected structure
      documents = docs.map(doc => ({
        id: doc.id,
        document_type: doc.document_type,
        file_name: doc.original_name || doc.file_name,
        file_path: doc.file_name, // Use the actual filename for URL construction
        file_type: doc.mime_type,
        file_size: doc.file_size,
        uploaded_at: doc.uploaded_at,
        status: 'pending', // Registration documents are always pending until user is verified
        review_notes: null
      }));
      
      console.log(`✅ Found ${documents.length} registration documents for user ${userId}`);
    } catch (error) {
      console.error('❌ Error fetching registration documents:', error);
    }

    res.json({
      success: true,
      data: {
        user,
        documents
      }
    });

  } catch (error) {
    console.error('❌ Get user documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting user documents',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Approve user verification
const approveVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;
    const adminId = req.admin?.id;

    console.log('✅ Approving verification for user:', userId, 'by admin:', adminId);

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update user verification status
      await connection.execute(
        `UPDATE users 
         SET verification_status = 'verified', 
             verified_by = ?, 
             verified_at = NOW()
         WHERE id = ?`,
        [adminId, userId]
      );

      // Update verification documents to approved if they exist
      try {
        await connection.execute(
          `UPDATE verification_documents 
           SET status = 'approved', 
               reviewed_by = ?, 
               reviewed_at = NOW(),
               review_notes = ?
           WHERE user_id = ? AND status = 'pending'`,
          [adminId, notes || 'Approved by admin', userId]
        );
      } catch (error) {
        console.log('ℹ️ No verification_documents table to update');
      }

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: 'User verification approved successfully'
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('❌ Approve verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error approving verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Reject user verification
const rejectVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.admin?.id;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    console.log('❌ Rejecting verification for user:', userId, 'by admin:', adminId);

    // Start transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Update user verification status
      await connection.execute(
        `UPDATE users 
         SET verification_status = 'rejected', 
             verified_by = ?, 
             verified_at = NOW(),
             rejection_reason = ?
         WHERE id = ?`,
        [adminId, reason, userId]
      );

      // Update verification documents to rejected if they exist
      try {
        await connection.execute(
          `UPDATE verification_documents 
           SET status = 'rejected', 
               reviewed_by = ?, 
               reviewed_at = NOW(),
               review_notes = ?
           WHERE user_id = ? AND status = 'pending'`,
          [adminId, reason, userId]
        );
      } catch (error) {
        console.log('ℹ️ No verification_documents table to update');
      }

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: 'User verification rejected successfully'
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error('❌ Reject verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error rejecting verification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  getVerificationStats,
  getUserDocuments,
  approveVerification,
  rejectVerification
};