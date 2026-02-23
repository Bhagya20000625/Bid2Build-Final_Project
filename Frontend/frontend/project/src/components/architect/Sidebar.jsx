import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Building,
  FileText,
  Upload,
  MessageCircle,
  CreditCard,
  Briefcase,
  User,
  Settings,
  LogOut,
  Bell
} from 'lucide-react';
import userService from '../../services/userService.js';
import NotificationDropdown from '../notifications/NotificationDropdown.jsx';

const Sidebar = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const navItems = [
    { to: '/architect-dashboard', icon: Building, label: 'Browse Projects' },
    { to: '/architect-dashboard/proposals', icon: FileText, label: 'My Proposals' },
    { to: '/architect-dashboard/profile', icon: User, label: 'Profile' },
    { to: '/architect-dashboard/notifications', icon: Bell, label: 'Notifications' },
    { to: '/architect-dashboard/messages', icon: MessageCircle, label: 'Messages' },
  ];

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);

          // Check if user role matches architect dashboard
          if (user.role !== 'Architect' && user.user_role !== 'architect') {
            navigate('/login');
            return;
          }

          const userId = user.id;
          const displayUser = {
            id: userId,
            first_name: user.firstName || user.first_name,
            last_name: user.lastName || user.last_name,
            email: user.email,
            user_role: 'architect'
          };

          if (userId) {
            try {
              const result = await userService.getUserProfile(userId);
              if (result.success) {
                setCurrentUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
              } else {
                setCurrentUser(displayUser);
              }
            } catch (dbError) {
              setCurrentUser(displayUser);
            }
          } else {
            setCurrentUser(displayUser);
          }
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        navigate('/login');
      }
    };

    loadUserData();
  }, [navigate]);

  const handleLogout = () => {
    // Clear any stored user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

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
            <p className="text-sm text-gray-500">Architect Dashboard</p>
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
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser ?
                  `${currentUser.first_name || 'User'} ${currentUser.last_name || ''}`.trim() ||
                  currentUser.email || 'Architect User'
                  : 'Loading...'}
              </p>
              <p className="text-xs text-gray-500">Senior Architect</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Notification Dropdown */}
            {currentUser?.id && (
              <NotificationDropdown userId={currentUser.id} />
            )}
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
    </div>
  );
};

export default Sidebar;