import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, Upload, Download } from 'lucide-react';

const ProjectProgress = () => {
  const [selectedProject, setSelectedProject] = useState('downtown-office');

  const projects = [
    { id: 'downtown-office', name: 'Downtown Office Complex', progress: 65 },
    { id: 'residential-project', name: 'Residential Development', progress: 40 },
    { id: 'retail-store', name: 'Retail Store Renovation', progress: 85 }
  ];

  const milestones = [
    {
      id: 1,
      title: 'Site Preparation & Foundation',
      description: 'Site clearance, excavation, and foundation work',
      progress: 100,
      status: 'completed',
      startDate: '2024-01-01',
      endDate: '2024-01-30',
      photos: 3,
      reports: 2
    },
    {
      id: 2,
      title: 'Structural Framework',
      description: 'Steel framework and concrete structure',
      progress: 100,
      status: 'completed',
      startDate: '2024-02-01',
      endDate: '2024-03-15',
      photos: 5,
      reports: 3
    },
    {
      id: 3,
      title: 'Exterior & Roofing',
      description: 'Exterior walls, windows, and roofing installation',
      progress: 75,
      status: 'in_progress',
      startDate: '2024-03-16',
      endDate: '2024-04-30',
      photos: 8,
      reports: 1
    },
    {
      id: 4,
      title: 'Interior Systems',
      description: 'Electrical, plumbing, and HVAC systems',
      progress: 25,
      status: 'in_progress',
      startDate: '2024-04-01',
      endDate: '2024-05-15',
      photos: 2,
      reports: 1
    },
    {
      id: 5,
      title: 'Interior Finishing',
      description: 'Flooring, painting, and interior fixtures',
      progress: 0,
      status: 'pending',
      startDate: '2024-05-16',
      endDate: '2024-06-30',
      photos: 0,
      reports: 0
    },
    {
      id: 6,
      title: 'Final Inspection & Handover',
      description: 'Final inspections, testing, and project handover',
      progress: 0,
      status: 'pending',
      startDate: '2024-07-01',
      endDate: '2024-07-15',
      photos: 0,
      reports: 0
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
        return Clock;
      case 'pending':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Progress</h1>
        <p className="text-gray-600">Track milestones and monitor project completion</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Project</h2>
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
              <h3 className="font-medium text-gray-900 mb-2">{project.name}</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-blue-600">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Overall Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">65%</div>
            <div className="text-sm text-gray-500 mt-1">Complete</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">4</div>
            <div className="text-sm text-gray-500 mt-1">Milestones Done</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">2</div>
            <div className="text-sm text-gray-500 mt-1">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-600">45</div>
            <div className="text-sm text-gray-500 mt-1">Days Remaining</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Project Milestones</h2>
        
        <div className="space-y-6">
          {milestones.map((milestone, index) => {
            const StatusIcon = getStatusIcon(milestone.status);
            
            return (
              <div key={milestone.id} className="relative">
                {index < milestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-px h-16 bg-gray-200"></div>
                )}
                
                <div className="flex space-x-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : milestone.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <StatusIcon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1 bg-gray-50 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                        <p className="text-gray-600 mb-2">{milestone.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{milestone.startDate} - {milestone.endDate}</span>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 mb-1">{milestone.progress}%</div>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              milestone.status === 'completed' 
                                ? 'bg-green-600' 
                                : milestone.status === 'in_progress'
                                ? 'bg-blue-600'
                                : 'bg-gray-400'
                            }`}
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Upload className="w-4 h-4" />
                          <span>{milestone.photos} photos</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{milestone.reports} reports</span>
                        </div>
                      </div>
                      
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProjectProgress;