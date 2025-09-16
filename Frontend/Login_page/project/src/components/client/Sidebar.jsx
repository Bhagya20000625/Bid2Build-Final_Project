import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';

const Sidebar = ({ notifications }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, to: '/customer-dashboard' },
    { id: 'post-project', label: 'Post Project', icon: Plus, to: '/customer-dashboard/post-project' },
    { id: 'view-bids', label: 'View Bids', icon: Eye, to: '/customer-dashboard/view-bids' },
    { id: 'project-progress', label: 'Project Progress', icon: BarChart3, to: '/customer-dashboard/project-progress' },
    { id: 'payments', label: 'Payments', icon: CreditCard, to: '/customer-dashboard/payments' },
    { id: 'materials', label: 'Materials', icon: Package, to: '/customer-dashboard/materials' },
    { id: 'messaging', label: 'Messages', icon: MessageCircle, to: '/customer-dashboard/messaging', hasNotification: true },
    { id: 'profile', label: 'Profile', icon: User, to: '/customer-dashboard/profile' },
  ];

  const handleLogout = () => {
    // Clear any stored user data if you have any
    navigate('/login');
  };

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
            
            return (
              <li key={item.id}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.hasNotification && notifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
              <p className="text-xs text-gray-500">Project Owner</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;