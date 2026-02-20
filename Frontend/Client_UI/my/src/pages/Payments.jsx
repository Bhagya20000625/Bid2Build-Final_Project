import React, { useState } from 'react';
import { DollarSign, Calendar, CheckCircle, Clock, Download, CreditCard } from 'lucide-react';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('pending');

  const pendingPayments = [
    {
      id: 1,
      projectName: 'Downtown Office Complex',
      milestone: 'Structural Framework Completion',
      contractor: 'ABC Construction Co.',
      amount: 45000,
      dueDate: '2024-01-25',
      progress: 100,
      description: 'Steel framework and concrete structure completed as per specifications',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      projectName: 'Residential Development',
      milestone: 'Foundation Work',
      contractor: 'BuildMaster Ltd.',
      amount: 28500,
      dueDate: '2024-01-28',
      progress: 100,
      description: 'Foundation excavation and concrete pouring completed',
      invoiceNumber: 'INV-2024-002'
    }
  ];

  const completedPayments = [
    {
      id: 3,
      projectName: 'Downtown Office Complex',
      milestone: 'Site Preparation',
      contractor: 'ABC Construction Co.',
      amount: 25000,
      paidDate: '2024-01-15',
      method: 'Bank Transfer',
      invoiceNumber: 'INV-2024-003',
      transactionId: 'TXN-001-2024'
    },
    {
      id: 4,
      projectName: 'Retail Store Renovation',
      milestone: 'Demolition & Cleanup',
      contractor: 'Premier Builders',
      amount: 15000,
      paidDate: '2024-01-10',
      method: 'Check',
      invoiceNumber: 'INV-2024-004',
      transactionId: 'CHK-002-2024'
    },
    {
      id: 5,
      projectName: 'Residential Development',
      milestone: 'Permits & Planning',
      contractor: 'BuildMaster Ltd.',
      amount: 8500,
      paidDate: '2024-01-05',
      method: 'Bank Transfer',
      invoiceNumber: 'INV-2024-005',
      transactionId: 'TXN-003-2024'
    }
  ];

  const handlePaymentRelease = (paymentId) => {
    console.log('Release payment:', paymentId);
  };

  const handleDownloadInvoice = (invoiceNumber) => {
    console.log('Download invoice:', invoiceNumber);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments</h1>
        <p className="text-gray-600">Manage milestone-based payments and view payment history</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">$48,500</p>
          <p className="text-sm text-green-600 mt-1">+$15,000 this month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">$73,500</p>
          <p className="text-sm text-amber-600 mt-1">2 milestones ready</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">$45,000</p>
          <p className="text-sm text-blue-600 mt-1">3 payments made</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Average Payment</h3>
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">$24,250</p>
          <p className="text-sm text-purple-600 mt-1">Per milestone</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'pending'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pending Payments ({pendingPayments.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'completed'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payment History ({completedPayments.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'pending' ? (
            <div className="space-y-6">
              {pendingPayments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{payment.milestone}</h3>
                      <p className="text-gray-600 mb-2">{payment.projectName}</p>
                      <p className="text-sm text-gray-500 mb-3">{payment.description}</p>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Contractor:</span> {payment.contractor}
                        </div>
                        <div>
                          <span className="font-medium">Due Date:</span> {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Invoice:</span> {payment.invoiceNumber}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900 mb-1">${payment.amount.toLocaleString()}</div>
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-sm text-gray-500">Progress:</span>
                        <span className="text-sm font-medium text-green-600">{payment.progress}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDownloadInvoice(payment.invoiceNumber)}
                      className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download Invoice</span>
                    </button>
                    
                    <button
                      onClick={() => handlePaymentRelease(payment.id)}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Release Payment</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {completedPayments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{payment.milestone}</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Paid
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{payment.projectName}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Contractor:</span><br />
                          {payment.contractor}
                        </div>
                        <div>
                          <span className="font-medium">Paid Date:</span><br />
                          {new Date(payment.paidDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Method:</span><br />
                          {payment.method}
                        </div>
                        <div>
                          <span className="font-medium">Transaction ID:</span><br />
                          {payment.transactionId}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-green-600 mb-2">${payment.amount.toLocaleString()}</div>
                      <button
                        onClick={() => handleDownloadInvoice(payment.invoiceNumber)}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Invoice</span>
                      </button>
                    </div>
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

export default Payments;