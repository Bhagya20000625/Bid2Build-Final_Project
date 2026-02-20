const express = require('express');
const router = express.Router();
const {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
} = require('../controllers/notificationController');

// @route   POST /api/notifications
// @desc    Create a new notification
// @access  Private
router.post('/', createNotification);

// @route   GET /api/notifications/user/:userId
// @desc    Get notifications for a user
// @access  Private
router.get('/user/:userId', getUserNotifications);

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', markNotificationRead);

// @route   PUT /api/notifications/user/:userId/read-all
// @desc    Mark all notifications as read for a user
// @access  Private
router.put('/user/:userId/read-all', markAllNotificationsRead);

// @route   DELETE /api/notifications/:id
// @desc    Delete notification
// @access  Private
router.delete('/:id', deleteNotification);

module.exports = router;