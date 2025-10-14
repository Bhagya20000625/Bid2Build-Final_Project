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
  Building2
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, notifications }) => {
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
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bid2Build</h2>
            <p className="text-sm text-gray-500">Client Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {/* notification badge removed */}
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