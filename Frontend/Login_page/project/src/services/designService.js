import api from './api';

// Submit design with files
const submitDesign = async (projectId, bidId, architectId, clientId, title, description, paymentAmount, files) => {
  try {
    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('bid_id', bidId);
    formData.append('architect_id', architectId);
    formData.append('client_id', clientId);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('payment_amount', paymentAmount);

    // Append all design files
    files.forEach(file => {
      formData.append('designFiles', file);
    });

    const response = await api.post('/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Submit design error:', error);
    throw error.response?.data || error;
  }
};

// Get architect's design submissions
const getArchitectSubmissions = async (architectId) => {
  try {
    const response = await api.get(`/designs/architect/${architectId}`);
    return response.data;
  } catch (error) {
    console.error('Get architect submissions error:', error);
    throw error.response?.data || error;
  }
};

// Get design submission for a specific project
const getProjectDesignSubmission = async (projectId) => {
  try {
    const response = await api.get(`/designs/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Get project design submission error:', error);
    throw error.response?.data || error;
  }
};

// Review design submission (approve or reject)
const reviewDesignSubmission = async (submissionId, reviewedBy, status, reviewComments) => {
  try {
    const response = await api.put(`/designs/${submissionId}/review`, {
      reviewed_by: reviewedBy,
      status: status,
      review_comments: reviewComments
    });
    return response.data;
  } catch (error) {
    console.error('Review design submission error:', error);
    throw error.response?.data || error;
  }
};

// Get design files for a submission
const getDesignFiles = async (submissionId) => {
  try {
    const response = await api.get(`/designs/${submissionId}/files`);
    return response.data;
  } catch (error) {
    console.error('Get design files error:', error);
    throw error.response?.data || error;
  }
};

const designService = {
  submitDesign,
  getArchitectSubmissions,
  getProjectDesignSubmission,
  reviewDesignSubmission,
  getDesignFiles
};

export default designService;
