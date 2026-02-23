import api from './api.js';

const adminDashboardService = {
  // Get dashboard overview statistics
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user management data with filters
  getUserManagement: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filter parameters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const queryString = params.toString();
      const url = `/admin/users${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get pending verifications
  getPendingVerifications: async () => {
    try {
      const response = await api.get('/admin/verifications/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Suspend user account
  suspendUser: async (userId, reason) => {
    try {
      const response = await api.put(`/admin/users/${userId}/suspend`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reactivate user account
  reactivateUser: async (userId) => {
    try {
      const response = await api.put(`/admin/users/${userId}/reactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve user verification
  approveVerification: async (userId, comment = '') => {
    try {
      const response = await api.put(`/admin/users/${userId}/approve`, { comment });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject user verification
  rejectVerification: async (userId, reason) => {
    try {
      const response = await api.put(`/admin/users/${userId}/reject`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user details with documents
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve document
  approveDocument: async (documentId, notes = '') => {
    try {
      const response = await api.put(`/admin/documents/${documentId}/approve`, { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject document
  rejectDocument: async (documentId, notes) => {
    try {
      const response = await api.put(`/admin/documents/${documentId}/reject`, { notes });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get admin notifications
  getAdminNotifications: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          params.append(key, value);
        }
      });

      const queryString = params.toString();
      const url = `/admin/notifications${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark admin notification as read
  markNotificationRead: async (notificationId) => {
    try {
      const response = await api.put(`/admin/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default adminDashboardService;