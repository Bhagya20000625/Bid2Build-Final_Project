const express = require('express');
const router = express.Router();

// Import controllers
const {
  sendMessage,
  getMessages,
  getConversation,
  markAsRead,
  markConversationAsRead,
  deleteMessage,
  getUserConversations,
  getUnreadCount,
  getSuggestedContacts
} = require('../controllers/messageController');

// Import validation middleware
const { validateMessage } = require('../middleware/messageValidation');

// Import upload middleware
const { uploadMessageAttachment, handleUploadError } = require('../middleware/upload');

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

// @route   PUT /api/messages/conversation/:userId1/:userId2/read
// @desc    Mark all messages from a conversation as read
// @access  Private
router.put('/conversation/:userId1/:userId2/read', markConversationAsRead);

// @route   DELETE /api/messages/:id
// @desc    Delete message
// @access  Private (Sender only)
router.delete('/:id', deleteMessage);

// @route   GET /api/messages/conversations/:userId
// @desc    Get all conversations for a user
// @access  Private
router.get('/conversations/:userId', getUserConversations);

// @route   GET /api/messages/unread-count/:userId
// @desc    Get unread message count for a user
// @access  Private
router.get('/unread-count/:userId', getUnreadCount);

// @route   GET /api/messages/suggested-contacts/:userId
// @desc    Get suggested conversation partners (bidders for clients, clients for others)
// @access  Private
router.get('/suggested-contacts/:userId', getSuggestedContacts);

// @route   POST /api/messages/upload-attachment
// @desc    Upload a file attachment for messages
// @access  Private
router.post('/upload-attachment', uploadMessageAttachment.single('file'), handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/message-attachments/${req.file.filename}`;

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;