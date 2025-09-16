import api from './api.js';

const messageService = {
  // Send a new message
  sendMessage: async (messageData) => {
    try {
      const response = await api.post('/messages', messageData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all messages for a user
  getUserMessages: async (userId) => {
    try {
      const response = await api.get(`/messages/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get conversation between two users
  getConversation: async (userId1, userId2) => {
    try {
      const response = await api.get(`/messages/conversation/${userId1}/${userId2}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark message as read
  markMessageAsRead: async (messageId) => {
    try {
      const response = await api.put(`/messages/${messageId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread message count
  getUnreadCount: async (userId) => {
    try {
      const response = await api.get(`/messages/unread-count/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all conversations for a user
  getUserConversations: async (userId) => {
    try {
      const response = await api.get(`/messages/conversations/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete a message
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`/messages/${messageId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default messageService;