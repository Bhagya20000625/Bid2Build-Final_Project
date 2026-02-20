import React, { useState, useEffect } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Trash2 } from 'lucide-react';
import bidService from '../../services/bidService';

const Quotations = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(null);

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const data = await bidService.getBidderBids(user.id);

      // Filter only material request quotations
      const materialQuotations = data.bids?.filter(bid => bid.bid_type === 'material_request') || [];
      setQuotations(materialQuotations);
    } catch (error) {
      console.error('Failed to load quotations:', error);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (quotation) => {
    setSelectedQuotation(quotation);
    setShowDetailsModal(true);
  };


  const handleWithdraw = async (quotationId) => {
    if (!confirm('Are you sure you want to withdraw this quotation? This action cannot be undone.')) {
      return;
    }

    try {
      setWithdrawing(quotationId);
      await bidService.deleteBid(quotationId);
      alert('Quotation withdrawn successfully');
      loadQuotations(); // Refresh the list
    } catch (error) {
      console.error('Failed to withdraw quotation:', error);
      alert('Failed to withdraw quotation');
    } finally {
      setWithdrawing(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredQuotations = quotations.filter(quotation => {
    if (activeTab === 'all') return true;
    return quotation.status === activeTab;
  });

  const stats = {
    total: quotations.length,
    pending: quotations.filter(q => q.status === 'pending').length,
    accepted: quotations.filter(q => q.status === 'accepted').length,
    rejected: quotations.filter(q => q.status === 'rejected').length
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Quotations</h1>
          <p className="text-gray-600">Track and manage your submitted quotations</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Quotations</p>
          <p className="text-2xl font-bold text-green-600">{stats.total}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Quotations</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pending}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Pending Review</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.accepted}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Accepted</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.rejected}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'all', label: 'All Quotations', count: stats.total },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'accepted', label: 'Accepted', count: stats.accepted },
              { id: 'rejected', label: 'Rejected', count: stats.rejected }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        {/* Quotations List */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Loading quotations...</p>
            </div>
          ) : filteredQuotations.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotations found</h3>
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? "You haven't submitted any quotations yet." 
                  : `No ${activeTab} quotations found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuotations.map((quotation) => (
                <div key={quotation.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <FileText className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{quotation.item_title}</h3>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                          {getStatusIcon(quotation.status)}
                          <span className="ml-1">{quotation.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">Client: {quotation.customer_first_name} {quotation.customer_last_name}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Total Cost:</span>
                          <p className="text-lg font-semibold text-green-600">${quotation.bid_amount}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Timeline:</span>
                          <p className="text-gray-600">{quotation.proposed_timeline}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Submitted:</span>
                          <p className="text-gray-600">{new Date(quotation.submitted_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Status:</span>
                          <p className="text-gray-600 capitalize">{quotation.status}</p>
                        </div>
                      </div>

                      {quotation.description && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Quotation Details:</span> {quotation.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewDetails(quotation)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>

                    {quotation.status === 'pending' && (
                      <button
                        onClick={() => handleWithdraw(quotation.id)}
                        disabled={withdrawing === quotation.id}
                        className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>{withdrawing === quotation.id ? 'Withdrawing...' : 'Withdraw'}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Quotation Details</h2>
              <p className="text-gray-600">For: {selectedQuotation.item_title}</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Client Information</h3>
                  <p className="text-gray-600">{selectedQuotation.customer_first_name} {selectedQuotation.customer_last_name}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Status</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedQuotation.status)}`}>
                    {selectedQuotation.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Total Cost</h3>
                  <p className="text-2xl font-bold text-green-600">${selectedQuotation.bid_amount}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Delivery Timeline</h3>
                  <p className="text-gray-600">{selectedQuotation.proposed_timeline}</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Submitted Date</h3>
                <p className="text-gray-600">{new Date(selectedQuotation.submitted_at).toLocaleDateString()}</p>
              </div>

              {selectedQuotation.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Quotation Details</h3>
                  <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedQuotation.description}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Quotations;