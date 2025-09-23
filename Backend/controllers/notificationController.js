const { pool } = require('../config/database');

// @desc    Create a new notification
// @route   POST /api/notifications
// @access  Private
const createNotification = async (req, res) => {
  try {
    const {
      user_id,
      type,
      title,
      message,
      related_id = null,
      related_type = null,
      priority = 'medium',
      action_url = null
    } = req.body;

    // Validate required fields
    if (!user_id || !type || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'user_id, type, title, and message are required'
      });
    }

    // Insert notification
    const [result] = await pool.execute(
      `INSERT INTO notifications (user_id, type, title, message, related_id, related_type, priority, action_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, type, title, message, related_id, related_type, priority, action_url]
    );

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notificationId: result.insertId
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification',
      error: error.message
    });
  }
};

// @desc    Get notifications for a user
// @route   GET /api/notifications/user/:userId
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { unread_only = false, limit = 50 } = req.query;

    console.log('Getting notifications for user:', userId, 'unread_only:', unread_only, 'limit:', limit);

    let query, queryParams;

    if (unread_only === 'true') {
      query = `
        SELECT id, type, title, message, related_id, related_type, priority, action_url, is_read, created_at
        FROM notifications
        WHERE user_id = ? AND is_read = 0
        ORDER BY created_at DESC
        LIMIT 50
      `;
      queryParams = [parseInt(userId)];
    } else {
      query = `
        SELECT id, type, title, message, related_id, related_type, priority, action_url, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
      `;
      queryParams = [parseInt(userId)];
    }

    console.log('Executing query:', query);
    console.log('With params:', queryParams);

    const [notifications] = await pool.execute(query, queryParams);

    // Get unread count
    const [unreadCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      success: true,
      notifications,
      unreadCount: unreadCount[0].count,
      total: notifications.length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// @desc    Mark all notifications as read for a user
// @route   PUT /api/notifications/user/:userId/read-all
// @access  Private
const markAllNotificationsRead = async (req, res) => {
  try {
    const { userId } = req.params;

    const [result] = await pool.execute(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read',
      updatedCount: result.affectedRows
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute(
      'DELETE FROM notifications WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message
    });
  }
};

// @desc    Helper function to create bid-related notifications
// @access  Internal use
const createBidNotification = async (bidData, notificationType) => {
  try {
    let title, message, priority, action_url;

    switch (notificationType) {
      case 'bid_accepted':
        title = '🎉 Bid Accepted!';
        message = `Your bid for "${bidData.project_title}" has been accepted! Amount: $${parseFloat(bidData.bid_amount).toLocaleString()}`;
        priority = 'high';
        action_url = '/constructor-dashboard/active-projects';

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message, related_id, related_type, priority, action_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [bidData.bidder_user_id, 'bid_accepted', title, message, bidData.id, 'bid', priority, action_url]
        );
        break;

      case 'bid_rejected':
        title = '❌ Bid Not Selected';
        message = `Your bid for "${bidData.project_title}" was not selected. Amount: $${parseFloat(bidData.bid_amount).toLocaleString()}`;
        priority = 'medium';
        action_url = '/constructor-dashboard/browse-projects';

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message, related_id, related_type, priority, action_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [bidData.bidder_user_id, 'bid_rejected', title, message, bidData.id, 'bid', priority, action_url]
        );
        break;

      case 'new_bid':
        title = '💼 New Bid Received';
        message = `${bidData.bidder_name} submitted a bid for "${bidData.project_title}". Amount: $${parseFloat(bidData.bid_amount).toLocaleString()}`;
        priority = 'medium';
        action_url = '/customer-dashboard/view-bids';

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message, related_id, related_type, priority, action_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [bidData.customer_id, 'new_bid', title, message, bidData.id, 'bid', priority, action_url]
        );
        break;
    }

    console.log(`✅ ${notificationType} notification created for user ${bidData.bidder_user_id || bidData.customer_id}`);

  } catch (error) {
    console.error('Error creating bid notification:', error);
    // Don't throw error to avoid breaking the main bid operation
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  createBidNotification
};