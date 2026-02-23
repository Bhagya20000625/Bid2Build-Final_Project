import api from './api.js';

const adminUserService = {
  // Get users with filtering and pagination
  getUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      // Add filters if provided
      if (filters.search) params.append('search', filters.search);
      if (filters.role) params.append('role', filters.role);
      if (filters.verification_status) params.append('verification_status', filters.verification_status);
      if (filters.account_status) params.append('account_status', filters.account_status);
      if (filters.page) params.append('page', filters.page);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.sort_by) params.append('sort_by', filters.sort_by);
      if (filters.sort_order) params.append('sort_order', filters.sort_order);

      const queryString = params.toString();
      const url = queryString ? `/admin/users?${queryString}` : '/admin/users';
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user verification status
  updateUserVerification: async (userId, status, reason = '') => {
    try {
      const response = await api.put(`/admin/users/${userId}/verification`, {
        status,
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user account status
  updateUserAccount: async (userId, status, reason = '') => {
    try {
      const response = await api.put(`/admin/users/${userId}/account`, {
        status,
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Suspend user
  suspendUser: async (userId, reason) => {
    try {
      const response = await api.post(`/admin/users/${userId}/suspend`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reactivate user
  reactivateUser: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/reactivate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export users data
  exportUsers: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters);
      const queryString = params.toString();
      const url = queryString ? `/admin/users/export?${queryString}` : '/admin/users/export';
      
      const response = await api.get(url, { responseType: 'blob' });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default adminUserService;