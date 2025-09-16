import React, { useState } from 'react';
import { Search, MapPin, Calendar, DollarSign, Eye, Filter, Send } from 'lucide-react';
import { Link } from 'react-router-dom';   // ✅ Import Link

const BrowseProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'Office Building Renovation',
      location: 'Downtown Seattle, WA',
      budget: '$250,000 - $300,000',
      deadline: '2025-03-15',
      category: 'Commercial',
      description: 'Complete renovation of a 10,000 sq ft office building including HVAC, electrical, and interior design.',
      postedDate: '2025-01-10',
      bidsCount: 12,
      status: 'Open'
    },
    {
      id: 2,
      title: 'Residential Kitchen Remodel',
      location: 'Bellevue, WA',
      budget: '$45,000 - $65,000',
      deadline: '2025-02-28',
      category: 'Residential',
      description: 'Modern kitchen renovation with custom cabinets, granite countertops, and premium appliances.',
      postedDate: '2025-01-12',
      bidsCount: 8,
      status: 'Open'
    },
    {
      id: 3,
      title: 'Warehouse Construction',
      location: 'Tacoma, WA',
      budget: '$800,000 - $1,200,000',
      deadline: '2025-06-30',
      category: 'Industrial',
      description: '50,000 sq ft warehouse construction with loading docks and office space.',
      postedDate: '2025-01-08',
      bidsCount: 15,
      status: 'Open'
    },
    {
      id: 4,
      title: 'School Playground Installation',
      location: 'Redmond, WA',
      budget: '$75,000 - $90,000',
      deadline: '2025-04-15',
      category: 'Public',
      description: 'Installation of playground equipment, safety surfacing, and landscaping.',
      postedDate: '2025-01-05',
      bidsCount: 6,
      status: 'Open'
    }
  ];

  const categories = ['all', 'Commercial', 'Residential', 'Industrial', 'Public'];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <span className="text-sm text-gray-500">{filteredProjects.length} projects found</span>
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
                  {project.budget}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Deadline: {new Date(project.deadline).toLocaleDateString()}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {project.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 space-x-2">
                <button className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-sm font-medium">
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

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Filter className="h-12 w-12 mx-auto mb-4" />
            <p>No projects found matching your criteria.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseProjects;
