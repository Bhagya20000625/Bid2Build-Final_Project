import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Building, 
  FileText, 
  Upload, 
  MessageCircle, 
  CreditCard,
  Briefcase,
  User,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: Building, label: 'Browse Projects' },
    { to: '/proposals', icon: FileText, label: 'My Proposals' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/payments', icon: CreditCard, label: 'Payments' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bid2Build</h1>
            <p className="text-sm text-gray-500">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">John Architect</p>
            <p className="text-xs text-gray-500">Senior Architect</p>
          </div>
          <Settings className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;