import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Mail, Phone, MapPin, Calendar, Award, Building2, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';

const ProfileModal = ({ userId, isOpen, onClose }) => {
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfileData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, userId]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch user profile
      const profileResponse = await axios.get(
        `http://localhost:5000/api/users/${userId}`
      );
      setProfile(profileResponse.data);

      // Fetch portfolio (only for architects/constructors)
      const userRole = profileResponse.data.user_role;
      if (userRole === 'architect' || userRole === 'constructor') {
        const portfolioResponse = await axios.get(
          `http://localhost:5000/api/portfolio/user/${userId}`
        );
        setPortfolio(portfolioResponse.data.projects || []);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.response?.data?.error || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (userType) => {
    const labels = {
      architect: 'Architect',
      constructor: 'Constructor',
      supplier: 'Supplier',
      customer: 'Client'
    };
    return labels[userType] || userType;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getProjectTypeLabel = (type) => {
    const labels = {
      residential: 'Residential',
      commercial: 'Commercial',
      industrial: 'Industrial',
      renovation: 'Renovation',
      other: 'Other'
    };
    return labels[type] || type;
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={24} />
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-white">{error}</p>
              </div>
            ) : profile ? (
              <div className="flex items-start gap-6">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {profile.profile_picture ? (
                    <img
                      src={`http://localhost:5000/${profile.profile_picture}`}
                      alt={`${profile.first_name} ${profile.last_name}`}
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white bg-white/20 flex items-center justify-center">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {profile.first_name} {profile.last_name}
                  </h2>
                  <p className="text-white/90 mb-3">
                    {getUserTypeLabel(profile.user_role)}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Joined {formatDate(profile.created_at)}</span>
                    </div>
                    {(profile.user_role === 'architect' || profile.user_role === 'constructor') && (
                      <div className="flex items-center gap-1">
                        <Briefcase size={16} />
                        <span>{portfolio.length} Portfolio Projects</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Tabs */}
          {!loading && !error && profile && (
            <>
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('about')}
                  className={`flex-1 px-6 py-3 font-medium transition-colors ${
                    activeTab === 'about'
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  About
                </button>
                {(profile.user_role === 'architect' || profile.user_role === 'constructor') && (
                  <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`flex-1 px-6 py-3 font-medium transition-colors ${
                      activeTab === 'portfolio'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Portfolio ({portfolio.length})
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'about' ? (
                  <div className="space-y-6">
                    {/* Bio */}
                    {profile.bio && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                          <User size={20} className="text-blue-600" />
                          About
                        </h3>
                        <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                      </div>
                    )}

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Mail size={20} className="text-blue-600" />
                        Contact Information
                      </h3>
                      <div className="space-y-2 text-gray-700">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-gray-400" />
                          <span>{profile.email}</span>
                        </div>
                        {profile.phone && (
                          <div className="flex items-center gap-3">
                            <Phone size={18} className="text-gray-400" />
                            <span>{profile.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stats for Professionals */}
                    {(profile.user_role === 'architect' || profile.user_role === 'constructor') && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Award size={20} className="text-blue-600" />
                          Statistics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {portfolio.length}
                            </div>
                            <div className="text-sm text-gray-600">Portfolio Projects</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {profile.completed_projects || 0}
                            </div>
                            <div className="text-sm text-gray-600">Completed Projects</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : activeTab === 'portfolio' ? (
                  <div className="space-y-4">
                    {portfolio.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {portfolio.map((project) => (
                          <div
                            key={project.id}
                            onClick={() => openProjectDetails(project)}
                            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                          >
                            {/* Project Image */}
                            <div className="relative h-48 bg-gray-200">
                              {project.cover_image ? (
                                <img
                                  src={`http://localhost:5000/${project.cover_image}`}
                                  alt={project.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Building2 size={48} className="text-gray-400" />
                                </div>
                              )}
                              {project.is_featured && (
                                <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded">
                                  Featured
                                </span>
                              )}
                            </div>

                            {/* Project Info */}
                            <div className="p-4">
                              <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                                {project.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2">
                                {getProjectTypeLabel(project.project_type)}
                                {project.location && ` • ${project.location}`}
                              </p>
                              {project.completion_date && (
                                <p className="text-xs text-gray-500">
                                  Completed: {formatDate(project.completion_date)}
                                </p>
                              )}
                              {project.images && project.images.length > 0 && (
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                  <ImageIcon size={14} />
                                  <span>{project.images.length} photos</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-12">
                        <Building2 size={48} className="mx-auto mb-4 text-gray-400" />
                        <p>No portfolio projects yet</p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
              <button
                onClick={closeProjectDetails}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              {/* Project Images */}
              {selectedProject.images && selectedProject.images.length > 0 && (
                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProject.images.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/${image}`}
                        alt={`${selectedProject.title} - ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Project Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Project Type</h3>
                    <p className="text-base text-gray-900">
                      {getProjectTypeLabel(selectedProject.project_type)}
                    </p>
                  </div>
                  {selectedProject.location && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <p className="text-base text-gray-900">{selectedProject.location}</p>
                    </div>
                  )}
                  {selectedProject.completion_date && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Completed</h3>
                      <p className="text-base text-gray-900">
                        {formatDate(selectedProject.completion_date)}
                      </p>
                    </div>
                  )}
                  {selectedProject.duration && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                      <p className="text-base text-gray-900">{selectedProject.duration}</p>
                    </div>
                  )}
                  {selectedProject.budget_range && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Budget</h3>
                      <p className="text-base text-gray-900">{selectedProject.budget_range}</p>
                    </div>
                  )}
                </div>

                {selectedProject.description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <p className="text-base text-gray-700 leading-relaxed">
                      {selectedProject.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
