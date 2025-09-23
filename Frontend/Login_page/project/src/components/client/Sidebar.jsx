import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Plus,
  Eye,
  BarChart3,
  CreditCard,
  Package,
  Bell,
  MessageCircle,
  User,
  Building2,
  LogOut
} from 'lucide-react';
import userService from '../../services/userService.js';
import NotificationDropdown from '../notifications/NotificationDropdown.jsx';

const Sidebar = ({ notifications }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, to: '/customer-dashboard' },
    { id: 'post-project', label: 'Post Project', icon: Plus, to: '/customer-dashboard/post-project' },
    { id: 'view-bids', label: 'View Bids', icon: Eye, to: '/customer-dashboard/view-bids' },
    { id: 'project-progress', label: 'Project Progress', icon: BarChart3, to: '/customer-dashboard/project-progress' },
    { id: 'payments', label: 'Payments', icon: CreditCard, to: '/customer-dashboard/payments' },
    { id: 'materials', label: 'Materials', icon: Package, to: '/customer-dashboard/materials' },
    { id: 'notifications', label: 'Notifications', icon: Bell, to: '/customer-dashboard/notifications', hasNotification: true },
    { id: 'messaging', label: 'Messages', icon: MessageCircle, to: '/customer-dashboard/messaging' },
    { id: 'profile', label: 'Profile', icon: User, to: '/customer-dashboard/profile' },
  ];

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // First check localStorage for user ID
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          if (user.id) {
            // Fetch full user data from database
            const result = await userService.getUserProfile(user.id);
            if (result.success) {
              setCurrentUser(result.user);
            }
          } else {
            // Use localStorage data as fallback
            setCurrentUser(user);
          }
        } else {
          // Fallback data if no user in localStorage
          setCurrentUser({
            first_name: 'Guest',
            last_name: 'User',
            email: 'guest@example.com',
            user_role: 'customer'
          });
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        // Fallback to localStorage data
        const userData = localStorage.getItem('user');
        if (userData) {
          setCurrentUser(JSON.parse(userData));
        } else {
          setCurrentUser({
            first_name: 'Guest',
            last_name: 'User',
            email: 'guest@example.com',
            user_role: 'customer'
          });
        }
      }
    };

    loadUserData();
  }, []);

  const handleLogout = () => {
    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col h-screen">
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
      
      <nav className="mt-6 flex flex-col h-full">
        <ul className="space-y-2 px-4 flex-1">
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

        {/* User Info and Logout at bottom of sidebar */}
        <div className="px-4 pb-4 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between text-gray-600 mb-3">
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium truncate">
                {currentUser ?
                  `${currentUser.first_name || 'User'} ${currentUser.last_name || ''}`.trim() ||
                  currentUser.email || 'Guest User'
                  : 'Loading...'}
              </span>
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
      </nav>
    </div>
  );
};

export default Sidebar;