import React, { useState } from 'react';
import { FileText, Calendar, DollarSign, Clock, CheckCircle, XCircle, Eye, MessageCircle, Upload, AlertCircle } from 'lucide-react';

const MyProposals = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Unified proposals data with project information for accepted proposals
  const proposals = [
    {
      id: 1,
      projectTitle: 'Modern Residential Complex',
      client: 'Green Valley Development',
      proposalTitle: 'Sustainable Living Community Design',
      submittedDate: '2024-01-15',
      status: 'accepted',
      budget: '$75,000',
      timeline: '16 weeks',
      clientFeedback: 'Excellent proposal! We love the sustainable approach and innovative design concepts.',
      // Project details (available when status is 'accepted')
      projectDetails: {
        deadline: '2024-06-15',
        progress: 65,
        lastUpdate: '2024-01-15',
        phase: 'Design Development',
        nextMilestone: 'Client Review',
        unreadMessages: 2,
        projectStatus: 'design_phase'
      }
    },
    {
      id: 2,
      projectTitle: 'Corporate Headquarters Renovation',
      client: 'TechCorp Industries',
      proposalTitle: 'Modern Collaborative Workspace',
      submittedDate: '2024-01-12',
      status: 'accepted',
      budget: '$120,000',
      timeline: '20 weeks',
      clientFeedback: 'Great proposal! We\'re excited to start this project.',
      // Project details (available when status is 'accepted')
      projectDetails: {
        deadline: '2024-08-30',
        progress: 85,
        lastUpdate: '2024-01-14',
        phase: 'Final Review',
        nextMilestone: 'Client Approval',
        unreadMessages: 0,
        projectStatus: 'under_review'
      }
    },
    {
      id: 3,
      projectTitle: 'Community Arts Center',
      client: 'City of Portland',
      proposalTitle: 'Cultural Hub Design',
      submittedDate: '2024-01-10',
      status: 'accepted',
      budget: '$45,000',
      timeline: '12 weeks',
      clientFeedback: 'Great vision for the community space. Looking forward to working with you.',
      // Project details (available when status is 'accepted')
      projectDetails: {
        deadline: '2024-01-20',
        progress: 100,
        lastUpdate: '2024-01-10',
        phase: 'Completed',
        nextMilestone: 'Payment Released',
        unreadMessages: 1,
        projectStatus: 'completed'
      }
    },
    {
      id: 4,
      projectTitle: 'Luxury Hotel Design',
      client: 'Oceanview Hospitality',
      proposalTitle: 'Beachfront Resort Experience',
      submittedDate: '2024-01-08',
      status: 'rejected',
      budget: '$200,000',
      timeline: '24 weeks',
      clientFeedback: 'Thank you for your submission. We decided to go with a different design direction.'
    },
    {
      id: 5,
      projectTitle: 'Educational Campus Expansion',
      client: 'University of California',
      proposalTitle: 'Student-Centered Learning Spaces',
      submittedDate: '2024-01-05',
      status: 'under_review',
      budget: '$150,000',
      timeline: '18 weeks'
    },
    {
      id: 6,
      projectTitle: 'Shopping Mall Renovation',
      client: 'Metro Retail Group',
      proposalTitle: 'Modern Retail Experience',
      submittedDate: '2024-01-03',
      status: 'pending',
      budget: '$95,000',
      timeline: '14 weeks'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'under_review': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getProjectStatusColor = (projectStatus) => {
    switch (projectStatus) {
      case 'design_phase': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'revision_needed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectStatusIcon = (projectStatus) => {
    switch (projectStatus) {
      case 'design_phase': return <Clock className="w-4 h-4" />;
      case 'under_review': return <AlertCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredProposals = proposals.filter(proposal => {
    if (activeTab === 'all') return true;
    return proposal.status === activeTab;
  });

  const getTabCount = (status) => {
    if (status === 'all') return proposals.length;
    return proposals.filter(p => p.status === status).length;
  };

  const tabs = [
    { key: 'all', label: 'All Proposals', count: getTabCount('all') },
    { key: 'pending', label: 'Pending', count: getTabCount('pending') },
    { key: 'under_review', label: 'Under Review', count: getTabCount('under_review') },
    { key: 'accepted', label: 'Accepted', count: getTabCount('accepted') },
    { key: 'rejected', label: 'Rejected', count: getTabCount('rejected') }
  ];

  const handleViewProposal = (proposal) => {
    console.log('View proposal:', proposal);
  };

  const handleMessageClient = (proposal) => {
    console.log('Message client for proposal:', proposal);
  };

  const handleUploadDesign = (proposal) => {
    console.log('Upload design for proposal:', proposal);
  };

  return (
    <div className="flex-1 bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
          <p className="text-gray-600 mt-1">Track your submitted proposals and their current status</p>
        </div>
      </div>
      
      <div className="p-8">
        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Proposals</p>
                <p className="text-2xl font-bold text-gray-900">{proposals.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-green-600">{getTabCount('accepted')}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-yellow-600">{getTabCount('under_review')}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{getTabCount('pending')}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Proposal Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {proposal.proposalTitle}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(proposal.status)}`}>
                      {getStatusIcon(proposal.status)}
                      <span className="capitalize">{proposal.status.replace('_', ' ')}</span>
                    </span>
                    {proposal.projectDetails?.unreadMessages > 0 && (
                      <div className="relative">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-1">Project: <span className="font-medium">{proposal.projectTitle}</span></p>
                  <p className="text-blue-600 font-medium">{proposal.client}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  Submitted: {new Date(proposal.submittedDate).toLocaleDateString()}
                </div>
              </div>

              {/* Basic Proposal Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>Budget: {proposal.budget}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Timeline: {proposal.timeline}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Status: {proposal.status.replace('_', ' ')}</span>
                </div>
              </div>



              {/* Client Feedback */}
              {proposal.clientFeedback && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-1">Client Feedback:</p>
                  <p className="text-sm text-gray-600">{proposal.clientFeedback}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleViewProposal(proposal)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                
                {/* Upload Design button for accepted proposals in design phase */}
                {proposal.status === 'accepted' && 
                 proposal.projectDetails?.projectStatus === 'design_phase' && (
                  <button 
                    onClick={() => handleUploadDesign(proposal)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload Design</span>
                  </button>
                )}
                
                <button 
                  onClick={() => handleMessageClient(proposal)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Message Client</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProposals.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab === 'all' ? '' : activeTab} proposals found
            </h3>
            <p className="text-gray-500 mb-4">
              {activeTab === 'all' 
                ? 'Start by browsing available projects and submitting your first proposal.'
                : `You don't have any ${activeTab} proposals yet.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposals;