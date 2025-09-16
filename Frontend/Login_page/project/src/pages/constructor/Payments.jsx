import React from 'react';
import { DollarSign, Calendar, Clock, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

const Payments = () => {
  const paymentSummary = {
    totalEarnings: 125000,
    pendingPayments: 258000,
    thisMonth: 18500,
    nextPayment: 12000
  };

  const milestones = [
    {
      id: 1,
      project: 'Residential Kitchen Remodel',
      milestone: 'Project Completion',
      amount: 12000,
      dueDate: '2025-01-25',
      status: 'Pending Approval',
      progress: 100
    },
    {
      id: 2,
      project: 'Office Building Renovation',
      milestone: 'Phase 2 - Electrical Work',
      amount: 25000,
      dueDate: '2025-02-10',
      status: 'In Progress',
      progress: 75
    },
    {
      id: 3,
      project: 'Warehouse Construction',
      milestone: 'Foundation Complete',
      amount: 50000,
      dueDate: '2025-03-01',
      status: 'Upcoming',
      progress: 20
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      project: 'School Playground Installation',
      milestone: 'Project Completion',
      amount: 15000,
      paidDate: '2025-01-15',
      status: 'Paid',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      project: 'Residential Kitchen Remodel',
      milestone: 'Phase 1 - Demolition',
      amount: 8000,
      paidDate: '2025-01-10',
      status: 'Paid',
      paymentMethod: 'Check'
    },
    {
      id: 3,
      project: 'Office Building Renovation',
      milestone: 'Phase 1 - Planning',
      amount: 18000,
      paidDate: '2025-01-05',
      status: 'Paid',
      paymentMethod: 'Bank Transfer'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Upcoming':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Paid':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Pending Approval':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'In Progress':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'Overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Payments & Milestones</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">
                ${paymentSummary.totalEarnings.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                ${paymentSummary.pendingPayments.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                ${paymentSummary.thisMonth.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Payment</p>
              <p className="text-2xl font-bold text-gray-900">
                ${paymentSummary.nextPayment.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Milestones</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(milestone.status)}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{milestone.milestone}</h3>
                    <p className="text-sm text-gray-600">{milestone.project}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    ${milestone.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Due {new Date(milestone.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                    {milestone.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Progress:</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                  <span>{milestone.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project & Milestone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paymentHistory.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{payment.milestone}</div>
                      <div className="text-sm text-gray-600">{payment.project}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(payment.paidDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;