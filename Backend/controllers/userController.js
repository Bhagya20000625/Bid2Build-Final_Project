const { pool } = require('../config/database');

// @desc    Get user profile by ID
// @route   GET /api/users/:userId
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    console.log('🔍 getUserProfile called with userId:', req.params.userId);
    const { userId } = req.params;

    // Get user basic info
    console.log('🔍 Executing user query...');
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, phone, user_role, created_at FROM users WHERE id = ?',
      [userId]
    );

    console.log('🔍 User query result:', users);

    if (users.length === 0) {
      console.log('🔍 No user found with ID:', userId);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];
    console.log('🔍 Found user:', user);

    // Return user info with consistent field names
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        user_role: user.user_role,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('🔴 Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getUserProfile
};