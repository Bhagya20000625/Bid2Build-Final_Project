import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('active');

  // Mock data - replace with actual API calls
  const orders = [
    {
      id: 1,
      orderId: 'ORD-2024-001',
      materialRequestTitle: 'Concrete Mix & Delivery',
      clientName: 'ABC Builders',
      clientPhone: '+1 234-567-8900',
      clientEmail: 'contact@abcbuilders.com',
      deliveryAddress: '123 Construction Site, Metro City',
      quantity: '200 cubic meters',
      totalAmount: 19000,
      status: 'active',
      orderDate: '2024-01-20T09:15:00Z',
      deliveryDate: '2024-01-23T00:00:00Z',
      progress: 75,
      notes: 'Delivery scheduled for morning hours. Site contact: John Smith'
    },
    {
      id: 2,
      orderId: 'ORD-2024-002',
      materialRequestTitle: 'Steel Beams for Framework', 
      clientName: 'Johnson Construction',
      clientPhone: '+1 234-567-8901',
      clientEmail: 'john@johnsonconstruction.com',
      deliveryAddress: '456 Building Site, Downtown',
      quantity: '50 units',
      totalAmount: 45000,
      status: 'completed',
      orderDate: '2024-01-15T14:30:00Z',
      deliveryDate: '2024-01-18T00:00:00Z',
      progress: 100,
      notes: 'Successfully delivered and installed. Client very satisfied.'
    },
    {
      id: 3,
      orderId: 'ORD-2024-003',
      materialRequestTitle: 'Electrical Wiring Supplies',
      clientName: 'ElectriPro Services',
      clientPhone: '+1 234-567-8902', 
      clientEmail: 'orders@electripro.com',
      deliveryAddress: '789 Industrial Park, Tech District',
      quantity: '500 meters',
      totalAmount: 7500,
      status: 'preparing',
      orderDate: '2024-01-22T11:20:00Z',
      deliveryDate: '2024-01-25T00:00:00Z',
      progress: 25,
      notes: 'Order confirmed. Materials being prepared for shipment.'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing': return <Clock className="w-4 h-4" />;
      case 'active': return <Truck className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['preparing', 'active'].includes(order.status);
    return order.status === activeTab;
  });

  const stats = {
    total: orders.length,
    active: orders.filter(o => ['preparing', 'active'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // TODO: Implement API call to update order status
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    alert(`Order status updated to: ${newStatus}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
          <p className="text-gray-600">Manage and track your material delivery orders</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Revenue This Month</p>
          <p className="text-2xl font-bold text-green-600">${stats.revenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Orders</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.active}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Active Orders</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">{stats.completed}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Completed</h3>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'active', label: 'Active Orders', count: stats.active },
              { id: 'completed', label: 'Completed', count: stats.completed },
              { id: 'all', label: 'All Orders', count: stats.total }
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

        {/* Orders List */}
        <div className="p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">
                {activeTab === 'all' 
                  ? "You don't have any orders yet." 
                  : `No ${activeTab} orders found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Package className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">{order.materialRequestTitle}</h3>
                        <span className="text-sm font-medium text-gray-500">#{order.orderId}</span>
                        <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                        {/* Order Details */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Order Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="font-medium">{order.quantity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Amount:</span>
                                <span className="font-semibold text-green-600">${order.totalAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Order Date:</span>
                                <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Delivery Date:</span>
                                <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Progress</span>
                              <span className="text-sm text-gray-600">{order.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${order.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        {/* Client Information */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Client Information</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">{order.clientName}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{order.clientPhone}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{order.clientEmail}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                            <div className="flex items-start space-x-2">
                              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                              <span className="text-sm text-gray-600">{order.deliveryAddress}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {order.notes && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{order.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    {order.status === 'preparing' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'active')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    
                    {order.status === 'active' && (
                      <button 
                        onClick={() => updateOrderStatus(order.id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      Contact Client
                    </button>
                    
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      View Details
                    </button>
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

export default Orders;