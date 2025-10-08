import React, { useState, useEffect } from 'react';
import { Plus, Package, Star, Clock, CheckCircle, X, DollarSign } from 'lucide-react';
import materialRequestService from '../../services/materialRequestService';
import bidService from '../../services/bidService';

const MaterialsRequest = () => {
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [materialRequests, setMaterialRequests] = useState([]);
  const [supplierQuotations, setSupplierQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingBidStatus, setUpdatingBidStatus] = useState(null);

  const [newRequest, setNewRequest] = useState({
    title: '',
    category: '',
    description: '',
    quantity: '',
    deadline: '',
    specifications: ''
  });

  // Load data on component mount
  useEffect(() => {
    loadMaterialRequests();
    loadSupplierQuotations();
  }, []);

  const loadMaterialRequests = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await materialRequestService.getAllMaterialRequests();
      setMaterialRequests(data.materialRequests || []);
    } catch (error) {
      console.error('Failed to load material requests:', error);
      setMaterialRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSupplierQuotations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await bidService.getCustomerBids(user.id);
      setSupplierQuotations(data.bids || []);
    } catch (error) {
      console.error('Failed to load supplier quotations:', error);
      setSupplierQuotations([]);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await materialRequestService.createMaterialRequest({
        ...newRequest,
        user_id: user.id
      });

      setNewRequest({
        title: '',
        category: '',
        description: '',
        quantity: '',
        deadline: '',
        specifications: ''
      });
      setShowNewRequest(false);
      loadMaterialRequests();
    } catch (error) {
      console.error('Failed to create material request:', error);
      setError('Failed to create material request');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBidStatus = async (bidId, status) => {
    try {
      setUpdatingBidStatus(bidId);
      await bidService.updateBidStatus(bidId, status);
      loadSupplierQuotations(); // Refresh quotations
    } catch (error) {
      console.error('Failed to update bid status:', error);
      alert('Failed to update quotation status');
    } finally {
      setUpdatingBidStatus(null);
    }
  };

  const categories = [
    'structural',
    'concrete',
    'electrical',
    'plumbing',
    'finishing'
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Materials Management</h1>
          <p className="text-gray-600">Manage your material requests and review supplier quotations</p>
        </div>
        <button
          onClick={() => setShowNewRequest(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>New Material Request</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Active Requests ({supplierQuotations.filter(q => q.status === 'accepted' && q.bid_type === 'material_request').length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            My Requests ({materialRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('quotations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'quotations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Supplier Quotations ({supplierQuotations.filter(q => q.status === 'pending' && q.bid_type === 'material_request').length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {activeTab === 'active' && (
          <div className="space-y-6">
            {/* Show only accepted quotations in Active Requests */}
            {supplierQuotations.filter(q => q.status === 'accepted' && q.bid_type === 'material_request').length === 0 && !loading ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No active quotations.</p>
                <p className="text-gray-400 text-sm">Accepted quotations will appear here.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-green-800 border-b border-green-200 pb-2 mb-4">
                  ✅ Active Quotations ({supplierQuotations.filter(q => q.status === 'accepted' && q.bid_type === 'material_request').length})
                </h3>

                <div className="space-y-4">
                  {supplierQuotations.filter(q => q.status === 'accepted' && q.bid_type === 'material_request').map((quotation) => (
                    <div key={quotation.id} className="border border-green-200 bg-green-50 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {quotation.first_name} {quotation.last_name}
                            </h3>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {quotation.user_role}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              ACTIVE
                            </span>
                          </div>

                          <p className="text-gray-600 mb-3">
                            For: <strong>{quotation.item_title}</strong>
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white p-3 rounded">
                              <span className="font-medium text-gray-700">Total Cost:</span>
                              <p className="text-lg font-bold text-green-600">${quotation.bid_amount}</p>
                            </div>
                            <div className="bg-white p-3 rounded">
                              <span className="font-medium text-gray-700">Timeline:</span>
                              <p className="text-gray-900">{quotation.proposed_timeline}</p>
                            </div>
                            <div className="bg-white p-3 rounded">
                              <span className="font-medium text-gray-700">Accepted:</span>
                              <p className="text-gray-600">{new Date(quotation.submitted_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            {materialRequests.length === 0 && !loading ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No material requests yet.</p>
                <p className="text-gray-400 text-sm">Create your first material request to get started.</p>
              </div>
            ) : (
              materialRequests.map((request) => (
                <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Package className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full capitalize">
                          {request.category}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          request.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : request.status === 'awarded'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
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
                          <span className="font-medium">Quotations:</span><br />
                          {request.bid_count || 0} received
                        </div>
                        <div>
                          <span className="font-medium">Posted:</span><br />
                          {new Date(request.created_at).toLocaleDateString()}
                        </div>
                      </div>

                      {request.specifications && (
                        <div className="mt-3">
                          <span className="font-medium text-sm text-gray-700">Specifications:</span>
                          <p className="text-sm text-gray-600">{request.specifications}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setActiveTab('quotations')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200"
                    >
                      View Quotations ({request.bid_count || 0})
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'quotations' && (
          <div className="space-y-6">
            {/* Show only pending quotations in Supplier Quotations */}
            {supplierQuotations.filter(q => q.status === 'pending' && q.bid_type === 'material_request').length === 0 && !loading ? (
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No pending quotations.</p>
                <p className="text-gray-400 text-sm">Quotations from suppliers will appear here for your review.</p>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium text-yellow-800 border-b border-yellow-200 pb-2 mb-4">
                  ⏳ Pending Quotations ({supplierQuotations.filter(q => q.status === 'pending' && q.bid_type === 'material_request').length})
                </h3>

                <div className="space-y-4">
                  {supplierQuotations.filter(q => q.status === 'pending' && q.bid_type === 'material_request').map((quotation) => (
                    <div key={quotation.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {quotation.first_name} {quotation.last_name}
                            </h3>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              {quotation.user_role}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              PENDING
                            </span>
                          </div>

                          <p className="text-gray-600 mb-3">
                            For: <strong>{quotation.item_title}</strong>
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="font-medium text-gray-700">Total Cost:</span>
                              <p className="text-lg font-bold text-green-600">${quotation.bid_amount}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="font-medium text-gray-700">Timeline:</span>
                              <p className="text-gray-900">{quotation.proposed_timeline}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded">
                              <span className="font-medium text-gray-700">Submitted:</span>
                              <p className="text-gray-600">{new Date(quotation.submitted_at).toLocaleDateString()}</p>
                            </div>
                          </div>

                          {quotation.description && (
                            <div className="mt-4 p-3 bg-blue-50 rounded">
                              <span className="font-medium text-sm text-blue-800">Quotation Details:</span>
                              <p className="text-sm text-blue-700 mt-1">{quotation.description}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleUpdateBidStatus(quotation.id, 'rejected')}
                          disabled={updatingBidStatus === quotation.id}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        >
                          {updatingBidStatus === quotation.id ? 'Rejecting...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleUpdateBidStatus(quotation.id, 'accepted')}
                          disabled={updatingBidStatus === quotation.id}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                        >
                          {updatingBidStatus === quotation.id ? 'Accepting...' : 'Accept'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Material Request</h2>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief title for your material request"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={newRequest.category}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newRequest.description}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed description of the materials needed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="text"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 100 bags, 50 m³"
                    required
                  />
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specifications (Optional)</label>
                <textarea
                  value={newRequest.specifications}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, specifications: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Technical specifications, quality requirements, etc."
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
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
                >
                  {loading ? 'Creating...' : 'Create Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialsRequest;