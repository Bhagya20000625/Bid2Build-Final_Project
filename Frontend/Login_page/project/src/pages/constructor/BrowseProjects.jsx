import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, Eye, Filter, Send, X } from 'lucide-react';
import projectService from '../../services/projectService.js';
import bidService from '../../services/bidService.js';

const BrowseProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bidFormData, setBidFormData] = useState({
    bid_amount: '',
    proposed_timeline: '',
    description: ''
  });

  // Load projects for constructors on component mount
  useEffect(() => {
    loadConstructorProjects();
  }, []);

  const loadConstructorProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user ID to filter out already-bid projects
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      const result = await projectService.getProjectsForConstructors(userId);

      if (result.success && result.projects) {
        setProjects(result.projects);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error('Error loading constructor projects:', error);
      setError('Failed to load projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setSelectedProject(project);
      setBidFormData({
        bid_amount: '',
        proposed_timeline: '',
        description: ''
      });
      setShowBidModal(true);
    }
  };

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      // Get user data from localStorage (assuming constructor is logged in)
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const bidderId = user.id;

      // DEBUG: Log what we're sending
      console.log('🔍 User from localStorage:', user);
      console.log('🔍 Bidder ID:', bidderId);
      console.log('🔍 Selected Project:', selectedProject);
      console.log('🔍 Project Owner ID:', selectedProject.user_id);

      if (!bidderId) {
        alert('Error: User ID not found. Please log in again.');
        return;
      }

      if (selectedProject.user_id === bidderId) {
        alert('⚠️ You cannot bid on your own project! Please use a different account.');
        return;
      }

      const bidData = {
        project_id: selectedProject.id,
        bidder_user_id: bidderId,
        bidder_role: 'constructor',
        bid_amount: parseFloat(bidFormData.bid_amount),
        proposed_timeline: bidFormData.proposed_timeline,
        description: bidFormData.description
      };

      console.log('📤 Sending bid data:', bidData);

      const result = await bidService.createBid(bidData);
      
      if (result.success) {
        alert('Bid submitted successfully!');
        setShowBidModal(false);
        setBidFormData({
          bid_amount: '',
          proposed_timeline: '',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Failed to submit bid. Please try again.');
    }
  };

  const handleBidInputChange = (e) => {
    const { name, value } = e.target;
    setBidFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDownloadFile = async (fileId, fileName) => {
    try {
      const response = await projectService.downloadProjectFile(selectedProject.id, fileId);
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use provided fileName
      const contentDisposition = response.headers['content-disposition'];
      const fileNameFromHeader = contentDisposition ? 
        contentDisposition.split('filename=')[1]?.replace(/"/g, '') : 
        fileName;
        
      link.setAttribute('download', fileNameFromHeader || fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  // Developer example data removed: real project data is fetched via `projectService`

  const categories = ['all', 'Commercial', 'Residential', 'Industrial', 'Public'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewDetails = async (projectId) => {
    try {
      const result = await projectService.getProjectById(projectId);
      if (result.success && result.project) {
        setSelectedProject(result.project);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Error loading project details:', error);
      alert('Failed to load project details');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-500">{filteredProjects.length} projects found</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search projects by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">Loading projects...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <p className="text-gray-500">No projects found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {project.title}
                </h3>
                <div className="flex flex-col items-end gap-1">
                  {project.user_has_bid ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
                      ✓ Already Bid
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {project.status || 'Open'}
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

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {project.budget_range || project.budget}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline: {project.timeline || project.deadline}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 space-x-2">
                <button
                  onClick={() => handleViewDetails(project.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </button>

                <button
                  onClick={() => handleSubmitBid(project.id)}
                  disabled={project.user_has_bid}
                  className={`flex-1 inline-flex items-center justify-center px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                    project.user_has_bid
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send className="h-4 w-4 mr-1" />
                  {project.user_has_bid ? 'Bid Submitted' : 'Submit Bid'}
                </button>
              </div>
            </div>
          </div>
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {showDetailsModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Project Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedProject.title}</h3>
                  <p className="text-gray-600 mt-2">{selectedProject.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {selectedProject.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {selectedProject.budget_range}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    {selectedProject.timeline}
                  </div>
                  <div className="text-sm text-gray-600">
                    Category: {selectedProject.category}
                  </div>
                </div>

                {selectedProject.files && selectedProject.files.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Project Files:</h4>
                    <ul className="space-y-2">
                      {selectedProject.files.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                          <div className="flex items-center">
                            <span className="mr-2">📄</span>
                            <span className="text-sm text-gray-700">{file.original_name}</span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({file.file_size ? (file.file_size / 1024).toFixed(1) + ' KB' : 'Unknown size'})
                            </span>
                          </div>
                          <button
                            onClick={() => handleDownloadFile(file.id, file.original_name)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors duration-200"
                          >
                            Download
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleSubmitBid(selectedProject.id);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Bid Modal */}
      {showBidModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Submit Bid</h2>
                <button
                  onClick={() => setShowBidModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Project: <span className="font-medium">{selectedProject.title}</span></p>
              </div>

              <form onSubmit={handleBidSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bid Amount ($)
                  </label>
                  <input
                    type="number"
                    name="bid_amount"
                    value={bidFormData.bid_amount}
                    onChange={handleBidInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your bid amount"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proposed Timeline
                  </label>
                  <input
                    type="text"
                    name="proposed_timeline"
                    value={bidFormData.proposed_timeline}
                    onChange={handleBidInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 3 months, 8 weeks"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={bidFormData.description}
                    onChange={handleBidInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your approach, experience, or any relevant details..."
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBidModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Submit Bid
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