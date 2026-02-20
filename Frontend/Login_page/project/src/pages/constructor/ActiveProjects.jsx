import React, { useState, useEffect } from 'react';
import {
  Camera,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Image as ImageIcon,
  DollarSign,
  MapPin,
  User,
  Eye
} from 'lucide-react';
import bidService from '../../services/bidService.js';
import progressService from '../../services/progressService.js';


const ActiveProjects = () => {
  const [activeProjects, setActiveProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedProjectForUpdate, setSelectedProjectForUpdate] = useState(null);


  // Form state for progress update
  const [progressForm, setProgressForm] = useState({
    milestone: '',
    progress: '',
    paymentAmount: '',
    description: '',
    photos: []
  });

  // Load constructor's active projects on component mount
  useEffect(() => {
    loadActiveProjects();
  }, []);

  const loadActiveProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get constructor ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const constructorId = user.id;

      if (!constructorId) {
        setError('Constructor ID not found. Please log in again.');
        return;
      }

      // Get all accepted bids for this constructor
      const result = await bidService.getBidderBids(constructorId);

      if (result.success && result.bids) {
        console.log('📊 Constructor - All bids received:', result.bids);

        // Filter only accepted bids and format for display
        const acceptedBids = result.bids
          .filter(bid => bid.status === 'accepted')
          .map(bid => {
            console.log(`📊 Bid for project "${bid.project_title}": overall_progress=${bid.overall_progress}`);
            return {
              id: bid.project_id,
              bidId: bid.id,
              title: bid.item_title || bid.project_title || 'Untitled Project',
              customer: `${bid.customer_first_name || ''} ${bid.customer_last_name || ''}`.trim() || 'Unknown Customer',
              customerEmail: bid.customer_email || 'No email',
              bidAmount: parseFloat(bid.bid_amount || 0),
              timeline: bid.proposed_timeline || 'Not specified',
              status: 'In Progress', // Default status for accepted projects
              progress: parseFloat(bid.overall_progress || 0), // Get from project's overall_progress field
              startDate: bid.accepted_at || bid.submitted_at,
              description: bid.description || 'No description available'
            };
          });

        console.log('✅ Constructor - Formatted active projects:', acceptedBids);
        setActiveProjects(acceptedBids);
      } else {
        setActiveProjects([]);
      }
    } catch (error) {
      console.error('Error loading active projects:', error);
      setError('Failed to load active projects');
      setActiveProjects([]);
    } finally {
      setLoading(false);
    }
  };

  
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Behind Schedule':
        return 'bg-red-100 text-red-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'Behind Schedule':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleOpenProgressModal = (project) => {
    setSelectedProjectForUpdate(project);
    setProgressForm({
      milestone: '',
      progress: '',
      paymentAmount: '',
      description: '',
      photos: []
    });
    setShowProgressModal(true);
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(null);

      // Get user from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      if (!userId) {
        setError('User not found. Please log in again.');
        return;
      }

      // Submit progress update with photos and payment amount
      const result = await progressService.submitProgressUpdate(
        selectedProjectForUpdate.id,      // project_id
        selectedProjectForUpdate.bidId,   // bid_id
        userId,                            // submitted_by
        progressForm.description,          // description
        progressForm.photos,               // photos array
        progressForm.milestone,            // milestone name
        progressForm.progress,             // progress percentage
        progressForm.paymentAmount         // payment amount
      );

      if (result.success) {
        alert('Progress update submitted successfully!');

        // Close modal and reset form
        setShowProgressModal(false);
        setSelectedProjectForUpdate(null);
        setProgressForm({
          milestone: '',
          progress: '',
          paymentAmount: '',
          description: '',
          photos: []
        });

        // Reload projects to show updated data
        await loadActiveProjects();
      }
    } catch (error) {
      console.error('Submit progress error:', error);
      setError(error.message || 'Failed to submit progress update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setProgressForm(prev => ({
      ...prev,
      photos: files
    }));
  };

  if (loading && activeProjects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading active projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Projects</h1>
          <p className="text-gray-600">Manage projects where your bids were accepted</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-2 sm:mt-0">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {activeProjects.length} Active Project{activeProjects.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {activeProjects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Projects</h3>
          <p className="text-gray-600 mb-4">
            You don't have any active projects yet. Submit bids on projects to get started!
          </p>
          <a
            href="/constructor-dashboard/browse-projects"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Projects
          </a>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {activeProjects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{project.customer}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">${project.bidAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{project.timeline}</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
              </div>

              {/* Project Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                <div>
                  <span className="font-medium">Started:</span>
                  <p>{new Date(project.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="font-medium">Customer:</span>
                  <p>{project.customerEmail}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleOpenProgressModal(project)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Update Progress
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement view project details
                    console.log('View project details:', project.id);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Update Modal */}
      {showProgressModal && selectedProjectForUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Update Progress - {selectedProjectForUpdate.title}
                </h2>
                <button
                  onClick={() => setShowProgressModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <form onSubmit={handleProgressSubmit} className="p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="milestone" className="block text-sm font-medium text-gray-700 mb-2">
                    Milestone/Phase
                  </label>
                  <input
                    type="text"
                    id="milestone"
                    value={progressForm.milestone}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, milestone: e.target.value }))}
                    placeholder="e.g., Foundation Complete, Framing Started"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="progress-percent" className="block text-sm font-medium text-gray-700 mb-2">
                    Progress Increment (%)
                  </label>
                  <input
                    type="number"
                    id="progress-percent"
                    min="0"
                    max="100"
                    value={progressForm.progress}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, progress: e.target.value }))}
                    placeholder="0-100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount for this Milestone ($)
                </label>
                <input
                  type="number"
                  id="payment-amount"
                  min="0"
                  step="0.01"
                  value={progressForm.paymentAmount}
                  onChange={(e) => setProgressForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                  placeholder="Enter payment amount (e.g., 5000)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Specify the amount you expect to be paid for completing this milestone
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  value={progressForm.description}
                  onChange={(e) => setProgressForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what work was completed, any challenges encountered, and next steps..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Photos
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload progress photos</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photos
                  </label>
                  {progressForm.photos.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {progressForm.photos.length} photo(s) selected
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowProgressModal(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Submit Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveProjects;