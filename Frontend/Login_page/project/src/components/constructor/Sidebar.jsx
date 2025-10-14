import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Search,
  Briefcase,
  FileText,
  Bell,
  CreditCard,
  MessageCircle,
  User,
  Building2,
  LogOut
} from 'lucide-react';
import userService from '../../services/userService.js';

const Sidebar = ({ notifications }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const menuItems = [
    { id: 'browse-projects', label: 'Browse Projects', icon: Search, to: '/constructor-dashboard/browse-projects' },
    { id: 'active-projects', label: 'Active Projects', icon: Briefcase, to: '/constructor-dashboard/active-projects' },
    { id: 'my-bids', label: 'My Bids', icon: FileText, to: '/constructor-dashboard/my-bids' },
    { id: 'notifications', label: 'Notifications', icon: Bell, to: '/constructor-dashboard/notifications', hasNotification: true },
    { id: 'payments', label: 'Payments', icon: CreditCard, to: '/constructor-dashboard/payments' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, to: '/constructor-dashboard/messages' },
  ];

  // Load user data from database
  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log('🔧 CONSTRUCTOR: Loading user data...');
        const userData = localStorage.getItem('user');
        console.log('🔧 CONSTRUCTOR: localStorage user data:', userData);

        if (userData) {
          const user = JSON.parse(userData);
          console.log('🔧 CONSTRUCTOR: Parsed user:', user);

          // Check if user role matches constructor dashboard
          if (user.role !== 'Constructor' && user.user_role !== 'constructor') {
            console.log('🔧 CONSTRUCTOR: Wrong user role, redirecting to login');
            // Redirect to login if wrong role
            navigate('/login');
            return;
          }

          // Handle user data format (from login vs from database)
          const userId = user.id;
          const displayUser = {
            id: userId,
            first_name: user.firstName || user.first_name,
            last_name: user.lastName || user.last_name,
            email: user.email,
            user_role: 'constructor'
          };

          if (userId) {
            console.log('🔧 CONSTRUCTOR: User has ID, fetching from database...');
            try {
              const result = await userService.getUserProfile(userId);
              console.log('🔧 CONSTRUCTOR: Database result:', result);

              if (result.success) {
                console.log('🔧 CONSTRUCTOR: Setting user from database:', result.user);
                setCurrentUser(result.user);
                localStorage.setItem('user', JSON.stringify(result.user));
              } else {
                console.log('🔧 CONSTRUCTOR: Database fetch failed, using localStorage data');
                setCurrentUser(displayUser);
              }
            } catch (dbError) {
              console.log('🔧 CONSTRUCTOR: Database error, using localStorage data:', dbError);
              setCurrentUser(displayUser);
            }
          } else {
            console.log('🔧 CONSTRUCTOR: No user ID, using localStorage data as fallback');
            setCurrentUser(displayUser);
          }
        } else {
          console.log('🔧 CONSTRUCTOR: No user data in localStorage, redirecting to login');
          navigate('/login');
        }
      } catch (error) {
        console.error('🔴 CONSTRUCTOR ERROR loading user data:', error);
        console.log('🔧 CONSTRUCTOR: Error occurred, redirecting to login');
        navigate('/login');
      }
    };

    loadUserData();
  }, [navigate]);

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
            <p className="text-sm text-gray-500">Constructor Dashboard</p>
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
                  {/* notification badge removed */}
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
            <button
              onClick={handleLogout}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;