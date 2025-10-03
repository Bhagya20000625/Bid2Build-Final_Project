import React, { useState, useEffect } from 'react';
import { Star, Clock, DollarSign, CheckCircle, X, Eye } from 'lucide-react';
import projectService from '../../services/projectService.js';
import bidService from '../../services/bidService.js';


const ViewBids = () => {
  const [projects, setProjects] = useState([]);
  const [allBids, setAllBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showBidDetailsModal, setShowBidDetailsModal] = useState(false);
  const [selectedBidDetails, setSelectedBidDetails] = useState(null);

  // Load customer bids on component mount
  useEffect(() => {
    loadAllBids();
  }, []);

  const loadAllBids = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get customer ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('👤 User from localStorage:', user);
      console.log('🔑 Available keys:', Object.keys(user));

      // Try to get customer_id from different possible locations
      let customerId = user.customer_id || user.id;

      // If user is a customer role but missing customer_id, try to fetch it
      if (!user.customer_id && user.role === 'Customer' && user.id) {
        console.log('⚠️ Missing customer_id for Customer role user, trying to fetch from API...');
        try {
          // Fetch user profile to get customer_id
          const userService = await import('../../services/userService.js');
          const result = await userService.default.getUserProfile(user.id);
          if (result.success && result.user.id) {
            customerId = result.user.id; // The customer record ID
            console.log('✅ Fetched customer_id from API:', customerId);
            // Update localStorage with complete data
            localStorage.setItem('user', JSON.stringify({...user, customer_id: customerId}));
          }
        } catch (error) {
          console.error('Failed to fetch customer_id:', error);
        }
      }

      if (!customerId) {
        console.error('❌ No customer_id found. User object:', user);
        setError('Customer ID not found. Please log out and log back in.');
        return;
      }

      // Load all bids for this customer
      const result = await bidService.getCustomerBids(customerId);

      console.log('🔍 Customer ID used:', customerId);
      console.log('📊 API Response:', result);

      if (result.success && result.bids) {
        console.log('📝 Total bids received:', result.bids.length);
        console.log('📋 All bids:', result.bids);

        setAllBids(result.bids);

        // Group bids by project and create project objects
        const projectsMap = new Map();
        result.bids.forEach(bid => {
          console.log('🔄 Processing bid:', bid.id, 'Type:', bid.bid_type, 'Project ID:', bid.project_id);
          if (bid.bid_type === 'project' && bid.item_title) {
            if (!projectsMap.has(bid.project_id)) {
              projectsMap.set(bid.project_id, {
                id: bid.project_id,
                title: bid.item_title,
                bids: []
              });
            }
            projectsMap.get(bid.project_id).bids.push(bid);
          }
        });

        console.log('🗂️ Projects map:', projectsMap);
        const projectsArray = Array.from(projectsMap.values());
        console.log('📁 Final projects array:', projectsArray);

        setProjects(projectsArray);
      } else {
        console.log('❌ No bids or API error:', result);
        setAllBids([]);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading bids:', error);
      setError('Failed to load bids');
      setAllBids([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBidAction = async (bidId, action) => {
    try {
      setActionLoading(bidId);
      setError(null);

      const status = action === 'accept' ? 'accepted' : 'rejected';
      const result = await bidService.updateBidStatus(bidId, status);

      if (result.success) {
        alert(`Bid ${action}ed successfully!`);
        // Reload all bids to show updated status
        await loadAllBids();
      }
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      setError(`Failed to ${action} bid. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewBidDetails = (bid) => {
    setSelectedBidDetails(bid);
    setShowBidDetailsModal(true);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">View Bids</h1>
        <p className="text-gray-600">Review and manage bids for your projects</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Projects and their bids */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">Loading bids...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">No bids received yet. Create projects to start receiving bids from architects and constructors.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Project Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                    {project.bids.length} bids received
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                    {project.bids.filter(bid => bid.bidder_role === 'architect').length} from architects
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    {project.bids.filter(bid => bid.bidder_role === 'constructor').length} from constructors
                  </span>
                </div>
              </div>

              {/* Bids List */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  All Received Bids
                </h3>

                {project.bids.length === 0 ? (
                  <p className="text-gray-500 py-4">No bids received yet for this project.</p>
                ) : (
                  project.bids.map((bid) => (
                    <div
                      key={bid.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900">
                              {bid.first_name} {bid.last_name}
                            </h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              bid.bidder_role === 'architect'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {bid.bidder_role}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              bid.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : bid.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {bid.status}
                            </span>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-semibold">${parseFloat(bid.bid_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4 text-blue-600" />
                              <span>{bid.proposed_timeline}</span>
                            </div>
                            <span className="text-gray-500">{bid.email}</span>
                          </div>

                          <p className="text-gray-700 text-sm mb-3">{bid.description}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {bid.status === 'pending' && (
                        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleViewBidDetails(bid)}
                            className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4 inline mr-1" />
                            View Details
                          </button>
                          <button
                            onClick={() => handleBidAction(bid.id, 'reject')}
                            disabled={actionLoading === bid.id}
                            className="px-4 py-2 border border-red-300 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <X className="w-4 h-4 inline mr-1" />
                            {actionLoading === bid.id ? 'Rejecting...' : 'Reject'}
                          </button>
                          <button
                            onClick={() => handleBidAction(bid.id, 'accept')}
                            disabled={actionLoading === bid.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-1" />
                            {actionLoading === bid.id ? 'Accepting...' : 'Accept'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bid Details Modal */}
      {showBidDetailsModal && selectedBidDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">Bid Details</h2>
                <button
                  onClick={() => setShowBidDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bidder Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-600">{selectedBidDetails.first_name} {selectedBidDetails.last_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{selectedBidDetails.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Role:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                        selectedBidDetails.bidder_role === 'constructor'
                          ? 'bg-blue-100 text-blue-800'
                          : selectedBidDetails.bidder_role === 'architect'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {selectedBidDetails.bidder_role}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                        selectedBidDetails.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : selectedBidDetails.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedBidDetails.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Bid Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Bid Amount:</span>
                      <p className="text-gray-600 text-xl font-semibold">${parseFloat(selectedBidDetails.bid_amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Proposed Timeline:</span>
                      <p className="text-gray-600">{selectedBidDetails.proposed_timeline}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted Date:</span>
                      <p className="text-gray-600">{new Date(selectedBidDetails.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Proposal Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">{selectedBidDetails.description}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between p-6 border-t border-gray-200">
              <button
                onClick={() => setShowBidDetailsModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    handleBidAction(selectedBidDetails.id, 'reject');
                    setShowBidDetailsModal(false);
                  }}
                  disabled={actionLoading === selectedBidDetails.id}
                  className="px-8 py-3 border-2 border-red-400 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5 inline mr-2" />
                  {actionLoading === selectedBidDetails.id ? 'Rejecting...' : 'REJECT'}
                </button>
                <button
                  onClick={() => {
                    handleBidAction(selectedBidDetails.id, 'accept');
                    setShowBidDetailsModal(false);
                  }}
                  disabled={actionLoading === selectedBidDetails.id}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium border-2 border-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  {actionLoading === selectedBidDetails.id ? 'Accepting...' : 'ACCEPT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBids;