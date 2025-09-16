const express = require('express');
const router = express.Router();

// Import controllers (to be created)
const {
  sendMessage,
  getMessages,
  getConversation,
  markAsRead,
  deleteMessage
} = require('../controllers/messageController');

// Import validation middleware
const { validateMessage } = require('../middleware/messageValidation');

// @route   POST /api/messages
// @desc    Send a new message
// @access  Private
router.post('/', validateMessage, sendMessage);

// @route   GET /api/messages/user/:userId
// @desc    Get all messages for a user (inbox)
// @access  Private (User only - own messages)
router.get('/user/:userId', getMessages);

// @route   GET /api/messages/conversation/:userId1/:userId2
// @desc    Get conversation between two users
// @access  Private (Only participants)
router.get('/conversation/:userId1/:userId2', getConversation);

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private (Recipient only)
router.put('/:id/read', markAsRead);

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private (Sender only)
router.delete('/:id', deleteMessage);

module.exports = router;