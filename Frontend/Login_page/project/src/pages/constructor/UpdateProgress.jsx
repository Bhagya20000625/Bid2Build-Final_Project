import React, { useState } from 'react';
import { Camera, Calendar, CheckCircle, Clock, AlertTriangle, Plus, Image as ImageIcon } from 'lucide-react';

const UpdateProgress = () => {
  const [selectedProject, setSelectedProject] = useState('');

  const activeProjects = [
    {
      id: 1,
      title: 'Residential Kitchen Remodel',
      progress: 65,
      status: 'In Progress',
      startDate: '2025-01-15',
      expectedCompletion: '2025-02-26'
    },
    {
      id: 2,
      title: 'Office Building Renovation',
      progress: 30,
      status: 'In Progress',
      startDate: '2025-01-10',
      expectedCompletion: '2025-03-15'
    }
  ];

  
  const progressUpdates = [
    {
      id: 1,
      projectTitle: 'Residential Kitchen Remodel',
      milestone: 'Demolition Complete',
      progress: 25,
      date: '2025-01-18',
      description: 'Successfully removed old cabinets, countertops, and flooring. Site cleaned and prepared for electrical work.',
      images: [
        'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
        'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg'
      ],
      status: 'Completed'
    },
    {
      id: 2,
      projectTitle: 'Residential Kitchen Remodel',
      milestone: 'Electrical Installation',
      progress: 50,
      date: '2025-01-20',
      description: 'Installed new electrical outlets, under-cabinet lighting, and pendant light fixtures. All electrical work inspected and approved.',
      images: [
        'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg'
      ],
      status: 'Completed'
    },
    {
      id: 3,
      projectTitle: 'Office Building Renovation',
      milestone: 'HVAC System Installation',
      progress: 30,
      date: '2025-01-22',
      description: 'Began installation of new HVAC system. Main unit installed, working on ductwork distribution throughout the building.',
      images: [],
      status: 'In Progress'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Behind Schedule':
        return 'bg-red-100 text-red-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'Behind Schedule':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleProgressSubmit = (e) => {
    e.preventDefault();
    console.log('Progress update submitted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Update Progress</h1>
        <button className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Add Progress Update
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activeProjects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Started:</span>
                <p>{new Date(project.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="font-medium">Expected Completion:</span>
                <p>{new Date(project.expectedCompletion).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Add New Progress Update</h2>
        
        <form onSubmit={handleProgressSubmit} className="space-y-6">
          <div>
            <label htmlFor="project-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Project
            </label>
            <select
              id="project-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a project...</option>
              {activeProjects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="milestone" className="block text-sm font-medium text-gray-700 mb-2">
                Milestone/Phase
              </label>
              <input
                type="text"
                id="milestone"
                placeholder="e.g., Foundation Complete, Framing Started"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="progress-percent" className="block text-sm font-medium text-gray-700 mb-2">
                Overall Progress (%)
              </label>
              <input
                type="number"
                id="progress-percent"
                min="0"
                max="100"
                placeholder="0-100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Progress Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Describe what work was completed, any challenges encountered, and next steps..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Photos
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">Upload progress photos</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <Camera className="h-4 w-4 mr-2" />
                Choose Photos
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Submit Progress Update
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Progress Updates</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {progressUpdates.map((update) => (
            <div key={update.id} className="px-6 py-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(update.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{update.milestone}</h3>
                      <p className="text-sm text-gray-600">{update.projectTitle}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(update.status)}`}>
                        {update.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(update.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">{update.description}</p>
                  
                  {update.images.length > 0 && (
                    <div className="flex space-x-2">
                      {update.images.map((image, index) => (
                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Progress ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {update.images.length > 3 && (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-500 ml-1">+{update.images.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpdateProgress;