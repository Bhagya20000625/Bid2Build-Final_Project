import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Package,
  FileText,
  MessageCircle,
  CreditCard,
  User,
  Building2,
  LogOut,
  Search,
  Bell
} from 'lucide-react';
import userService from '../../services/userService.js';
import NotificationDropdown from '../notifications/NotificationDropdown.jsx';

const Sidebar = ({ notifications }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const menuItems = [
    { id: 'home', label: 'Dashboard', icon: Home, to: '/supplier-dashboard' },
    { id: 'material-requests', label: 'Material Requests', icon: Search, to: '/supplier-dashboard/material-requests' },
    { id: 'quotations', label: 'My Quotations', icon: FileText, to: '/supplier-dashboard/quotations' },
    { id: 'orders', label: 'Active Orders', icon: Package, to: '/supplier-dashboard/orders' },
    { id: 'notifications', label: 'Notifications', icon: Bell, to: '/supplier-dashboard/notifications', hasNotification: true },
    { id: 'messaging', label: 'Messages', icon: MessageCircle, to: '/supplier-dashboard/messaging' },
    { id: 'payments', label: 'Payments', icon: CreditCard, to: '/supplier-dashboard/payments' },
    { id: 'profile', label: 'Profile', icon: User, to: '/supplier-dashboard/profile' },
  ];

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);

          // Check if user role matches supplier dashboard
          if (user.role !== 'Supplier' && user.user_role !== 'supplier') {
            navigate('/login');
            return;
          }

          const userId = user.id;
          const displayUser = {
            id: userId,
            first_name: user.firstName || user.first_name,
            last_name: user.lastName || user.last_name,
            email: user.email,
            user_role: 'supplier'
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
    // Clear stored user data
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bid2Build</h2>
            <p className="text-sm text-gray-500">Supplier Dashboard</p>
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
                        ? 'bg-green-50 text-green-700 border-l-4 border-green-600'
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
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser ?
                  `${currentUser.first_name || 'User'} ${currentUser.last_name || ''}`.trim() ||
                  currentUser.email || 'Supplier User'
                  : 'Loading...'}
              </p>
              <p className="text-xs text-gray-500">Material Supplier</p>
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