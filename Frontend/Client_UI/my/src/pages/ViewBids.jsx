import React, { useState } from 'react';
import { Star, Clock, DollarSign, CheckCircle, X, Eye } from 'lucide-react';

const ViewBids = () => {
  const [selectedProject, setSelectedProject] = useState('downtown-office');

  const projects = [
    { id: 'downtown-office', name: 'Downtown Office Complex', bids: 8 },
    { id: 'residential-project', name: 'Residential Development', bids: 12 },
    { id: 'retail-store', name: 'Retail Store Renovation', bids: 5 }
  ];

  const bids = [
    {
      id: 1,
      bidderName: 'ABC Construction Co.',
      bidderType: 'Contractor',
      bidAmount: 125000,
      proposedTimeline: '4 months',
      rating: 4.8,
      reviewCount: 156,
      submittedDate: '2024-01-15',
      status: 'pending',
      experience: '15+ years',
      description: 'We specialize in commercial construction with a focus on modern office buildings. Our team has completed over 50 similar projects.',
      pastProjects: ['City Hall Renovation', 'Tech Hub Office Complex', 'Financial District Building']
    },
    {
      id: 2,
      bidderName: 'BuildMaster Ltd.',
      bidderType: 'Contractor',
      bidAmount: 118500,
      proposedTimeline: '5 months',
      rating: 4.6,
      reviewCount: 89,
      submittedDate: '2024-01-16',
      status: 'pending',
      experience: '12+ years',
      description: 'Experienced in large-scale commercial projects with emphasis on sustainable building practices and energy efficiency.',
      pastProjects: ['Green Office Tower', 'Corporate Headquarters', 'Medical Center Expansion']
    },
    {
      id: 3,
      bidderName: 'Premier Builders',
      bidderType: 'Contractor',
      bidAmount: 132000,
      proposedTimeline: '3.5 months',
      rating: 4.9,
      reviewCount: 234,
      submittedDate: '2024-01-14',
      status: 'pending',
      experience: '20+ years',
      description: 'Award-winning construction company known for high-quality craftsmanship and on-time delivery. We use premium materials and latest construction techniques.',
      pastProjects: ['Luxury Hotel Construction', 'Banking Center', 'Government Building']
    },
    {
      id: 4,
      bidderName: 'Steel & Stone Suppliers',
      bidderType: 'Supplier',
      bidAmount: 45000,
      proposedTimeline: '2 weeks delivery',
      rating: 4.7,
      reviewCount: 67,
      submittedDate: '2024-01-17',
      status: 'pending',
      experience: '10+ years',
      description: 'Premium construction materials supplier with focus on steel and stone products. We guarantee quality and timely delivery.',
      pastProjects: ['Material supply for 20+ buildings', 'Infrastructure projects', 'Residential developments']
    },
    {
      id: 5,
      bidderName: 'DUMMY BID - Test Constructor',
      bidderType: 'Contractor',
      bidAmount: 95000,
      proposedTimeline: '6 months',
      rating: 5.0,
      reviewCount: 42,
      submittedDate: '2024-01-20',
      status: 'pending',
      experience: '8+ years',
      description: 'This is a DUMMY BID for testing purposes. We offer excellent construction services with modern techniques and quality materials.',
      pastProjects: ['Dummy Project 1', 'Test Building Complex', 'Sample Construction Work']
    }
  ];

  const handleBidAction = (bidId, action) => {
    console.log(`${action} bid ${bidId}`);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">View Bids</h1>
        <p className="text-gray-600">Review and manage bids for your projects</p>
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
              <h3 className="font-medium text-gray-900">{project.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{project.bids} bids received</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {bids.map((bid) => (
          <div key={bid.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{bid.bidderName}</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    bid.bidderType === 'Contractor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {bid.bidderType}
                  </span>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(bid.rating)}
                    <span className="ml-1 font-medium">{bid.rating}</span>
                    <span className="text-gray-400">({bid.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{bid.experience}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{bid.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Bid Amount</p>
                      <p className="font-semibold text-gray-900">${bid.bidAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Timeline</p>
                      <p className="font-semibold text-gray-900">{bid.proposedTimeline}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-semibold text-gray-900">{new Date(bid.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Past Projects</h4>
                  <div className="flex flex-wrap gap-2">
                    {bid.pastProjects.map((project, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {project}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => console.log('View Details clicked for bid:', bid.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200 bg-gray-100 px-3 py-2 rounded-lg"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">View Details</span>
              </button>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleBidAction(bid.id, 'reject')}
                  className="flex items-center space-x-2 px-4 py-2 border-2 border-red-400 text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium"
                >
                  <X className="w-4 h-4" />
                  <span>REJECT</span>
                </button>
                <button
                  onClick={() => handleBidAction(bid.id, 'accept')}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium border-2 border-green-600"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>ACCEPT</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewBids;