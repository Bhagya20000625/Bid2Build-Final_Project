import React, { useState, useEffect } from 'react';
import { Star, Clock, DollarSign, CheckCircle, X, Eye } from 'lucide-react';
import projectService from '../../services/projectService.js';
import bidService from '../../services/bidService.js';

const ViewBids = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // Load customer projects on component mount
  useEffect(() => {
    loadCustomerProjects();
  }, []);

  // Load bids when project is selected
  useEffect(() => {
    if (selectedProject) {
      loadProjectBids(selectedProject);
    }
  }, [selectedProject]);

  const loadCustomerProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get customer ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const customerId = user.customerId || user.customer_id || 1; // fallback for testing

      const result = await projectService.getCustomerProjects(customerId);
      
      if (result.success && result.projects) {
        setProjects(result.projects);
        // Select first project by default if available
        if (result.projects.length > 0 && !selectedProject) {
          setSelectedProject(result.projects[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectBids = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await bidService.getBidsByProject(projectId);
      
      if (result.success && result.bids) {
        setBids(result.bids);
      } else {
        setBids([]);
      }
    } catch (error) {
      console.error('Error loading bids:', error);
      setError('Failed to load bids');
      setBids([]);
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
        // Reload bids to show updated status
        await loadProjectBids(selectedProject);
      }
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      setError(`Failed to ${action} bid. Please try again.`);
    } finally {
      setActionLoading(null);
    }
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h2>
        {loading && projects.length === 0 ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No projects found. Create a project first to receive bids.</p>
        ) : (
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
                <h3 className="font-medium text-gray-900">{project.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{project.bid_count || 0} bids received</p>
                <p className="text-xs text-gray-400 mt-1">{project.category} • {project.location}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="space-y-6">
          {loading && bids.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500">Loading bids...</p>
            </div>
          ) : bids.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-500">No bids received yet for this project.</p>
            </div>
          ) : (
            bids.map((bid) => (
              <div key={bid.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {bid.first_name} {bid.last_name}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        bid.bidder_role === 'constructor' 
                          ? 'bg-blue-100 text-blue-800' 
                          : bid.bidder_role === 'architect'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {bid.bidder_role}
                      </span>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        bid.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : bid.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bid.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{bid.email}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{bid.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-500">Bid Amount</p>
                          <p className="font-semibold text-gray-900">${parseFloat(bid.bid_amount).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-500">Timeline</p>
                          <p className="font-semibold text-gray-900">{bid.proposed_timeline}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-500">Submitted</p>
                        <p className="font-semibold text-gray-900">{new Date(bid.submitted_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View Details</span>
                  </button>
                  
                  {bid.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleBidAction(bid.id, 'reject')}
                        disabled={actionLoading === bid.id}
                        className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        <span>{actionLoading === bid.id ? 'Rejecting...' : 'Reject'}</span>
                      </button>
                      <button
                        onClick={() => handleBidAction(bid.id, 'accept')}
                        disabled={actionLoading === bid.id}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{actionLoading === bid.id ? 'Accepting...' : 'Accept'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ViewBids;