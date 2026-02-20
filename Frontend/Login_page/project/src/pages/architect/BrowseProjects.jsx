import React, { useState, useEffect } from 'react';
import Header from '../../components/architect/Header';
import { MapPin, Calendar, DollarSign, Users, ArrowRight, Filter, Eye, Send } from 'lucide-react';
import projectService from '../../services/projectService.js';
import bidService from '../../services/bidService.js';

const BrowseProjects = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Bid form state
  const [bidForm, setBidForm] = useState({
    proposalTitle: '',
    description: '',
    designCost: '',
    timeline: '',
    supportingDocs: []
  });
  const [bidLoading, setBidLoading] = useState(false);
  const [bidError, setBidError] = useState(null);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Load projects for architects from the API
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user ID to filter out already-bid projects
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      const result = await projectService.getProjectsForArchitects(userId);

      if (result.success) {
        setProjects(result.projects || []);
      } else {
        setError(result.message || 'Failed to load projects');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects. Please try again.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };


  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'renovation', label: 'Renovation' },
    { value: 'infrastructure', label: 'Infrastructure' }
  ];

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleBidProject = (project) => {
    setSelectedProject(project);
    setShowBidModal(true);
    // Reset form when opening
    setBidForm({
      proposalTitle: '',
      description: '',
      designCost: '',
      timeline: '',
      supportingDocs: []
    });
    setBidError(null);
    setBidSuccess(false);
  };

  const handleBidFormChange = (field, value) => {
    setBidForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setBidLoading(true);
    setBidError(null);

    try {
      // Get architect user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const architectId = user.id;

      if (!architectId) {
        setBidError('User ID not found. Please log in again.');
        return;
      }

      // Prepare bid data
      const bidData = {
        project_id: selectedProject.id,
        bidder_user_id: architectId,
        bidder_role: 'architect',
        bid_amount: parseFloat(bidForm.designCost),
        proposed_timeline: bidForm.timeline,
        description: `${bidForm.proposalTitle}\n\n${bidForm.description}`
      };

      console.log('Submitting architect bid:', bidData);

      const result = await bidService.createBid(bidData);

      if (result.success) {
        setBidSuccess(true);
        console.log('Bid submitted successfully:', result);

        // Close modal after 2 seconds
        setTimeout(() => {
          setShowBidModal(false);
          setSelectedProject(null);
          setBidSuccess(false);
        }, 2000);
      } else {
        setBidError(result.message || 'Failed to submit bid');
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      setBidError(error.message || 'Failed to submit bid. Please try again.');
    } finally {
      setBidLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 relative">
      <Header 
        title="Browse Projects" 
        subtitle="Discover projects without plans and submit your proposals"
      />
      
      <div className="p-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <button
              onClick={loadProjects}
              className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading projects that need architectural design...</div>
          </div>
        )}

        {/* Filters */}
        {!loading && (
          <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setFilter(category.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === category.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            {filteredProjects.length} projects available
          </div>
        </div>
        )}

        {/* Project Grid */}
        {!loading && !error && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">
                  {filter === 'all'
                    ? "No projects currently need architectural design"
                    : `No ${filter} projects need architectural design`}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Project Header */}
              <div className="mb-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {project.title}
                  </h3>
                  <div className="flex flex-col items-end gap-1">
                    {project.user_has_bid ? (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full border border-purple-300">
                        ✓ Already Bid
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        {project.status}
                      </span>
                    )}
                    {project.user_has_bid && project.user_bid_status && (
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                        project.user_bid_status === 'accepted' ? 'bg-green-100 text-green-700' :
                        project.user_bid_status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {project.user_bid_status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-medium">
                    {project.first_name && project.last_name
                      ? `${project.first_name} ${project.last_name}`
                      : project.email || 'Client'}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">New</span>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">{project.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">{project.budget_range}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Timeline: {project.timeline}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="text-sm font-medium text-blue-600">Category: {project.category}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => handleViewProject(project)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                <button
                  onClick={() => handleBidProject(project)}
                  disabled={project.user_has_bid}
                  className={`flex-1 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    project.user_has_bid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>{project.user_has_bid ? 'Bid Submitted' : 'Submit Bid'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
            )}
          </>
        )}
      </div>

      {/* Project Details Modal */}
      {selectedProject && !showBidModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Client</h3>
                    <p className="text-blue-600">
                      {selectedProject.first_name && selectedProject.last_name
                        ? `${selectedProject.first_name} ${selectedProject.last_name}`
                        : 'Client'}
                    </p>
                    <p className="text-sm text-gray-600">{selectedProject.email}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Category</h3>
                    <p className="font-medium text-blue-600 capitalize">{selectedProject.category}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Budget Range</h3>
                    <p className="text-green-600 font-medium">{selectedProject.budget_range}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Timeline</h3>
                    <p className="text-gray-600">{selectedProject.timeline}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Project Description</h3>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">{selectedProject.location}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => setShowBidModal(true)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Proposal</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid Submission Modal */}
      {showBidModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Submit Proposal</h2>
                  <p className="text-gray-600">{selectedProject.title}</p>
                </div>
                <button 
                  onClick={() => {
                    setShowBidModal(false);
                    setSelectedProject(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {/* Success Message */}
              {bidSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">✓ Proposal submitted successfully!</p>
                  <p className="text-green-600 text-sm">The client will review your proposal and get back to you.</p>
                </div>
              )}

              {/* Error Message */}
              {bidError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800">{bidError}</p>
                </div>
              )}

              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    value={bidForm.proposalTitle}
                    onChange={(e) => handleBidFormChange('proposalTitle', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your proposal title"
                    required
                    disabled={bidLoading || bidSuccess}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Description
                  </label>
                  <textarea
                    rows={4}
                    value={bidForm.description}
                    onChange={(e) => handleBidFormChange('description', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your approach and vision for this project"
                    required
                    disabled={bidLoading || bidSuccess}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Design Cost ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={bidForm.designCost}
                      onChange={(e) => handleBidFormChange('designCost', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50000"
                      required
                      disabled={bidLoading || bidSuccess}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Timeline
                    </label>
                    <input
                      type="text"
                      value={bidForm.timeline}
                      onChange={(e) => handleBidFormChange('timeline', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 12 weeks"
                      required
                      disabled={bidLoading || bidSuccess}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <p className="text-gray-500 mb-2">Upload concept sketches, portfolio samples, or references</p>
                    <input type="file" multiple className="hidden" id="proposal-files" />
                    <label htmlFor="proposal-files" className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer">
                      Upload Files
                    </label>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBidModal(false);
                      setSelectedProject(null);
                      setBidError(null);
                      setBidSuccess(false);
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                    disabled={bidLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bidLoading || bidSuccess}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bidLoading ? 'Submitting...' : bidSuccess ? 'Submitted!' : 'Submit Proposal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseProjects;