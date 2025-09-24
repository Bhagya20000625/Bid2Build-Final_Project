import React, { useState } from 'react';
import { User, MapPin, Phone, Mail, Building2, FileText, Download, Upload, Settings } from 'lucide-react';

const Profile = ({ userProfile = null }) => {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Use passed userProfile or default data
  const defaultProfileData = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    company: 'Johnson Construction Group',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
    bio: 'Experienced project manager with over 10 years in commercial construction. Specialized in office buildings and retail spaces.'
  };
  
  const [profileData, setProfileData] = useState({
    ...defaultProfileData,
    ...(userProfile || {})
  });

  const documents = [
    {
      id: 1,
      name: 'Building Permit - Downtown Office',
      type: 'Legal Document',
      uploadDate: '2024-01-15',
      size: '2.3 MB',
      status: 'active'
    },
    {
      id: 2,
      name: 'Environmental Impact Assessment',
      type: 'Legal Document',
      uploadDate: '2024-01-10',
      size: '5.8 MB',
      status: 'active'
    },
    {
      id: 3,
      name: 'Office Complex Blueprints',
      type: 'Project Plan',
      uploadDate: '2024-01-20',
      size: '12.4 MB',
      status: 'active'
    },
    {
      id: 4,
      name: 'Zoning Approval Certificate',
      type: 'Legal Document',
      uploadDate: '2024-01-08',
      size: '1.2 MB',
      status: 'active'
    }
  ];

  const myProjects = [
    {
      id: 1,
      name: 'Downtown Office Complex',
      status: 'active',
      progress: 65,
      budget: '$125,000',
      startDate: '2024-01-01',
      contractor: 'ABC Construction Co.'
    },
    {
      id: 2,
      name: 'Residential Development',
      status: 'active',
      progress: 40,
      budget: '$85,000',
      startDate: '2024-01-15',
      contractor: 'BuildMaster Ltd.'
    },
    {
      id: 3,
      name: 'Retail Store Renovation',
      status: 'completed',
      progress: 100,
      budget: '$45,000',
      startDate: '2023-11-01',
      contractor: 'Premier Builders'
    },
    {
      id: 4,
      name: 'Warehouse Expansion',
      status: 'completed',
      progress: 100,
      budget: '$200,000',
      startDate: '2023-08-01',
      contractor: 'Industrial Builders'
    }
  ];

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    console.log('Profile updated:', profileData);
  };

  const handleDocumentDownload = (docId) => {
    console.log('Download document:', docId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your account settings and project information</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Document Vault
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Projects
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="max-w-2xl">
              <div className="flex items-center space-x-6 mb-8">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  SJ
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                  <p className="text-gray-600">{profileData.company}</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                    Change Photo
                  </button>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.company}
                        onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself and your experience..."
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Update Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Document Vault</h2>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                  <Upload className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{doc.name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                            <span>•</span>
                            <span>Uploaded {new Date(doc.uploadDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDocumentDownload(doc.id)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">My Projects</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myProjects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                        <p className="text-sm text-gray-600">Started: {new Date(project.startDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                        {project.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            project.status === 'completed' ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Budget</span>
                        <p className="font-medium text-gray-900">{project.budget}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contractor</span>
                        <p className="font-medium text-gray-900">{project.contractor}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;