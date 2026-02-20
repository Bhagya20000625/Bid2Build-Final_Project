import React, { useState } from 'react';
import Header from '../components/Header';
import { MapPin, Calendar, DollarSign, Users, ArrowRight, Filter, Eye, Send } from 'lucide-react';

const BrowseProjects = () => {
  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showBidModal, setShowBidModal] = useState(false);
  
  const projects = [
    {
      id: 1,
      title: 'Modern Residential Complex',
      client: 'Green Valley Development Corp',
      location: 'San Francisco, CA',
      budget: '$2.5M - $3M',
      deadline: '2024-06-15',
      category: 'residential',
      description: 'Design a sustainable 50-unit residential complex with modern amenities and green spaces.',
      proposals: 12,
      status: 'open',
      clientInfo: {
        name: 'Sarah Johnson',
        company: 'Green Valley Development Corp',
        rating: 4.8
      }
    },
    {
      id: 2,
      title: 'Corporate Headquarters Renovation',
      client: 'TechCorp Industries',
      location: 'Austin, TX',
      budget: '$5M - $8M',
      deadline: '2024-08-30',
      category: 'commercial',
      description: 'Transform existing office space into a modern, collaborative headquarters for 500 employees.',
      proposals: 8,
      status: 'open',
      clientInfo: {
        name: 'Michael Chen',
        company: 'TechCorp Industries',
        rating: 4.9
      }
    },
    {
      id: 3,
      title: 'Community Arts Center',
      client: 'City of Portland',
      location: 'Portland, OR',
      budget: '$1.2M - $1.8M',
      deadline: '2024-07-20',
      category: 'public',
      description: 'Design a multi-purpose arts center with exhibition spaces, studios, and performance areas.',
      proposals: 15,
      status: 'open',
      clientInfo: {
        name: 'Emily Rodriguez',
        company: 'City of Portland',
        rating: 4.7
      }
    },
    {
      id: 4,
      title: 'Luxury Hotel Design',
      client: 'Oceanview Hospitality',
      location: 'Miami, FL',
      budget: '$10M - $15M',
      deadline: '2024-09-15',
      category: 'hospitality',
      description: 'Create a 200-room luxury beachfront hotel with spa, restaurants, and conference facilities.',
      proposals: 6,
      status: 'open',
      clientInfo: {
        name: 'David Martinez',
        company: 'Oceanview Hospitality',
        rating: 4.6
      }
    }
  ];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const categories = [
    { value: 'all', label: 'All Projects' },
    { value: 'residential', label: 'Residential' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'public', label: 'Public' },
    { value: 'hospitality', label: 'Hospitality' }
  ];

  const handleViewProject = (project) => {
    setSelectedProject(project);
  };

  const handleBidProject = (project) => {
    setSelectedProject(project);
    setShowBidModal(true);
  };

  return (
    <div className="flex-1 bg-gray-50 relative">
      <Header 
        title="Browse Projects" 
        subtitle="Discover projects without plans and submit your proposals"
      />
      
      <div className="p-8">
        {/* Filters */}
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

        {/* Project Grid */}
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
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-medium">{project.client}</p>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm text-gray-600">{project.clientInfo.rating}</span>
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
                  <span className="text-sm font-medium">{project.budget}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="text-sm">{project.proposals} proposals submitted</span>
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
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 group"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Bid</span>
                </button>
              </div>
            </div>
          ))}
        </div>
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
                    <p className="text-blue-600">{selectedProject.clientInfo.company}</p>
                    <p className="text-sm text-gray-600">{selectedProject.clientInfo.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Client Rating</h3>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-medium">{selectedProject.clientInfo.rating}</span>
                      <span className="text-sm text-gray-500">(Based on previous projects)</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Budget Range</h3>
                    <p className="text-green-600 font-medium">{selectedProject.budget}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Deadline</h3>
                    <p className="text-gray-600">{new Date(selectedProject.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Project Description</h3>
                  <p className="text-gray-600">{selectedProject.description}</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Competition</h3>
                  <p className="text-gray-600">{selectedProject.proposals} architects have submitted proposals</p>
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
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Title
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your proposal title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Proposal Description
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your approach and vision for this project"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Design Cost
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., $50,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Timeline
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 12 weeks"
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
                    }}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Submit Proposal
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