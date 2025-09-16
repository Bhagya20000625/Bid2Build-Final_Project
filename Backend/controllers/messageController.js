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

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const {
      recipient_id,
      sender_id,
      project_id,
      subject,
      message
    } = req.validatedData;

    // Check if recipient exists
    const [recipients] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [recipient_id]
    );

    if (recipients.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if sender exists
    const [senders] = await pool.execute(
      'SELECT * FROM users WHERE id = ?',
      [sender_id]
    );

    if (senders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Sender not found'
      });
    }

    // If project_id is provided, check if project exists
    if (project_id) {
      const [projects] = await pool.execute(
        'SELECT * FROM projects WHERE id = ?',
        [project_id]
      );

      if (projects.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Project not found'
        });
      }
    }

    // Insert message into database
    const [result] = await pool.execute(
      `INSERT INTO messages (
        sender_id, recipient_id, project_id, subject, 
        message, is_read, sent_at
      ) VALUES (?, ?, ?, ?, ?, FALSE, NOW())`,
      [
        sender_id,
        recipient_id,
        project_id || null,
        subject || null,
        message
      ]
    );

    const messageId = result.insertId;

    // Get the created message with sender and recipient details
    const [messages] = await pool.execute(
      `SELECT m.*, 
              s.first_name as sender_first_name, s.last_name as sender_last_name,
              r.first_name as recipient_first_name, r.last_name as recipient_last_name,
              p.title as project_title
       FROM messages m 
       JOIN users s ON m.sender_id = s.id
       JOIN users r ON m.recipient_id = r.id
       LEFT JOIN projects p ON m.project_id = p.id
       WHERE m.id = ?`,
      [messageId]
    );

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      messageData: messages[0]
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get all messages for a user (inbox)
// @route   GET /api/messages/user/:userId
// @access  Private (User only - own messages)
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type = 'received' } = req.query; // 'received' or 'sent'

    let query;
    let params;

    if (type === 'sent') {
      query = `SELECT m.*, 
                      r.first_name as recipient_first_name, r.last_name as recipient_last_name,
                      p.title as project_title
               FROM messages m 
               JOIN users r ON m.recipient_id = r.id
               LEFT JOIN projects p ON m.project_id = p.id
               WHERE m.sender_id = ?
               ORDER BY m.sent_at DESC`;
      params = [userId];
    } else {
      query = `SELECT m.*, 
                      s.first_name as sender_first_name, s.last_name as sender_last_name,
                      p.title as project_title
               FROM messages m 
               JOIN users s ON m.sender_id = s.id
               LEFT JOIN projects p ON m.project_id = p.id
               WHERE m.recipient_id = ?
               ORDER BY m.sent_at DESC`;
      params = [userId];
    }

    const [messages] = await pool.execute(query, params);

    // Count unread messages
    const [unreadCount] = await pool.execute(
      'SELECT COUNT(*) as count FROM messages WHERE recipient_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      success: true,
      type: type,
      count: messages.length,
      unreadCount: unreadCount[0].count,
      messages: messages
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId1/:userId2
// @access  Private (Only participants)
const getConversation = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    const { projectId } = req.query;

    let query = `SELECT m.*, 
                        s.first_name as sender_first_name, s.last_name as sender_last_name,
                        r.first_name as recipient_first_name, r.last_name as recipient_last_name,
                        p.title as project_title
                 FROM messages m 
                 JOIN users s ON m.sender_id = s.id
                 JOIN users r ON m.recipient_id = r.id
                 LEFT JOIN projects p ON m.project_id = p.id
                 WHERE ((m.sender_id = ? AND m.recipient_id = ?) 
                    OR (m.sender_id = ? AND m.recipient_id = ?))`;

    let params = [userId1, userId2, userId2, userId1];

    // If project ID is specified, filter by project
    if (projectId) {
      query += ' AND m.project_id = ?';
      params.push(projectId);
    }

    query += ' ORDER BY m.sent_at ASC';

    const [messages] = await pool.execute(query, params);

    res.json({
      success: true,
      userId1: userId1,
      userId2: userId2,
      projectId: projectId || null,
      count: messages.length,
      messages: messages
    });

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private (Recipient only)
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const [existingMessages] = await pool.execute(
      'SELECT * FROM messages WHERE id = ?',
      [id]
    );

    if (existingMessages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Update message as read
    await pool.execute(
      'UPDATE messages SET is_read = TRUE WHERE id = ?',
      [id]
    );

    // Get updated message
    const [updatedMessages] = await pool.execute(
      `SELECT m.*, 
              s.first_name as sender_first_name, s.last_name as sender_last_name,
              p.title as project_title
       FROM messages m 
       JOIN users s ON m.sender_id = s.id
       LEFT JOIN projects p ON m.project_id = p.id
       WHERE m.id = ?`,
      [id]
    );

    res.json({
      success: true,
      message: 'Message marked as read',
      messageData: updatedMessages[0]
    });

  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark message as read',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private (Sender only)
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if message exists
    const [existingMessages] = await pool.execute(
      'SELECT * FROM messages WHERE id = ?',
      [id]
    );

    if (existingMessages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Delete message
    await pool.execute('DELETE FROM messages WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversation,
  markAsRead,
  deleteMessage
};