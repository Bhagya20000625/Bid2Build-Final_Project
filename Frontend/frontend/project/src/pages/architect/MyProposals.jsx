import React, { useState, useEffect } from 'react';
import {
  Upload,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  User,
  FileText,
  X,
  Image as ImageIcon
} from 'lucide-react';
import bidService from '../../services/bidService.js';
import designService from '../../services/designService.js';

const MyProposals = () => {
  const [acceptedProjects, setAcceptedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Form state for design upload
  const [designForm, setDesignForm] = useState({
    title: '',
    paymentAmount: '',
    description: '',
    files: []
  });

  // File previews
  const [filePreviews, setFilePreviews] = useState([]);

  // Load architect's accepted projects on component mount
  useEffect(() => {
    loadAcceptedProjects();
  }, []);

  const loadAcceptedProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get architect ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const architectId = user.id;

      if (!architectId) {
        setError('Architect ID not found. Please log in again.');
        return;
      }

      // Get all accepted bids for this architect
      const result = await bidService.getBidderBids(architectId);

      if (result.success && result.bids) {
        console.log('📊 Architect - All bids received:', result.bids);

        // Filter only accepted bids where bidder_role is 'architect'
        const acceptedBids = result.bids
          .filter(bid => bid.status === 'accepted' && bid.bidder_role === 'architect')
          .map(bid => ({
            id: bid.project_id,
            bidId: bid.id,
            title: bid.item_title || bid.project_title || 'Untitled Project',
            client: `${bid.customer_first_name || ''} ${bid.customer_last_name || ''}`.trim() || 'Unknown Client',
            clientId: bid.customer_id,
            clientEmail: bid.customer_email || 'No email',
            bidAmount: parseFloat(bid.bid_amount || 0),
            timeline: bid.proposed_timeline || 'Not specified',
            status: 'Accepted',
            startDate: bid.accepted_at || bid.submitted_at,
            description: bid.description || 'No description available'
          }));

        console.log('✅ Architect - Formatted accepted projects:', acceptedBids);
        setAcceptedProjects(acceptedBids);
      } else {
        setAcceptedProjects([]);
      }
    } catch (error) {
      console.error('Error loading accepted projects:', error);
      setError('Failed to load accepted projects');
      setAcceptedProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenUploadModal = (project) => {
    setSelectedProject(project);
    setDesignForm({
      title: '',
      paymentAmount: '',
      description: '',
      files: []
    });
    setFilePreviews([]);
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setDesignForm(prev => ({
      ...prev,
      files: [...prev.files, ...selectedFiles]
    }));

    // Create previews for images
    const newPreviews = selectedFiles.map(file => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + ' KB',
      type: file.type,
      isImage: file.type.startsWith('image/')
    }));

    setFilePreviews(prev => [...prev, ...newPreviews]);
  };

  const handleRemoveFile = (index) => {
    setDesignForm(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDesignSubmit = async (e) => {
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

      // Validate form
      if (!designForm.title || !designForm.paymentAmount || designForm.files.length === 0) {
        setError('Please fill in all required fields and upload at least one file');
        return;
      }

      console.log('📤 Submitting design:', {
        projectId: selectedProject.id,
        bidId: selectedProject.bidId,
        architectId: userId,
        clientId: selectedProject.clientId,
        title: designForm.title,
        paymentAmount: designForm.paymentAmount,
        fileCount: designForm.files.length
      });

      // Submit design with files
      const result = await designService.submitDesign(
        selectedProject.id,
        selectedProject.bidId,
        userId,
        selectedProject.clientId,
        designForm.title,
        designForm.description,
        designForm.paymentAmount,
        designForm.files
      );

      if (result.success) {
        alert('Design submitted successfully! The client will be notified.');
        setShowUploadModal(false);
        loadAcceptedProjects();
      }
    } catch (error) {
      console.error('Design submission error:', error);
      setError(error.message || 'Failed to submit design');
    } finally {
      setLoading(false);
    }
  };

  if (loading && acceptedProjects.length === 0) {
    return (
      <div className="flex-1 bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-600">Loading your proposals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Proposals</h1>
        <p className="text-gray-600">Track your accepted architectural projects and submit designs</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Projects Grid */}
      {acceptedProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Accepted Proposals</h3>
          <p className="text-gray-500">
            When clients accept your proposals, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {acceptedProjects.map((project) => (
            <div
              key={project.bidId}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <User className="h-4 w-4 mr-1" />
                      <span>{project.client}</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                    Accepted
                  </span>
                </div>

                {/* Project Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      Project Value:
                    </span>
                    <span className="font-bold text-gray-900">${project.bidAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Timeline:
                    </span>
                    <span className="font-medium text-gray-900">{project.timeline}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Accepted On:
                    </span>
                    <span className="text-gray-900">
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

                {/* Action Button */}
                <button
                  onClick={() => handleOpenUploadModal(project)}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Upload className="h-5 w-5" />
                  <span className="font-medium">Upload Design</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Design Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upload Design</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleDesignSubmit} className="p-6">
              {/* Project Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedProject?.title}</h3>
                <p className="text-sm text-gray-600">Client: {selectedProject?.client}</p>
              </div>

              {/* Design Title */}
              <div className="mb-4">
                <label htmlFor="design-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Design Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="design-title"
                  value={designForm.title}
                  onChange={(e) => setDesignForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Architectural Floor Plans & Elevations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Payment Amount */}
              <div className="mb-4">
                <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="payment-amount"
                  min="0"
                  step="0.01"
                  value={designForm.paymentAmount}
                  onChange={(e) => setDesignForm(prev => ({ ...prev, paymentAmount: e.target.value }))}
                  placeholder="Enter payment amount (e.g., 5000)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Amount you expect to be paid for this design work
                </p>
              </div>

              {/* Description */}
              <div className="mb-4">
                <label htmlFor="design-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Design Notes
                </label>
                <textarea
                  id="design-description"
                  rows={4}
                  value={designForm.description}
                  onChange={(e) => setDesignForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add notes about your design submission, materials used, considerations, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Design Files <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload PDFs, CAD files (DWG, DXF, SKP, RVT), or images
                  </p>
                  <input
                    type="file"
                    id="design-files"
                    multiple
                    accept=".pdf,.dwg,.dxf,.skp,.rvt,.ifc,.3dm,.blend,.max,.jpeg,.jpg,.png,.gif,.bmp,.tiff,.svg"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="design-files"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                  >
                    Choose Files
                  </label>
                </div>

                {/* File Previews */}
                {filePreviews.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                    {filePreviews.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center space-x-3">
                          {file.isImage ? (
                            <ImageIcon className="h-5 w-5 text-blue-500" />
                          ) : (
                            <FileText className="h-5 w-5 text-gray-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProposals;
