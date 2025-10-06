import React, { useState, useEffect } from 'react';
import { Package, RefreshCw, Eye, Send, X, CheckCircle } from 'lucide-react';
import bidService from '../../services/bidService';

const MaterialRequestsNew = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [quotationForm, setQuotationForm] = useState({
    pricePerUnit: '',
    totalCost: '',
    deliveryTimeline: '',
    discountPercentage: '',
    bulkOfferDetails: '',
    notes: ''
  });

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/material-requests');
      const data = await response.json();
      console.log('Fetched data:', data);
      
      if (data.success && data.materialRequests) {
        setRequests(data.materialRequests);
      }
    } catch (error) {
      console.error('Error:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmitQuotation = (request) => {
    console.log('🎯 Submit Quotation clicked for:', request.title);
    setSelectedRequest(request);
    setShowQuotationModal(true);
  };

  const submitQuotation = async () => {
    try {
      setSubmitting(true);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      if (!userId) {
        alert('User not found. Please log in again.');
        return;
      }

      // Create quotation description from form fields
      const description = `Price per unit: $${quotationForm.pricePerUnit}, Total: $${quotationForm.totalCost}, Timeline: ${quotationForm.deliveryTimeline}${quotationForm.discountPercentage ? `, Discount: ${quotationForm.discountPercentage}%` : ''}${quotationForm.bulkOfferDetails ? `, Bulk offers: ${quotationForm.bulkOfferDetails}` : ''}${quotationForm.notes ? `, Notes: ${quotationForm.notes}` : ''}`;

      const bidData = {
        material_request_id: selectedRequest.id,
        bidder_user_id: userId,
        bidder_role: 'supplier',
        bid_amount: parseFloat(quotationForm.totalCost),
        proposed_timeline: quotationForm.deliveryTimeline,
        description: description
      };

      console.log('📤 Submitting quotation:', bidData);

      const result = await bidService.createBid(bidData);

      if (result.success) {
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
        // Refresh requests to update bid counts
        fetchRequests();
      }

    } catch (error) {
      console.error('❌ Error submitting quotation:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response?.data);
      alert(`Failed to submit quotation: ${error.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Material Requests</h1>
        <div className="flex items-center space-x-4">
          <button 
            onClick={fetchRequests}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 inline mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh ({requests.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">No material requests found</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="bg-white p-6 rounded-lg shadow border">
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900">{request.title}</h3>
                <p className="text-gray-600">{request.description}</p>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <span className="font-medium">Category:</span>
                  <p>{request.category}</p>
                </div>
                <div>
                  <span className="font-medium">Quantity:</span>
                  <p>{request.quantity}</p>
                </div>
                <div>
                  <span className="font-medium">Client:</span>
                  <p>{request.first_name} {request.last_name}</p>
                </div>
                <div>
                  <span className="font-medium">Deadline:</span>
                  <p>{new Date(request.deadline).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex items-center px-4 py-2 border rounded hover:bg-gray-50">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </button>
                <button
                  onClick={() => handleSubmitQuotation(request)}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Quotation
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
                    required
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
                  required
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
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={submitQuotation}
                disabled={submitting || !quotationForm.totalCost || !quotationForm.deliveryTimeline}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-400"
              >
                {submitting ? 'Submitting...' : 'Submit Quotation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialRequestsNew;