import api from './api.js';

const notificationService = {
  // Get notifications for a user
  getUserNotifications: async (userId, options = {}) => {
    try {
      const { unread_only = false, limit = 50 } = options;

      const params = new URLSearchParams();
      if (unread_only) params.append('unread_only', 'true');
      if (limit) params.append('limit', limit.toString());

      const queryString = params.toString();
      const url = `/notifications/user/${userId}${queryString ? `?${queryString}` : ''}`;

      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get only unread notifications
  getUnreadNotifications: async (userId) => {
    try {
      return await notificationService.getUserNotifications(userId, { unread_only: true });
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark all notifications as read for a user
  markAllNotificationsRead: async (userId) => {
    try {
      const response = await api.put(`/notifications/user/${userId}/read-all`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create a new notification (mainly for testing)
  createNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications', notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Helper function to get notification icon based on type
  getNotificationIcon: (type) => {
    switch (type) {
      case 'bid_accepted':
        return '🎉';
      case 'bid_rejected':
        return '❌';
      case 'new_bid':
        return '💼';
      case 'payment_due':
        return '💳';
      case 'new_message':
        return '💬';
      case 'milestone_update':
        return '🚧';
      default:
        return '🔔';
    }
  },

  // Helper function to get notification color based on priority
  getNotificationPriority: (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  },

  // Helper function to format notification time
  formatNotificationTime: (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}d ago`;
    }
  }
};

export default notificationService;