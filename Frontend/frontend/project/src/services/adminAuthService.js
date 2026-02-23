import api from './api.js';

const adminAuthService = {
  // Admin login
  login: async (username, password) => {
    try {
      const response = await api.post('/admin/auth/login', {
        username,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin logout
  logout: async () => {
    try {
      const response = await api.post('/admin/auth/logout');
      // Clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      return response.data;
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      throw error.response?.data || error;
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await api.get('/admin/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update admin profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/admin/auth/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change admin password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/admin/auth/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    return !!(token && adminUser);
  },

  // Get admin token
  getToken: () => {
    return localStorage.getItem('adminToken');
  },

  // Get admin user data
  getAdminUser: () => {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  }
};

export default adminAuthService;