import React from 'react';
import { Package, FileText, CheckCircle, DollarSign, TrendingUp, Clock } from 'lucide-react';

const SupplierHome = () => {
  // Mock data - replace with actual API calls
  const stats = {
    totalRequests: 45,
    activeQuotations: 12,
    completedOrders: 28,
    pendingPayments: 3,
    totalEarnings: 125000,
    monthlyGrowth: 15.2
  };

  const recentActivity = [
    {
      id: 1,
      type: 'quotation',
      title: 'Steel Beams Quotation',
      client: 'Johnson Construction',
      amount: 45000,
      status: 'pending',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'order',
      title: 'Concrete Mix Delivery',
      client: 'ABC Builders',
      amount: 18500,
      status: 'completed',
      time: '1 day ago'
    },
    {
      id: 3,
      type: 'request',
      title: 'New Material Request',
      client: 'Metro Projects',
      amount: null,
      status: 'new',
      time: '3 hours ago'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case 'quotation': return <FileText className="w-4 h-4" />;
      case 'order': return <Package className="w-4 h-4" />;
      case 'request': return <Clock className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Supplier Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.totalRequests}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Requests</h3>
          <p className="text-xs text-gray-500">Material requests available</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.activeQuotations}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Active Quotations</h3>
          <p className="text-xs text-gray-500">Pending client review</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.completedOrders}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Completed Orders</h3>
          <p className="text-xs text-gray-500">Successfully delivered</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Pending Payments</h3>
          <p className="text-xs text-gray-500">Awaiting payment</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">${stats.totalEarnings.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Total Earnings</h3>
          <p className="text-xs text-gray-500">All time revenue</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">+{stats.monthlyGrowth}%</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Growth</h3>
          <p className="text-xs text-gray-500">Compared to last month</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <p className="text-gray-600">Your latest business activities and updates</p>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    {getStatusIcon(activity.type)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">{activity.title}</h3>
                    <p className="text-sm text-gray-600">{activity.client}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {activity.amount && (
                    <span className="text-lg font-bold text-gray-900">
                      ${activity.amount.toLocaleString()}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-gray-600">Common tasks to get you started</p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors duration-200 text-center">
              <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900">Browse Material Requests</h3>
              <p className="text-xs text-gray-500">Find new opportunities</p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors duration-200 text-center">
              <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900">Review Quotations</h3>
              <p className="text-xs text-gray-500">Check pending quotes</p>
            </button>
            
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors duration-200 text-center">
              <DollarSign className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <h3 className="text-sm font-medium text-gray-900">View Payments</h3>
              <p className="text-xs text-gray-500">Track your earnings</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierHome;