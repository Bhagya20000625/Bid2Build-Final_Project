import React, { useState } from 'react';
import { DollarSign, Calendar, FileText, Send, AlertCircle, Upload, Download, Trash2, Eye, Plus } from 'lucide-react';


// ========================
// SubmitBids Component
// ========================
const SubmitBids = () => {
  const [selectedProject, setSelectedProject] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [timeline, setTimeline] = useState('');
  const [proposal, setProposal] = useState('');

  const availableProjects = [
    { id: 1, title: 'Office Building Renovation', budget: '$250,000 - $300,000' },
    { id: 2, title: 'Residential Kitchen Remodel', budget: '$45,000 - $65,000' },
    { id: 3, title: 'Warehouse Construction', budget: '$800,000 - $1,200,000' },
    { id: 4, title: 'School Playground Installation', budget: '$75,000 - $90,000' }
  ];

  const activeBids = [
    { id: 1, projectTitle: 'Office Building Renovation', bidAmount: '$275,000', submittedDate: '2025-01-12', status: 'Under Review', timeline: '12 weeks' },
    { id: 2, projectTitle: 'Residential Kitchen Remodel', bidAmount: '$52,000', submittedDate: '2025-01-10', status: 'Accepted', timeline: '6 weeks' },
    { id: 3, projectTitle: 'School Playground Installation', bidAmount: '$82,000', submittedDate: '2025-01-08', status: 'Rejected', timeline: '8 weeks' }
  ];

  const handleSubmitBid = (e) => {
    e.preventDefault();
    console.log('Bid submitted:', { selectedProject, bidAmount, timeline, proposal });
    setSelectedProject('');
    setBidAmount('');
    setTimeline('');
    setProposal('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900">Submit Bids</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Submit New Bid */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Submit New Bid</h2>
          
          <form onSubmit={handleSubmitBid} className="space-y-6">
            {/* Project */}
            <div>
              <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-2">
                Select Project
              </label>
              <select
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a project...</option>
                {availableProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title} ({project.budget})
                  </option>
                ))}
              </select>
            </div>

            {/* Bid Amount */}
            <div>
              <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Bid Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="bidAmount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter your bid amount"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                Project Timeline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="timeline"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="e.g., 8 weeks, 3 months"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Proposal */}
            <div>
              <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 mb-2">
                Project Proposal
              </label>
              <textarea
                id="proposal"
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                rows={6}
                placeholder="Describe your approach, materials, team, and why you're the best choice for this project..."
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Bid Submission Tips:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Be competitive but realistic with your pricing</li>
                    <li>Include detailed breakdown of materials and labor</li>
                    <li>Highlight your relevant experience and certifications</li>
                    <li>Specify any warranties or guarantees you offer</li>
                  </ul>
                </div>
              </div>
            </div>

          
          </form>
        </div>

        {/* Active Bids */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Your Active Bids</h2>
          
          <div className="space-y-4">
            {activeBids.map((bid) => (
              <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{bid.projectTitle}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                    {bid.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Bid Amount:</span>
                    <p>{bid.bidAmount}</p>
                  </div>
                  <div>
                    <span className="font-medium">Timeline:</span>
                    <p>{bid.timeline}</p>
                  </div>
                  <div>
                    <span className="font-medium">Submitted:</span>
                    <p>{new Date(bid.submittedDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Include BidDocuments component here */}
      <BidDocuments onSubmit={handleSubmitBid} />
    </div>
  );
};


// ========================
// BidDocuments Component
// ========================
const BidDocuments = ({ onSubmit }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      console.log('Files dropped:', e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bid Documents</h1>
       
      </div>

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`h-12 w-12 mx-auto mb-4 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Drop files here or click to upload</h3>
        <p className="text-gray-600 mb-4">Support for PDF, DOC, DOCX, XLS, XLSX files up to 10MB</p>
        <input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx" className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
          <Upload className="h-4 w-4 mr-2" /> Choose Files
        </label>
      </div>

      {/* Submit Button under Bid Documents */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onSubmit}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
        >
          <Send className="h-5 w-5 mr-2" />
          Submit Bid
        </button>
      </div>
    </div>
  );
};


export default SubmitBids;
