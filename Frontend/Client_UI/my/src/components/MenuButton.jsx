import React, { useState, useRef, useEffect } from 'react';
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
  Menu,
  ChevronDown
} from 'lucide-react';

const MenuButton = ({ activeTab, setActiveTab, notifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

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

  // Get current active menu item
  const currentItem = menuItems.find(item => item.id === activeTab);
  const CurrentIcon = currentItem?.icon || Home;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = (itemId) => {
    setActiveTab(itemId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <Building2 className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center space-x-2">
            <CurrentIcon className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900 hidden sm:block">
              {currentItem?.label || 'Menu'}
            </span>
          </div>
        </div>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-[100] py-2">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Bid2Build</h3>
                <p className="text-sm text-gray-500">Client Dashboard</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium flex-1">{item.label}</span>
                  {item.hasNotification && notifications > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuButton;