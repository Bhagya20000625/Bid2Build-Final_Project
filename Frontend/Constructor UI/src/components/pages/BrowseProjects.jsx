import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, Eye, Filter, Send, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const BrowseProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch projects from backend
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching projects from: http://localhost:5000/api/projects/constructor');

      const response = await fetch('http://localhost:5000/api/projects/constructor', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Response error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📊 API Response:', data);

      if (data.success && data.projects) {
        console.log('✅ Projects loaded successfully:', data.projects.length);
        setProjects(data.projects);
        setError(null);
      } else {
        throw new Error(data.message || 'Failed to fetch projects');
      }
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      console.error('❌ Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });

      setError(`Failed to load projects: ${error.message}`);

      // Show limited fallback data
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // View project details
  const handleViewDetails = async (projectId) => {
    try {
      console.log('🔍 Fetching project details for ID:', projectId);

      const response = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('📡 Project details response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Project details error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📊 Project details data:', data);

      if (data.success && data.project) {
        setSelectedProject(data.project);
        setShowModal(true);
      } else {
        throw new Error(data.message || 'Failed to fetch project details');
      }
    } catch (error) {
      console.error('❌ Error fetching project details:', error);
      alert(`Failed to load project details: ${error.message}`);
    }
  };

  const categories = ['all', 'commercial', 'residential', 'industrial', 'renovation'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Format budget range for display
  const formatBudgetRange = (budgetRange) => {
    const budgetMap = {
      '0-50k': '$0 - $50,000',
      '50k-100k': '$50,000 - $100,000',
      '100k-500k': '$100,000 - $500,000',
      '500k-1m': '$500,000 - $1,000,000',
      '1m+': '$1,000,000+'
    };
    return budgetMap[budgetRange] || budgetRange;
  };

  // Format timeline for display
  const formatTimeline = (timeline) => {
    const timelineMap = {
      '1-3months': '1-3 months',
      '3-6months': '3-6 months',
      '6-12months': '6-12 months',
      '12months+': '12+ months'
    };
    return timelineMap[timeline] || timeline;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          {loading ? (
            <span className="text-sm text-gray-500">Loading projects...</span>
          ) : (
            <span className="text-sm text-gray-500">{filteredProjects.length} projects found</span>
          )}
          {error && (
            <span className="text-sm text-red-500">⚠️ {error}</span>
          )}
        </div>
      </div>

      {/* Filters */}
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

      {/* Projects Grid */}
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
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {project.status}
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {formatBudgetRange(project.budget_range)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Timeline: {formatTimeline(project.timeline)}
                </div>
                <div className="text-sm text-gray-500">
                  Bids: {project.bid_count || 0}
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

                {/* ✅ Submit Bid button */}
                <Link
                  to="/bids"
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Submit Bid
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4" />
            <p>No projects found matching your criteria.</p>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-gray-900">{selectedProject.title}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <p className="text-gray-600">{selectedProject.location}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <p className="text-gray-600">{selectedProject.category}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Budget Range:</span>
                      <p className="text-gray-600">{formatBudgetRange(selectedProject.budget_range)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Timeline:</span>
                      <p className="text-gray-600">{formatTimeline(selectedProject.timeline)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                        {selectedProject.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Client Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-gray-700">Client:</span>
                      <p className="text-gray-600">{selectedProject.first_name} {selectedProject.last_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{selectedProject.email}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Posted:</span>
                      <p className="text-gray-600">{new Date(selectedProject.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Bids:</span>
                      <p className="text-gray-600">{selectedProject.bid_count || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{selectedProject.description}</p>
              </div>

              {selectedProject.files && selectedProject.files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedProject.files.map((file, index) => (
                      <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-sm text-gray-600">{file.original_name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
              <Link
                to="/bids"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Submit Bid for This Project
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseProjects;
