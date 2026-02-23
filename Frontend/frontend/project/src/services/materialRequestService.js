import api from './api.js';

const materialRequestService = {
  // Create a new material request
  createMaterialRequest: async (materialRequestData, files = null) => {
    try {
      // If files are provided, use FormData
      if (files && files.length > 0) {
        const formData = new FormData();
        
        // Add material request data
        Object.keys(materialRequestData).forEach(key => {
          formData.append(key, materialRequestData[key]);
        });
        
        // Add files
        files.forEach(file => {
          formData.append('documents', file);
        });
        
        const response = await api.post('/material-requests', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        return response.data;
      } else {
        // No files, send as JSON
        const response = await api.post('/material-requests', materialRequestData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all material requests (for testing/admin)
  getAllMaterialRequests: async () => {
    try {
      const response = await api.get('/material-requests');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get material requests for suppliers
  getMaterialRequestsForSuppliers: async () => {
    try {
      const response = await api.get('/material-requests/supplier');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get material requests by customer
  getCustomerMaterialRequests: async (customerId) => {
    try {
      const response = await api.get(`/material-requests/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get material request by ID
  getMaterialRequestById: async (materialRequestId) => {
    try {
      const response = await api.get(`/material-requests/${materialRequestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update material request
  updateMaterialRequest: async (materialRequestId, updates, files = null) => {
    try {
      const formData = new FormData();
      
      // Add updates
      Object.keys(updates).forEach(key => {
        formData.append(key, updates[key]);
      });
      
      // Add files if provided
      if (files && files.length > 0) {
        files.forEach(file => {
          formData.append('documents', file);
        });
      }
      
      const response = await api.put(`/material-requests/${materialRequestId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete material request
  deleteMaterialRequest: async (materialRequestId) => {
    try {
      const response = await api.delete(`/material-requests/${materialRequestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default materialRequestService;