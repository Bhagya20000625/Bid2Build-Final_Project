import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckCircle, 
  Bell, 
  Settings,
  Shield,
  FileText,
  BarChart3
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Users',
      href: '/admin/dashboard/users',
      icon: Users,
      badge: null // We'll add dynamic counts later
    },
    {
      name: 'Verifications',
      href: '/admin/dashboard/verifications',
      icon: CheckCircle,
      badge: null // We'll add pending count later
    },
    {
      name: 'Notifications',
      href: '/admin/dashboard/notifications',
      icon: Bell,
      badge: null // We'll add unread count later
    }
  ];

  const isActive = (href, exact = false) => {
    if (exact) {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo Area */}
      <div className="bg-blue-600 p-6">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-white text-lg font-bold">Bid2Build</h1>
            <p className="text-blue-100 text-sm">Admin Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                <span>{item.name}</span>
              </div>
              
              {/* Badge for counts (if any) */}
              {item.badge && (
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Admin Info Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="bg-blue-100 p-2 rounded-full">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              Admin Access
            </p>
            <p className="text-xs text-gray-500">
              Platform Management
            </p>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="p-4 text-center">
        <p className="text-xs text-gray-400">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default AdminSidebar;