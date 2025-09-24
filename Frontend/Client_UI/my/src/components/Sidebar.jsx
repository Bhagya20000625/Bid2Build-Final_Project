import React from 'react';
import { 
  Home, 
  Plus, 
  Eye, 
  BarChart3, 
  CreditCard, 
  Package, 
  MessageCircle, 
  User,
  Building2,
  X
} 
from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, notifications, isOpen, onClose }) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'post-project', label: 'Post Project', icon: Plus },
    { id: 'view-bids', label: 'View Bids', icon: Eye },
    { id: 'project-progress', label: 'Project Progress', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'messaging', label: 'Messages', icon: MessageCircle, hasNotification: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bid2Build</h2>
              <p className="text-sm text-gray-500">Client Dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close sidebar on mobile after selection
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.hasNotification && notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;