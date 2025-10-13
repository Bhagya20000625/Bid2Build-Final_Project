import api from './api';

/**
 * Progress Update Service
 * Handles all progress update related API calls
 */

// Submit progress update with photos
const submitProgressUpdate = async (projectId, bidId, userId, description, photos, milestone, progressPercentage) => {
  try {
    console.log('🖼️ Photos to upload:', photos);
    console.log('🖼️ Number of photos:', photos?.length || 0);
    console.log('📊 Milestone:', milestone);
    console.log('📊 Progress percentage:', progressPercentage);

    const formData = new FormData();
    formData.append('project_id', projectId);
    formData.append('bid_id', bidId);
    formData.append('submitted_by', userId);
    formData.append('description', description);
    formData.append('milestone_name', milestone || 'Progress Update');
    formData.append('progress_percentage', progressPercentage || 0);

    // Append photos
    if (photos && photos.length > 0) {
      photos.forEach((photo, index) => {
        console.log(`📎 Appending photo ${index + 1}:`, photo.name, photo.size, photo.type);
        formData.append('photos', photo);
      });
    } else {
      console.warn('⚠️ No photos to upload');
    }

    console.log('📤 Sending FormData to /progress');

    const response = await api.post('/progress', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Submit progress update error:', error);
    throw error.response?.data || error;
  }
};

// Get all progress updates for a project
const getProjectProgress = async (projectId) => {
  try {
    const response = await api.get(`/progress/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Get project progress error:', error);
    throw error.response?.data || error;
  }
};

// Get single progress update with photos
const getProgressUpdate = async (progressUpdateId) => {
  try {
    const response = await api.get(`/progress/${progressUpdateId}`);
    return response.data;
  } catch (error) {
    console.error('Get progress update error:', error);
    throw error.response?.data || error;
  }
};

// Review progress update (approve/reject)
const reviewProgressUpdate = async (progressUpdateId, userId, status, comments) => {
  try {
    const response = await api.put(`/progress/${progressUpdateId}/review`, {
      reviewed_by: userId,
      status: status, // 'approved' or 'rejected'
      review_comments: comments,
    });
    return response.data;
  } catch (error) {
    console.error('Review progress update error:', error);
    throw error.response?.data || error;
  }
};

// Upload additional photos to existing progress update
const uploadProgressPhotos = async (progressUpdateId, photos) => {
  try {
    const formData = new FormData();

    photos.forEach((photo) => {
      formData.append('photos', photo);
    });

    const response = await api.post(`/progress/${progressUpdateId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload progress photos error:', error);
    throw error.response?.data || error;
  }
};

const progressService = {
  submitProgressUpdate,
  getProjectProgress,
  getProgressUpdate,
  reviewProgressUpdate,
  uploadProgressPhotos,
};

export default progressService;
