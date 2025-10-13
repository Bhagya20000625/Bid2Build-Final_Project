const mysql = require('mysql2/promise');

// Get database connection from config
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bid2build',
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
    // Build dynamic query based on optional fields
    let insertQuery = `INSERT INTO messages (sender_id, recipient_id, message, is_read, created_at`;
    let insertParams = [sender_id, recipient_id, message];

    if (project_id) {
      insertQuery += `, project_id`;
      insertParams.splice(2, 0, project_id);
    }

    if (subject) {
      insertQuery += `, subject`;
      insertParams.splice(project_id ? 3 : 2, 0, subject);
    }

    insertQuery += `) VALUES (?, ?, ?${project_id ? ', ?' : ''}${subject ? ', ?' : ''}, FALSE, NOW())`;

    const [result] = await pool.execute(insertQuery, insertParams);

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

    // Create notification for message recipient
    try {
      const io = req.app.get('io');
      const notificationTitle = '💬 New Message';
      const notificationMessage = `You have a new message from ${senders[0].first_name} ${senders[0].last_name}`;

      await pool.execute(
        `INSERT INTO notifications (user_id, type, title, message)
         VALUES (?, ?, ?, ?)`,
        [recipient_id, 'new_message', notificationTitle, notificationMessage]
      );

      // Emit Socket.io event for real-time notification
      if (io) {
        const [newNotifications] = await pool.execute(
          'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
          [recipient_id]
        );

        if (newNotifications.length > 0) {
          io.emit('new-notification', {
            userId: recipient_id,
            notification: newNotifications[0]
          });
          console.log(`🔔 Message notification sent to user ${recipient_id}`);
        }
      }
    } catch (notifError) {
      console.error('Failed to create message notification:', notifError);
      // Don't fail the message send if notification fails
    }

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
               ORDER BY m.created_at DESC`;
      params = [userId];
    } else {
      query = `SELECT m.*, 
                      s.first_name as sender_first_name, s.last_name as sender_last_name,
                      p.title as project_title
               FROM messages m 
               JOIN users s ON m.sender_id = s.id
               LEFT JOIN projects p ON m.project_id = p.id
               WHERE m.recipient_id = ?
               ORDER BY m.created_at DESC`;
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

    query += ' ORDER BY m.created_at ASC';

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

    // Emit Socket.io event to sender if available
    const io = req.app.get('io');
    if (io && existingMessages[0].sender_id) {
      io.emit('message-read', {
        messageId: id,
        senderId: existingMessages[0].sender_id,
        recipientId: existingMessages[0].recipient_id
      });
    }

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

// @desc    Mark all messages from a conversation as read
// @route   PUT /api/messages/conversation/:userId1/:userId2/read
// @access  Private
const markConversationAsRead = async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    // Mark all messages from userId2 to userId1 as read
    const [result] = await pool.execute(
      'UPDATE messages SET is_read = TRUE WHERE sender_id = ? AND recipient_id = ? AND is_read = FALSE',
      [userId2, userId1]
    );

    // Emit Socket.io event to sender
    const io = req.app.get('io');
    if (io) {
      io.emit('conversation-read', {
        senderId: userId2,
        recipientId: userId1,
        markedCount: result.affectedRows
      });
    }

    res.json({
      success: true,
      message: 'Conversation marked as read',
      markedCount: result.affectedRows
    });

  } catch (error) {
    console.error('Mark conversation as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark conversation as read',
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

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations/:userId
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get all unique conversations (users this person has messaged with)
    const [conversations] = await pool.execute(
      `SELECT
        CASE
          WHEN m.sender_id = ? THEN m.recipient_id
          ELSE m.sender_id
        END as other_user_id,
        MAX(m.id) as last_message_id,
        MAX(m.created_at) as last_message_time
      FROM messages m
      WHERE m.sender_id = ? OR m.recipient_id = ?
      GROUP BY other_user_id
      ORDER BY last_message_time DESC`,
      [userId, userId, userId]
    );

    // Get details for each conversation
    const conversationDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Get other user details
        const [users] = await pool.execute(
          'SELECT id, first_name, last_name, email, user_role FROM users WHERE id = ?',
          [conv.other_user_id]
        );

        // Get last message
        const [lastMessages] = await pool.execute(
          'SELECT message FROM messages WHERE id = ?',
          [conv.last_message_id]
        );

        // Count unread messages
        const [unreadCount] = await pool.execute(
          'SELECT COUNT(*) as count FROM messages WHERE sender_id = ? AND recipient_id = ? AND is_read = FALSE',
          [conv.other_user_id, userId]
        );

        return {
          id: conv.other_user_id,
          other_user_id: users[0].id,
          other_user_name: `${users[0].first_name} ${users[0].last_name}`,
          other_user_first_name: users[0].first_name,
          other_user_last_name: users[0].last_name,
          other_user_email: users[0].email,
          role: users[0].user_role,
          other_user_role: users[0].user_role,
          last_message: lastMessages[0]?.message || '',
          last_message_time: conv.last_message_time,
          unread_count: unreadCount[0].count
        };
      })
    );

    res.json({
      success: true,
      count: conversationDetails.length,
      conversations: conversationDetails
    });

  } catch (error) {
    console.error('Get user conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get unread message count for a user
// @route   GET /api/messages/unread-count/:userId
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const [result] = await pool.execute(
      'SELECT COUNT(*) as count FROM messages WHERE recipient_id = ? AND is_read = FALSE',
      [userId]
    );

    res.json({
      success: true,
      unreadCount: result[0].count
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get suggested conversation partners (people who bid on user's projects/material requests)
// @route   GET /api/messages/suggested-contacts/:userId
// @access  Private
const getSuggestedContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the user's role
    const [users] = await pool.execute(
      'SELECT user_role FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userRole = users[0].user_role;
    let contacts = [];

    if (userRole === 'customer' || userRole === 'client') {
      // For clients: Show ONLY constructors, architects, and suppliers who bid on their projects/materials
      const [bidders] = await pool.execute(
        `SELECT
          u.id as contact_id,
          u.first_name,
          u.last_name,
          u.email,
          u.user_role as contact_role,
          GROUP_CONCAT(DISTINCT COALESCE(p.title, mr.title) SEPARATOR ', ') as related_item_title,
          CASE
            WHEN COUNT(DISTINCT b.project_id) > 0 THEN 'project'
            ELSE 'material_request'
          END as related_item_type,
          MAX(b.submitted_at) as interaction_date
        FROM bids b
        JOIN users u ON b.bidder_user_id = u.id
        LEFT JOIN projects p ON b.project_id = p.id
        LEFT JOIN material_requests mr ON b.material_request_id = mr.id
        WHERE (p.user_id = ? OR mr.user_id = ?)
          AND u.user_role IN ('constructor', 'architect', 'supplier')
          AND u.id != ?
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.user_role
        ORDER BY MAX(b.submitted_at) DESC`,
        [userId, userId, userId]
      );

      contacts = bidders;
    } else {
      // For constructors, architects, suppliers: Show ONLY clients they've bid for
      const [clients] = await pool.execute(
        `SELECT
          u.id as contact_id,
          u.first_name,
          u.last_name,
          u.email,
          u.user_role as contact_role,
          GROUP_CONCAT(DISTINCT COALESCE(p.title, mr.title) SEPARATOR ', ') as related_item_title,
          CASE
            WHEN COUNT(DISTINCT b.project_id) > 0 THEN 'project'
            ELSE 'material_request'
          END as related_item_type,
          MAX(b.submitted_at) as interaction_date
        FROM bids b
        LEFT JOIN projects p ON b.project_id = p.id
        LEFT JOIN material_requests mr ON b.material_request_id = mr.id
        JOIN users u ON COALESCE(p.user_id, mr.user_id) = u.id
        WHERE b.bidder_user_id = ?
          AND u.user_role IN ('customer', 'client')
          AND u.id != ?
        GROUP BY u.id, u.first_name, u.last_name, u.email, u.user_role
        ORDER BY MAX(b.submitted_at) DESC`,
        [userId, userId]
      );

      contacts = clients;
    }

    res.json({
      success: true,
      userRole: userRole,
      count: contacts.length,
      contacts: contacts
    });

  } catch (error) {
    console.error('Get suggested contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggested contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversation,
  markAsRead,
  markConversationAsRead,
  deleteMessage,
  getUserConversations,
  getUnreadCount,
  getSuggestedContacts
};