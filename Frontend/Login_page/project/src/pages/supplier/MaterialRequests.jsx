import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Package, FileText, Eye, Send, RefreshCw } from 'lucide-react';

const MaterialRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const [quotationForm, setQuotationForm] = useState({
    pricePerUnit: '',
    totalCost: '',
    deliveryTimeline: '',
    discountPercentage: '',
    bulkOfferDetails: '',
    notes: ''
  });

  useEffect(() => {
    fetchMaterialRequests();
    
    // Auto-refresh every 30 seconds to show new requests
    const interval = setInterval(() => {
      fetchMaterialRequests();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, categoryFilter]);

  const fetchMaterialRequests = async () => {
    try {
      if (!refreshing) {
        setLoading(true);
      }
      
      // Direct API call to get all material requests
      const response = await fetch('http://localhost:5000/api/material-requests');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.materialRequests)) {
        setRequests(data.materialRequests);
      } else {
        console.error('Unexpected API response format:', data);
        setRequests([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch material requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterRequests = () => {
    let filtered = requests;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request => 
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(request => request.category === categoryFilter);
    }

    setFilteredRequests(filtered);
  };

  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };

  const handleSubmitQuotation = (request) => {
    setSelectedRequest(request);
    setShowQuotationModal(true);
  };

  const submitQuotation = async () => {
    try {
      // TODO: Implement quotation submission API
      console.log('Submitting quotation:', {
        materialRequestId: selectedRequest.id,
        ...quotationForm
      });
      
      alert('Quotation submitted successfully!');
      setShowQuotationModal(false);
      setQuotationForm({
        pricePerUnit: '',
        totalCost: '',
        deliveryTimeline: '',
        discountPercentage: '',
        bulkOfferDetails: '',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to submit quotation:', error);
      alert('Failed to submit quotation. Please try again.');
    }
  };


  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'structural', label: 'Structural Materials' },
    { value: 'concrete', label: 'Concrete & Masonry' },
    { value: 'electrical', label: 'Electrical Supplies' },
    { value: 'plumbing', label: 'Plumbing Materials' },
    { value: 'finishing', label: 'Finishing Materials' }
  ];

  const getCategoryColor = (category) => {
    const colors = {
      structural: 'bg-blue-100 text-blue-800',
      concrete: 'bg-gray-100 text-gray-800',
      electrical: 'bg-yellow-100 text-yellow-800',
      plumbing: 'bg-green-100 text-green-800',
      finishing: 'bg-purple-100 text-purple-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent"></div>
        <span className="ml-2 text-gray-600">Loading material requests...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8" key={requests.length}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Material Requests</h1>
          <p className="text-gray-600">Browse available material requests and submit quotations</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              setRefreshing(true);
              fetchMaterialRequests();
            }}
            disabled={loading || refreshing}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Requests</p>
            <p className="text-2xl font-bold text-green-600">{requests.length}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search material requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
          
          <div className="lg:w-64">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 appearance-none"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Material Requests List */}
      <div className="space-y-6">
        {/* Always render the cards if we have data */}
        {requests.map((request) => (
          <div key={request.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{request.title}</h3>
            <p className="text-gray-600 mb-2">{request.description}</p>
            <div className="text-sm text-gray-500 mb-4">
              <strong>Category:</strong> {request.category} | 
              <strong> Quantity:</strong> {request.quantity} | 
              <strong> Client:</strong> {request.first_name} {request.last_name}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleViewDetails(request)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                View Details
              </button>
              <button
                onClick={() => handleSubmitQuotation(request)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Submit Quotation
              </button>
            </div>
          </div>
        ))}
        
        {/* Fallback message only if truly no data */}
        {requests.length === 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No material requests found</h3>
            <p className="text-gray-600">Try refreshing or check back later for new requests.</p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && !showQuotationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Request Details</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedRequest.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedRequest.category)}`}>
                  {selectedRequest.category}
                </span>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedRequest.description}</p>
              </div>
              
              {selectedRequest.specifications && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Specifications</h4>
                  <p className="text-gray-600">{selectedRequest.specifications}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Quantity Required</h4>
                  <p className="text-gray-600">{selectedRequest.quantity}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Deadline</h4>
                  <p className="text-gray-600">{new Date(selectedRequest.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                <p className="text-gray-600">{selectedRequest.first_name} {selectedRequest.last_name}</p>
                <p className="text-gray-600">{selectedRequest.email}</p>
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
              <button
                onClick={() => handleSubmitQuotation(selectedRequest)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Submit Quotation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quotation Modal */}
      {showQuotationModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Submit Quotation</h2>
              <p className="text-gray-600">For: {selectedRequest.title}</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Unit ($)</label>
                  <input
                    type="number"
                    value={quotationForm.pricePerUnit}
                    onChange={(e) => setQuotationForm(prev => ({ ...prev, pricePerUnit: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Cost ($)</label>
                  <input
                    type="number"
                    value={quotationForm.totalCost}
                    onChange={(e) => setQuotationForm(prev => ({ ...prev, totalCost: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Timeline</label>
                <input
                  type="text"
                  value={quotationForm.deliveryTimeline}
                  onChange={(e) => setQuotationForm(prev => ({ ...prev, deliveryTimeline: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="e.g., 2 weeks, 10 days"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (Optional)</label>
                <input
                  type="number"
                  value={quotationForm.discountPercentage}
                  onChange={(e) => setQuotationForm(prev => ({ ...prev, discountPercentage: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bulk Offer Details (Optional)</label>
                <textarea
                  value={quotationForm.bulkOfferDetails}
                  onChange={(e) => setQuotationForm(prev => ({ ...prev, bulkOfferDetails: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Special offers for bulk orders..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <textarea
                  value={quotationForm.notes}
                  onChange={(e) => setQuotationForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Additional information about your offer..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowQuotationModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={submitQuotation}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Submit Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequests;