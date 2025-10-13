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
      message
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
      `INSERT INTO notifications (user_id, type, title, message)
       VALUES (?, ?, ?, ?)`,
      [user_id, type, title, message]
    );

    const notificationId = result.insertId;

    // Get the created notification
    const [notifications] = await pool.execute(
      'SELECT * FROM notifications WHERE id = ?',
      [notificationId]
    );

    const notification = notifications[0];

    // Emit Socket.io event for real-time notification
    const io = req.app.get('io');
    if (io) {
      io.emit('new-notification', {
        userId: user_id,
        notification: notification
      });
      console.log(`🔔 Real-time notification sent to user ${user_id}`);
    }

    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      notificationId: notificationId,
      notification: notification
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
        SELECT id, type, title, message, is_read, created_at
        FROM notifications
        WHERE user_id = ? AND is_read = 0
        ORDER BY created_at DESC
        LIMIT 50
      `;
      queryParams = [parseInt(userId)];
    } else {
      query = `
        SELECT id, type, title, message, is_read, created_at
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
const createBidNotification = async (bidData, notificationType, io = null) => {
  try {
    let title, message, userId;

    switch (notificationType) {
      case 'bid_accepted':
        title = '🎉 Bid Accepted!';
        message = `Your bid for "${bidData.project_title}" has been accepted! Amount: $${parseFloat(bidData.bid_amount).toLocaleString()}`;
        userId = bidData.bidder_user_id;

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES (?, ?, ?, ?)`,
          [userId, 'bid_accepted', title, message]
        );
        break;

      case 'bid_rejected':
        title = '❌ Bid Not Selected';
        message = `Your bid for "${bidData.project_title}" was not selected. Amount: $${parseFloat(bidData.bid_amount).toLocaleString()}`;
        userId = bidData.bidder_user_id;

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES (?, ?, ?, ?)`,
          [userId, 'bid_rejected', title, message]
        );
        break;

      case 'new_bid':
        title = '💼 New Bid Received';
        message = `${bidData.bidder_name} submitted a bid for "${bidData.project_title}". Amount: $${parseFloat(bidData.bid_amount).toLocaleString()}`;
        userId = bidData.customer_id;

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES (?, ?, ?, ?)`,
          [userId, 'new_bid', title, message]
        );
        break;
    }

    // Emit Socket.io event for real-time notification
    if (io && userId) {
      const [notifications] = await pool.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      if (notifications.length > 0) {
        io.emit('new-notification', {
          userId: userId,
          notification: notifications[0]
        });
        console.log(`🔔 Real-time notification sent to user ${userId}`);
      }
    }

    console.log(`✅ ${notificationType} notification created for user ${userId}`);

  } catch (error) {
    console.error('Error creating bid notification:', error);
    // Don't throw error to avoid breaking the main bid operation
  }
};

// @desc    Helper function to create progress-related notifications
// @access  Internal use
const createProgressNotification = async (progressData, notificationType, io = null) => {
  try {
    let title, message, userId;

    switch (notificationType) {
      case 'progress_submitted':
        title = '📊 New Progress Update';
        message = `Constructor submitted a progress update for "${progressData.project_title}": ${progressData.milestone_name} (${progressData.progress_percentage}%)`;
        userId = progressData.client_id;

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES (?, ?, ?, ?)`,
          [userId, 'progress_update', title, message]
        );
        break;

      case 'progress_approved':
        title = '✅ Progress Update Approved';
        message = `Your progress update "${progressData.milestone_name}" has been approved!`;
        userId = progressData.constructor_id;

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES (?, ?, ?, ?)`,
          [userId, 'progress_approved', title, message]
        );
        break;

      case 'progress_rejected':
        title = '❌ Progress Update Rejected';
        message = `Your progress update "${progressData.milestone_name}" was rejected. ${progressData.review_comments ? 'Reason: ' + progressData.review_comments : ''}`;
        userId = progressData.constructor_id;

        await pool.execute(
          `INSERT INTO notifications (user_id, type, title, message)
           VALUES (?, ?, ?, ?)`,
          [userId, 'progress_rejected', title, message]
        );
        break;
    }

    // Emit Socket.io event for real-time notification
    if (io && userId) {
      const [notifications] = await pool.execute(
        'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
        [userId]
      );

      if (notifications.length > 0) {
        io.emit('new-notification', {
          userId: userId,
          notification: notifications[0]
        });
        console.log(`🔔 Real-time notification sent to user ${userId}`);
      }
    }

    console.log(`✅ ${notificationType} notification created for user ${userId}`);

  } catch (error) {
    console.error('Error creating progress notification:', error);
    // Don't throw error to avoid breaking the main progress operation
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  createBidNotification,
  createProgressNotification
};