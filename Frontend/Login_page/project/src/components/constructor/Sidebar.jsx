import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Search, 
  TrendingUp, 
  CreditCard, 
  MessageCircle,
  User,
  Building2,
  LogOut
} from 'lucide-react';

const Sidebar = ({ notifications }) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'browse-projects', label: 'Browse Projects', icon: Search, to: '/constructor-dashboard/browse-projects' },
    { id: 'update-progress', label: 'Update Progress', icon: TrendingUp, to: '/constructor-dashboard/update-progress' },
    { id: 'payments', label: 'Payments', icon: CreditCard, to: '/constructor-dashboard/payments' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, to: '/constructor-dashboard/messages', hasNotification: true },
  ];

  const handleLogout = () => {
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
            <p className="text-sm text-gray-500">Constructor Dashboard</p>
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

      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">John Smith</p>
              <p className="text-xs text-gray-500">Constructor</p>
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