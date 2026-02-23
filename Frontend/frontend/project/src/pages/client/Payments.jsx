import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, CheckCircle, Clock, Download, CreditCard } from 'lucide-react';
import paymentService from '../../services/paymentService';

const Payments = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingPayments, setPendingPayments] = useState([]);
  const [completedPayments, setCompletedPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalPending: 0,
    monthlyTotal: 0,
    averagePayment: 0
  });

  // Load payments on component mount
  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.id;

      if (!userId) {
        setError('User not found. Please log in again.');
        return;
      }

      console.log('📤 Fetching payments for user ID:', userId);

      // Fetch real payments from API
      const result = await paymentService.getClientPayments(userId);

      console.log('📊 Payments received:', result);

      if (result.success && result.payments) {
        // Separate pending and completed payments
        const pending = result.payments.filter(p => p.payment_status === 'pending');
        const completed = result.payments.filter(p => p.payment_status === 'completed');

        setPendingPayments(pending);
        setCompletedPayments(completed);

        // Calculate stats
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const monthlyPayments = completed.filter(p => {
          const paidDate = new Date(p.transaction_date);
          return paidDate.getMonth() === currentMonth && paidDate.getFullYear() === currentYear;
        });

        const monthlyTotal = monthlyPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
        const avgPayment = result.payments.length > 0
          ? result.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0) / result.payments.length
          : 0;

        setStats({
          totalPaid: result.totalPaid || 0,
          totalPending: result.totalPending || 0,
          monthlyTotal: monthlyTotal,
          averagePayment: avgPayment
        });
      }

    } catch (error) {
      console.error('Load payments error:', error);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentRelease = async (paymentId) => {
    try {
      setLoading(true);
      console.log('💰 Releasing payment:', paymentId);

      // Update payment status to completed
      const result = await paymentService.updatePaymentStatus(paymentId, 'completed');

      if (result.success) {
        alert('Payment released successfully!');
        // Reload payments to update the UI
        await loadPayments();
      } else {
        alert('Failed to release payment: ' + (result.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment release error:', error);
      alert('Failed to release payment. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <p className="text-2xl font-bold text-gray-900">${stats.totalPaid.toLocaleString()}</p>
          <p className="text-sm text-green-600 mt-1">Completed payments</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Pending</h3>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.totalPending.toLocaleString()}</p>
          <p className="text-sm text-amber-600 mt-1">{pendingPayments.length} pending</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">This Month</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.monthlyTotal.toLocaleString()}</p>
          <p className="text-sm text-blue-600 mt-1">Current month</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Average Payment</h3>
            <CreditCard className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">${stats.averagePayment.toLocaleString()}</p>
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
            pendingPayments.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Payments</h3>
                <p className="text-gray-500">You don't have any pending milestone payments at the moment.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingPayments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Display different titles based on payment type */}
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {payment.design_title || payment.milestone_name || 'Payment'}
                        </h3>
                        {payment.design_title && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            Architectural Design
                          </span>
                        )}
                        {payment.milestone_name && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Milestone
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{payment.project_name}</p>
                      <p className="text-sm text-gray-500 mb-3">{payment.design_description || payment.milestone_description}</p>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{payment.bidder_role === 'architect' ? 'Architect' : 'Contractor'}:</span> {payment.payee_first_name} {payment.payee_last_name}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {new Date(payment.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Payment ID:</span> #{payment.id}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-gray-900 mb-1">${parseFloat(payment.amount).toLocaleString()}</div>
                      {payment.progress_percentage && (
                        <div className="flex items-center space-x-2 mb-3">
                          <span className="text-sm text-gray-500">Progress:</span>
                          <span className="text-sm font-medium text-green-600">{parseFloat(payment.progress_percentage).toFixed(0)}%</span>
                        </div>
                      )}
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
          )
        ) : (
            completedPayments.length === 0 ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Payment History</h3>
                <p className="text-gray-500">You haven't completed any payments yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedPayments.map((payment) => (
                <div key={payment.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {payment.design_title || payment.milestone_name || 'Payment'}
                        </h3>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Paid
                        </span>
                        {payment.design_title && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                            Architectural Design
                          </span>
                        )}
                        {payment.milestone_name && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                            Milestone
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{payment.project_name}</p>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{payment.bidder_role === 'architect' ? 'Architect' : 'Contractor'}:</span><br />
                          {payment.payee_first_name} {payment.payee_last_name}
                        </div>
                        <div>
                          <span className="font-medium">Paid Date:</span><br />
                          {payment.transaction_date ? new Date(payment.transaction_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div>
                          <span className="font-medium">Method:</span><br />
                          {payment.payment_method || 'Bank Transfer'}
                        </div>
                        <div>
                          <span className="font-medium">Transaction ID:</span><br />
                          {payment.transaction_reference || `PAY-${payment.id}`}
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="text-2xl font-bold text-green-600 mb-2">${parseFloat(payment.amount).toLocaleString()}</div>
                      <button
                        onClick={() => handleDownloadInvoice(payment.id)}
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
          )
        )}
        </div>
      </div>
    </div>
  );
};

export default Payments;