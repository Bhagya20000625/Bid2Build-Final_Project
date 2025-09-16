import React, { useState } from 'react';
import { DollarSign, Clock, CheckCircle, TrendingUp, Download, Eye } from 'lucide-react';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('pending');

  // Mock data - replace with actual API calls
  const payments = [
    {
      id: 1,
      orderId: 'ORD-2024-001',
      clientName: 'ABC Builders',
      projectTitle: 'Concrete Mix & Delivery',
      amount: 19000,
      status: 'pending',
      dueDate: '2024-01-25T00:00:00Z',
      orderDate: '2024-01-20T09:15:00Z',
      paymentMethod: 'Bank Transfer',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      clientName: 'Johnson Construction',
      projectTitle: 'Steel Beams for Framework',
      amount: 45000,
      status: 'completed',
      dueDate: '2024-01-20T00:00:00Z',
      orderDate: '2024-01-15T14:30:00Z',
      paymentDate: '2024-01-19T10:30:00Z',
      paymentMethod: 'Bank Transfer',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 3,
      orderId: 'ORD-2024-003',
      clientName: 'ElectriPro Services',
      projectTitle: 'Electrical Wiring Supplies',
      amount: 7500,
      status: 'overdue',
      dueDate: '2024-01-15T00:00:00Z',
      orderDate: '2024-01-10T11:20:00Z',
      paymentMethod: 'Check',
      invoiceNumber: 'INV-2024-003'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'overdue': return <Clock className="w-4 h-4" />;
      case 'processing': return <TrendingUp className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (activeTab === 'all') return true;
    return payment.status === activeTab;
  });

  const stats = {
    totalEarnings: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pendingAmount: payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0),
    overdueAmount: payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0),
    completedCount: payments.filter(p => p.status === 'completed').length,
    pendingCount: payments.filter(p => p.status === 'pending').length,
    overdueCount: payments.filter(p => p.status === 'overdue').length
  };

  const downloadInvoice = (payment) => {
    // TODO: Implement invoice download
    console.log(`Downloading invoice for payment ${payment.id}`);
    alert(`Downloading invoice ${payment.invoiceNumber}`);
  };

  const viewInvoice = (payment) => {
    // TODO: Implement invoice viewing
    console.log(`Viewing invoice for payment ${payment.id}`);
    alert(`Viewing invoice ${payment.invoiceNumber}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
          <p className="text-gray-600">Track your earnings and payment history</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="text-2xl font-bold text-green-600">${stats.totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Earnings</h3>
          <p className="text-xs text-gray-500">{stats.completedCount} completed payments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">${stats.pendingAmount.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Payments</h3>
          <p className="text-xs text-gray-500">{stats.pendingCount} pending</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">${stats.overdueAmount.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Overdue Payments</h3>
          <p className="text-xs text-gray-500">{stats.overdueCount} overdue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">+15.2%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Growth</h3>
          <p className="text-xs text-gray-500">Compared to last month</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'pending', label: 'Pending', count: stats.pendingCount },
              { id: 'completed', label: 'Completed', count: stats.completedCount },
              { id: 'overdue', label: 'Overdue', count: stats.overdueCount },
              { id: 'all', label: 'All Payments', count: payments.length }
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

        {/* Payments List */}
        <div className="p-6">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? "You don't have any payment records yet." 
                  : `No ${activeTab} payments found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{payment.projectTitle}</h3>
                        <span className="text-sm font-medium text-gray-500">#{payment.orderId}</span>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">Client: {payment.clientName}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Amount:</span>
                          <p className="text-xl font-bold text-green-600">${payment.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Invoice:</span>
                          <p className="text-gray-600">{payment.invoiceNumber}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Payment Method:</span>
                          <p className="text-gray-600">{payment.paymentMethod}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Due Date:</span>
                          <p className="text-gray-600">{new Date(payment.dueDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">
                            {payment.status === 'completed' ? 'Paid Date:' : 'Order Date:'}
                          </span>
                          <p className="text-gray-600">
                            {payment.status === 'completed' && payment.paymentDate
                              ? new Date(payment.paymentDate).toLocaleDateString()
                              : new Date(payment.orderDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => viewInvoice(payment)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Invoice</span>
                    </button>
                    
                    <button
                      onClick={() => downloadInvoice(payment)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Payment Summary</h2>
          <p className="text-gray-600">Overview of your payment statistics</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">${stats.totalEarnings.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Total Earnings</p>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">${stats.pendingAmount.toLocaleString()}</h3>
              <p className="text-sm text-gray-600">Pending Amount</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900">
                {stats.totalEarnings > 0 ? ((stats.pendingAmount / stats.totalEarnings) * 100).toFixed(1) : 0}%
              </h3>
              <p className="text-sm text-gray-600">Expected Growth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;