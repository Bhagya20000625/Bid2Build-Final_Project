import api from './api.js';

const adminVerificationService = {
  // Get all pending user verifications
  getPendingVerifications: async () => {
    try {
      const response = await api.get('/admin/verifications/pending');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get verification statistics
  getVerificationStats: async () => {
    try {
      const response = await api.get('/admin/verifications/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user's verification documents
  getUserDocuments: async (userId) => {
    try {
      const response = await api.get(`/admin/verifications/user/${userId}/documents`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Approve user verification
  approveVerification: async (userId, notes = '') => {
    try {
      const response = await api.post(`/admin/verifications/user/${userId}/approve`, {
        notes
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reject user verification
  rejectVerification: async (userId, reason) => {
    try {
      const response = await api.post(`/admin/verifications/user/${userId}/reject`, {
        reason
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Preview document
  getDocumentUrl: (filePath) => {
    // Handle both full paths and just filenames
    const filename = filePath.includes('\\') || filePath.includes('/') 
      ? filePath.split(/[\\\/]/).pop() 
      : filePath;
    return `http://localhost:5000/uploads/${filename}`;
  }
};

export default adminVerificationService;