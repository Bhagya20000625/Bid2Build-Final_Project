import api from './api';

/**
 * Payment Service
 * Handles all payment related API calls
 */

// Get client payments with milestone details
const getClientPayments = async (clientId) => {
  try {
    const response = await api.get(`/payments/client/${clientId}`);
    return response.data;
  } catch (error) {
    console.error('Get client payments error:', error);
    throw error.response?.data || error;
  }
};

// Update payment status (release payment)
const updatePaymentStatus = async (paymentId, status, transactionReference) => {
  try {
    const response = await api.put(`/payments/${paymentId}/status`, {
      payment_status: status,
      transaction_reference: transactionReference
    });
    return response.data;
  } catch (error) {
    console.error('Update payment status error:', error);
    throw error.response?.data || error;
  }
};

// Get single payment details
const getPayment = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}`);
    return response.data;
  } catch (error) {
    console.error('Get payment error:', error);
    throw error.response?.data || error;
  }
};

// Get payments for a specific project
const getProjectPayments = async (projectId) => {
  try {
    const response = await api.get(`/payments/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Get project payments error:', error);
    throw error.response?.data || error;
  }
};

const paymentService = {
  getClientPayments,
  updatePaymentStatus,
  getPayment,
  getProjectPayments
};

export default paymentService;
