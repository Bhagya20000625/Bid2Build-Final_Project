import api from './api.js';

const bidService = {
  // Create a new bid
  createBid: async (bidData) => {
    try {
      const response = await api.post('/bids', bidData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all bids (for testing/admin)
  getAllBids: async () => {
    try {
      const response = await api.get('/bids');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get bids for a specific project
  getBidsByProject: async (projectId) => {
    try {
      const response = await api.get(`/bids/project/${projectId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get bids for a specific material request
  getBidsByMaterialRequest: async (materialRequestId) => {
    try {
      const response = await api.get(`/bids/material-request/${materialRequestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all bids received by customer
  getCustomerBids: async (customerId) => {
    try {
      const response = await api.get(`/bids/customer/${customerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get all bids submitted by bidder
  getBidderBids: async (bidderId) => {
    try {
      const response = await api.get(`/bids/bidder/${bidderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get bid by ID
  getBidById: async (bidId) => {
    try {
      const response = await api.get(`/bids/${bidId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update bid status (accept/reject)
  updateBidStatus: async (bidId, status) => {
    try {
      const response = await api.put(`/bids/${bidId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete/withdraw bid
  deleteBid: async (bidId) => {
    try {
      const response = await api.delete(`/bids/${bidId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default bidService;