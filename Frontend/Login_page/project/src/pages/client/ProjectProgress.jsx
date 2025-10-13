import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, X, Image as ImageIcon, Eye, DollarSign, MapPin, User, Download } from 'lucide-react';
import projectService from '../../services/projectService';
import progressService from '../../services/progressService';

const ProjectProgress = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [progressUpdates, setProgressUpdates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: '',
    comments: ''
  });
  const [viewingPhotos, setViewingPhotos] = useState(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Load customer's projects
  useEffect(() => {
    loadProjects();
  }, []);

  // Load progress when project selected
  useEffect(() => {
    if (selectedProject) {
      loadProgressUpdates(selectedProject);
    }
  }, [selectedProject]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('🔍 DEBUG - User from localStorage:', user);
      console.log('🔍 DEBUG - User ID:', user.id);

      const userId = user.id;

      if (!userId) {
        console.error('❌ No user ID found! User object:', user);
        setError('User not found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('📤 Fetching projects for user ID:', userId);

      // Get customer projects
      const result = await projectService.getCustomerProjects(userId);

      console.log('📊 API Response:', result);

      if (result.success && result.projects) {
        console.log('📊 All projects received:', result.projects);
        console.log('📊 Number of projects:', result.projects.length);

        // Log each project's status and progress
        result.projects.forEach(p => {
          console.log(`Project "${p.title}": status="${p.status}", awarded_bid_id=${p.awarded_bid_id}, overall_progress=${p.overall_progress}`);
        });

        // Filter only projects with status 'in_progress' (awarded projects)
        const activeProjects = result.projects.filter(
          p => p.status === 'in_progress' && p.awarded_bid_id
        );

        console.log('✅ Filtered active projects:', activeProjects);
        console.log('✅ Number of active projects:', activeProjects.length);

        setProjects(activeProjects);

        // Auto-select first project
        if (activeProjects.length > 0 && !selectedProject) {
          setSelectedProject(activeProjects[0].id);
        }
      }
    } catch (error) {
      console.error('Load projects error:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadProgressUpdates = async (projectId) => {
    try {
      setLoading(true);
      const result = await progressService.getProjectProgress(projectId);

      if (result.success) {
        setProgressUpdates(result.progressUpdates || []);
      }
    } catch (error) {
      console.error('Load progress error:', error);
      setError('Failed to load progress updates');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (update) => {
    setSelectedUpdate(update);
    setReviewForm({ status: '', comments: '' });
    setShowReviewModal(true);
  };

  const handleReviewSubmit = async (status) => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      if (!userId) {
        setError('User not found. Please log in again.');
        return;
      }

      const result = await progressService.reviewProgressUpdate(
        selectedUpdate.id,
        userId,
        status,
        reviewForm.comments
      );

      if (result.success) {
        alert(`Progress update ${status} successfully!`);
        setShowReviewModal(false);
        setSelectedUpdate(null);

        // Reload both projects and progress updates to show updated overall_progress
        await loadProjects();
        await loadProgressUpdates(selectedProject);
      }
    } catch (error) {
      console.error('Review error:', error);
      setError(error.message || 'Failed to review progress update');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending_review':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'pending_review':
        return Clock;
      case 'rejected':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const handleViewPhotos = async (updateId) => {
    try {
      setLoading(true);
      const result = await progressService.getProgressUpdate(updateId);

      if (result.success && result.progressUpdate.photos) {
        setViewingPhotos(result.progressUpdate.photos);
        setSelectedPhotoIndex(0);
      }
    } catch (error) {
      console.error('Load photos error:', error);
      setError('Failed to load photos');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPhoto = (photo) => {
    const baseURL = 'http://localhost:5000'; // Backend URL
    const photoURL = `${baseURL}/${photo.file_path.replace(/\\/g, '/')}`;

    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = photoURL;
    link.download = photo.file_name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Progress</h1>
        <p className="text-gray-600">Track milestones and monitor project completion</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
          <p className="text-gray-600">You don't have any active projects with accepted bids yet.</p>
        </div>
      ) : (
        <>
          {/* Project Selector */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedProject(project.id)}
                  className={`p-4 rounded-lg border-2 transition-colors duration-200 text-left ${
                    selectedProject === project.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <h3 className="font-medium text-gray-900 mb-2">{project.title}</h3>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-gray-500">Budget</span>
                    <span className="font-medium text-blue-600">${project.budget_range}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{parseFloat(project.overall_progress || 0).toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${parseFloat(project.overall_progress || 0)}%` }}
                      />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress Updates List */}
          {selectedProjectData && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Progress Updates - {selectedProjectData.title}
              </h2>

              {progressUpdates.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No progress updates yet. Waiting for constructor to submit.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {progressUpdates.map((update, index) => {
                    const StatusIcon = getStatusIcon(update.status);

                    return (
                      <div key={update.id} className="relative">
                        {index < progressUpdates.length - 1 && (
                          <div className="absolute left-6 top-12 w-px h-full bg-gray-200"></div>
                        )}

                        <div className="flex space-x-4">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                            update.status === 'approved'
                              ? 'bg-green-100 text-green-600'
                              : update.status === 'pending_review'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            <StatusIcon className="w-6 h-6" />
                          </div>

                          <div className="flex-1 bg-gray-50 rounded-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {update.milestone_name || `Progress Update #${progressUpdates.length - index}`}
                                  </h3>
                                  {update.progress_percentage !== null && update.progress_percentage !== undefined && (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-2xl font-bold text-blue-600">
                                        {parseFloat(update.progress_percentage).toFixed(0)}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-2">{update.description}</p>

                                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(update.submitted_at).toLocaleDateString()}</span>
                                  </div>
                                  <span>By: {update.submitted_by_first_name} {update.submitted_by_last_name}</span>
                                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(update.status)}`}>
                                    {update.status.replace('_', ' ').toUpperCase()}
                                  </span>
                                </div>

                                {/* Photos */}
                                {update.photo_count > 0 && (
                                  <button
                                    onClick={() => handleViewPhotos(update.id)}
                                    className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 mb-3"
                                  >
                                    <ImageIcon className="w-4 h-4" />
                                    <span>View {update.photo_count} photo(s)</span>
                                    <Eye className="w-4 h-4" />
                                  </button>
                                )}

                                {/* Review Comments */}
                                {update.review_comments && (
                                  <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Your Review:</p>
                                    <p className="text-sm text-gray-600">{update.review_comments}</p>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {update.status === 'pending_review' && (
                              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                  onClick={() => handleReviewClick(update)}
                                  className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                                >
                                  <Eye className="w-4 h-4 inline mr-1" />
                                  Review
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Review Progress Update</h2>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Milestone:</h3>
                <p className="text-gray-700">{selectedUpdate.milestone_name || 'Progress Update'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Progress Increment:</h3>
                  <p className="text-2xl font-bold text-blue-600">{parseFloat(selectedUpdate.progress_percentage || 0).toFixed(0)}%</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Payment Amount:</h3>
                  <p className="text-2xl font-bold text-green-600">${parseFloat(selectedUpdate.payment_amount || 0).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description:</h3>
                <p className="text-gray-700">{selectedUpdate.description}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Submitted by:</h3>
                <p className="text-gray-700">
                  {selectedUpdate.submitted_by_first_name} {selectedUpdate.submitted_by_last_name}
                </p>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Date:</h3>
                <p className="text-gray-700">{new Date(selectedUpdate.submitted_at).toLocaleString()}</p>
              </div>

              <div>
                <label htmlFor="review-comments" className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (optional)
                </label>
                <textarea
                  id="review-comments"
                  rows={4}
                  value={reviewForm.comments}
                  onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                  placeholder="Add any comments or feedback..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-between p-6 border-t border-gray-200">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleReviewSubmit('rejected')}
                  disabled={loading}
                  className="px-6 py-2 border-2 border-red-400 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4 inline mr-1" />
                  {loading ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  onClick={() => handleReviewSubmit('approved')}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  {loading ? 'Approving...' : 'Approve & Release Payment'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Viewer Modal */}
      {viewingPhotos && viewingPhotos.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-6xl w-full h-full flex flex-col p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">
                Photo {selectedPhotoIndex + 1} of {viewingPhotos.length}
              </h2>
              <button
                onClick={() => setViewingPhotos(null)}
                className="text-white hover:text-gray-300 text-3xl"
              >
                ×
              </button>
            </div>

            {/* Photo Display */}
            <div className="flex-1 flex items-center justify-center mb-4">
              <img
                src={`http://localhost:5000/${viewingPhotos[selectedPhotoIndex].file_path.replace(/\\/g, '/')}`}
                alt={viewingPhotos[selectedPhotoIndex].file_name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPhotoIndex(prev => Math.max(0, prev - 1))}
                disabled={selectedPhotoIndex === 0}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              <button
                onClick={() => handleDownloadPhoto(viewingPhotos[selectedPhotoIndex])}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>

              <button
                onClick={() => setSelectedPhotoIndex(prev => Math.min(viewingPhotos.length - 1, prev + 1))}
                disabled={selectedPhotoIndex === viewingPhotos.length - 1}
                className="px-4 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>

            {/* Thumbnail Strip */}
            {viewingPhotos.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
                {viewingPhotos.map((photo, index) => (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      selectedPhotoIndex === index ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={`http://localhost:5000/${photo.file_path.replace(/\\/g, '/')}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectProgress;