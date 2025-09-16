import React, { useState } from 'react';
import { Plus, Package, Star, Clock, CheckCircle, X } from 'lucide-react';
import materialRequestService from '../../services/materialRequestService';

const MaterialsRequest = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const [newRequest, setNewRequest] = useState({
    title: '',
    category: '',
    description: '',
    quantity: '',
    deadline: '',
    specifications: ''
  });

  const activeRequests = [
    {
      id: 1,
      title: 'Steel Beams for Framework',
      category: 'Structural Materials',
      description: 'High-grade steel beams for office building framework',
      quantity: '50 units',
      deadline: '2024-02-15',
      status: 'active',
      bidsReceived: 5,
      postedDate: '2024-01-20'
    },
    {
      id: 2,
      title: 'Concrete Mix & Delivery',
      category: 'Construction Materials',
      description: 'Ready-mix concrete for foundation work',
      quantity: '200 cubic meters',
      deadline: '2024-02-10',
      status: 'active',
      bidsReceived: 8,
      postedDate: '2024-01-18'
    }
  ];

  const supplierBids = [
    {
      id: 1,
      requestId: 1,
      supplierName: 'MetalWorks Supply Co.',
      rating: 4.8,
      reviewCount: 142,
      bidAmount: 45000,
      deliveryTime: '2 weeks',
      description: 'Premium quality steel beams meeting all industry standards. Includes delivery and basic installation support.',
      specifications: ['Grade A steel', 'Certified quality', 'Free delivery within 50 miles'],
      submittedDate: '2024-01-21'
    },
    {
      id: 2,
      requestId: 1,
      supplierName: 'Industrial Steel Solutions',
      rating: 4.6,
      reviewCount: 89,
      bidAmount: 42500,
      deliveryTime: '10 days',
      description: 'High-quality structural steel with quick delivery. Competitive pricing and excellent customer service.',
      specifications: ['ISO certified', 'Fast delivery', '24/7 support'],
      submittedDate: '2024-01-22'
    },
    {
      id: 3,
      requestId: 2,
      supplierName: 'ConcretePro Mix',
      rating: 4.9,
      reviewCount: 256,
      bidAmount: 18500,
      deliveryTime: '3 days',
      description: 'Premium ready-mix concrete with on-time delivery guarantee. Custom mix designs available.',
      specifications: ['High strength mix', 'On-time guarantee', 'Custom designs'],
      submittedDate: '2024-01-19'
    }
  ];

  const handleNewRequestSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🔍 ===== MATERIAL REQUEST SUBMISSION STARTED =====');
    console.log('🎯 Form submitted, preventing default behavior');
    
    try {
      // Get customer_id from localStorage or context
      console.log('💾 Reading user data from localStorage...');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const customerId = user.customer_id || user.id;
      
      console.log('👤 User data:', user);
      console.log('🆔 Customer ID:', customerId);
      console.log('🧪 Customer ID type:', typeof customerId);
      
      // Validate we have a customer_id
      if (!customerId) {
        console.error('❌ No customer ID found');
        alert('Unable to identify customer. Please log in again.');
        return;
      }
      
      console.log('📝 Current form data:', newRequest);
      
      const requestData = {
        ...newRequest,
        customer_id: parseInt(customerId) // Ensure it's a number
      };
      
      console.log('📦 Final request data to send:', requestData);
      console.log('🌐 Target URL:', 'http://localhost:5000/api/material-requests');
      console.log('📡 Request method: POST');
      console.log('📋 Request headers: Content-Type: application/json');
      console.log('🎁 Request body:', JSON.stringify(requestData));

      console.log('🚀 Initiating fetch request...');
      // Direct API call without authentication
      const response = await fetch('http://localhost:5000/api/material-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      
      console.log('✅ Fetch request completed');
      console.log('📡 Response status:', response.status);
      console.log('📡 Response status text:', response.statusText);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
      
      console.log('🔄 Parsing response JSON...');
      const result = await response.json();
      console.log('📋 Response data:', result);
      
      if (!response.ok) {
        console.error('❌ Response not OK, throwing error');
        throw new Error(result.message || 'Failed to create material request');
      }
      
      console.log('🎉 Success! Material request created');
      // Success feedback
      alert('Material request posted successfully!');
      
      setShowNewRequest(false);
      setNewRequest({
        title: '',
        category: '',
        description: '',
        quantity: '',
        deadline: '',
        specifications: ''
      });
      
      console.log('✅ Form reset and modal closed');
      
    } catch (error) {
      console.error('🚨 ===== ERROR OCCURRED =====');
      console.error('❌ Error type:', error.constructor.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      console.error('❌ Full error object:', error);
      
      // Log additional debug info
      console.error('🔍 User data from localStorage:', JSON.parse(localStorage.getItem('user') || '{}'));
      
      // Show detailed error message
      let errorMessage = 'Failed to post material request.\n\n';
      
      if (error.response && error.response.data) {
        console.error('📡 Server response error data:', error.response.data);
        errorMessage += error.response.data.message || 'Server error occurred.';
        if (error.response.data.errors) {
          const errorDetails = error.response.data.errors.map(err => `• ${err.message}`).join('\n');
          errorMessage += '\n\nValidation errors:\n' + errorDetails;
        }
      } else if (error.message) {
        errorMessage += `Network error: ${error.message}`;
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      console.error('🚨 Final error message:', errorMessage);
      alert(errorMessage);
    }
    
    console.log('🔚 ===== MATERIAL REQUEST SUBMISSION ENDED =====');
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Materials Request</h1>
          <p className="text-gray-600">Request construction materials and manage supplier bids</p>
        </div>
        <button
          onClick={() => setShowNewRequest(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>New Request</span>
        </button>
      </div>

      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">New Materials Request</h2>
            </div>
            
            <form onSubmit={handleNewRequestSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Request Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Steel Beams for Framework"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="structural">Structural Materials</option>
                    <option value="concrete">Concrete & Masonry</option>
                    <option value="electrical">Electrical Supplies</option>
                    <option value="plumbing">Plumbing Materials</option>
                    <option value="finishing">Finishing Materials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity Needed</label>
                  <input
                    type="text"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 50 units, 200 cubic meters"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                <input
                  type="date"
                  value={newRequest.deadline}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, deadline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of the materials needed..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                <textarea
                  value={newRequest.specifications}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, specifications: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Technical specifications, quality requirements, etc..."
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowNewRequest(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Post Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('active')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'active'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active Requests ({activeRequests.length})
            </button>
            <button
              onClick={() => setActiveTab('bids')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'bids'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Supplier Bids ({supplierBids.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'active' ? (
            <div className="space-y-6">
              {activeRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {request.category}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Quantity:</span><br />
                          {request.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span><br />
                          {new Date(request.deadline).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Bids Received:</span><br />
                          {request.bidsReceived} suppliers
                        </div>
                        <div>
                          <span className="font-medium">Posted:</span><br />
                          {new Date(request.postedDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
                      View Bids
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {supplierBids.map((bid) => (
                <div key={bid.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{bid.supplierName}</h3>
                        <div className="flex items-center space-x-1">
                          {renderStars(bid.rating)}
                          <span className="ml-1 text-sm font-medium">{bid.rating}</span>
                          <span className="text-sm text-gray-400">({bid.reviewCount} reviews)</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{bid.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Bid Amount</p>
                          <p className="text-xl font-semibold text-green-600">${bid.bidAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Delivery Time</p>
                          <p className="text-lg font-semibold text-gray-900">{bid.deliveryTime}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Submitted</p>
                          <p className="text-lg font-semibold text-gray-900">{new Date(bid.submittedDate).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {bid.specifications.map((spec, index) => (
                            <span 
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleBidAction(bid.id, 'reject')}
                      className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleBidAction(bid.id, 'accept')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Bid</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsRequest;