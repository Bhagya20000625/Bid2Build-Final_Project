import React, { useState } from 'react';
import Header from '../components/Header';
import { DollarSign, Calendar, CheckCircle, Clock, Download, Eye, CreditCard, TrendingUp } from 'lucide-react';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const paymentSummary = {
    totalEarnings: 285000,
    pendingPayments: 45000,
    thisMonth: 75000,
    completedProjects: 12
  };

  const payments = [
    {
      id: 1,
      projectTitle: 'Modern Residential Complex',
      client: 'Green Valley Development',
      amount: 75000,
      status: 'completed',
      releaseDate: '2024-01-20',
      milestone: 'Final Design Approval',
      invoiceNumber: 'INV-2024-001'
    },
    {
      id: 2,
      projectTitle: 'Corporate Headquarters Renovation',
      client: 'TechCorp Industries',
      amount: 120000,
      status: 'pending',
      expectedDate: '2024-02-15',
      milestone: 'Design Development Phase',
      invoiceNumber: 'INV-2024-002'
    },
    {
      id: 3,
      projectTitle: 'Community Arts Center',
      client: 'City of Portland',
      amount: 45000,
      status: 'completed',
      releaseDate: '2024-01-15',
      milestone: 'Schematic Design',
      invoiceNumber: 'INV-2024-003'
    },
    {
      id: 4,
      projectTitle: 'Luxury Hotel Design',
      client: 'Oceanview Hospitality',
      amount: 200000,
      status: 'pending',
      expectedDate: '2024-03-01',
      milestone: 'Concept Design Review',
      invoiceNumber: 'INV-2024-004'
    }
  ];

  const monthlyEarnings = [
    { month: 'Jan 2024', amount: 75000 },
    { month: 'Dec 2023', amount: 65000 },
    { month: 'Nov 2023', amount: 45000 },
    { month: 'Oct 2023', amount: 55000 },
    { month: 'Sep 2023', amount: 45000 },
    { month: 'Aug 2023', amount: 0 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredPayments = payments.filter(payment => {
    if (activeTab === 'overview') return true;
    if (activeTab === 'completed') return payment.status === 'completed';
    if (activeTab === 'pending') return payment.status === 'pending';
    return true;
  });

  return (
    <div className="flex-1 bg-gray-50">
      <Header 
        title="Payments & Earnings" 
        subtitle="Track your project payments and financial overview"
      />
      
      <div className="p-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Earnings</h3>
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${paymentSummary.totalEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending Payments</h3>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${paymentSummary.pendingPayments.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">2 payments pending</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">This Month</h3>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              ${paymentSummary.thisMonth.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 mt-1">1 project completed</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completed Projects</h3>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{paymentSummary.completedProjects}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Payments
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'completed'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'pending'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payments List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Payment History</h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {filteredPayments.map((payment) => (
                  <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {payment.projectTitle}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm">{payment.client}</p>
                        <p className="text-gray-600 text-sm">{payment.milestone}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900">
                          ${payment.amount.toLocaleString()}
                        </p>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="capitalize">{payment.status}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Invoice: {payment.invoiceNumber}</span>
                        <span>
                          {payment.status === 'completed' 
                            ? `Paid: ${new Date(payment.releaseDate).toLocaleDateString()}`
                            : `Expected: ${new Date(payment.expectedDate).toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-500 hover:text-blue-600">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Earnings Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Earnings</h2>
            
            <div className="space-y-4">
              {monthlyEarnings.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{month.month}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(month.amount / 75000) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-16 text-right">
                      ${month.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Methods */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Bank Transfer</p>
                    <p className="text-xs text-gray-500">Primary method</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;