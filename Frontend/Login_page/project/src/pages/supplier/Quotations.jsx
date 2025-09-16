import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle, Eye, Edit, Trash2 } from 'lucide-react';

const Quotations = () => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data - replace with actual API calls
  const quotations = [
    {
      id: 1,
      materialRequestId: 1,
      materialRequestTitle: 'Steel Beams for Framework',
      clientName: 'Johnson Construction',
      pricePerUnit: 900,
      totalCost: 45000,
      deliveryTimeline: '2 weeks',
      status: 'pending',
      submittedAt: '2024-01-21T10:00:00Z',
      respondedAt: null,
      discountPercentage: 5,
      notes: 'Premium quality steel beams with free delivery within 50 miles'
    },
    {
      id: 2,
      materialRequestId: 2,
      materialRequestTitle: 'Concrete Mix & Delivery',
      clientName: 'ABC Builders',
      pricePerUnit: 95,
      totalCost: 19000,
      deliveryTimeline: '3 days',
      status: 'accepted',
      submittedAt: '2024-01-19T14:30:00Z',
      respondedAt: '2024-01-20T09:15:00Z',
      discountPercentage: 0,
      notes: 'On-time delivery guarantee with custom mix designs'
    },
    {
      id: 3,
      materialRequestId: 3,
      materialRequestTitle: 'Electrical Wiring Supplies',
      clientName: 'Metro Projects',
      pricePerUnit: 15,
      totalCost: 7500,
      deliveryTimeline: '1 week',
      status: 'rejected',
      submittedAt: '2024-01-15T16:20:00Z',
      respondedAt: '2024-01-18T11:30:00Z',
      discountPercentage: 10,
      notes: 'Bulk discount available for larger orders'
    }
  ];

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
          {filteredQuotations.length === 0 ? (
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
                        <h3 className="text-lg font-semibold text-gray-900">{quotation.materialRequestTitle}</h3>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                          {getStatusIcon(quotation.status)}
                          <span className="ml-1">{quotation.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">Client: {quotation.clientName}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Price per Unit:</span>
                          <p className="text-lg font-semibold text-green-600">${quotation.pricePerUnit}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Total Cost:</span>
                          <p className="text-lg font-semibold text-green-600">${quotation.totalCost.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Delivery:</span>
                          <p className="text-gray-600">{quotation.deliveryTimeline}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Submitted:</span>
                          <p className="text-gray-600">{new Date(quotation.submittedAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      {quotation.discountPercentage > 0 && (
                        <div className="mt-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {quotation.discountPercentage}% Discount Applied
                          </span>
                        </div>
                      )}

                      {quotation.notes && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Notes:</span> {quotation.notes}
                          </p>
                        </div>
                      )}

                      {quotation.respondedAt && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-500">
                            Response received on {new Date(quotation.respondedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    
                    {quotation.status === 'pending' && (
                      <>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-blue-300 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                          <span>Withdraw</span>
                        </button>
                      </>
                    )}
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

export default Quotations;