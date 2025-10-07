import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = (userId, onReceiveMessage, onMessageRead, onTyping) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userId) return;

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      // Register user as online
      socket.emit('user-online', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Message event handlers
    if (onReceiveMessage) {
      socket.on('receive-message', (message) => {
        console.log('📨 Received message:', message);
        onReceiveMessage(message);
      });
    }

    if (onMessageRead) {
      socket.on('message-read', (data) => {
        console.log('✓✓ Message read:', data);
        onMessageRead(data);
      });

      socket.on('conversation-read', (data) => {
        console.log('✓✓ Conversation read:', data);
        onMessageRead(data);
      });
    }

    if (onTyping) {
      socket.on('user-typing', (data) => {
        console.log('⌨️ User typing:', data);
        onTyping(data);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId, onReceiveMessage, onMessageRead, onTyping]);

  // Send message via socket
  const sendMessage = (recipientId, message) => {
    if (socketRef.current) {
      socketRef.current.emit('send-message', { recipientId, message });
    }
  };

  // Send typing indicator
  const sendTypingIndicator = (recipientId, isTyping, senderName) => {
    if (socketRef.current) {
      socketRef.current.emit('typing', { recipientId, isTyping, senderName });
    }
  };

  // Mark message as read
  const markAsRead = (senderId, messageId) => {
    if (socketRef.current) {
      socketRef.current.emit('mark-read', { senderId, messageId });
    }
  };

  return {
    socket: socketRef.current,
    sendMessage,
    sendTypingIndicator,
    markAsRead
  };
};
