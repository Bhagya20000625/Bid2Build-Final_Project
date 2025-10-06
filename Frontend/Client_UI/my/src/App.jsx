import React, { useState, useEffect } from 'react';
import MenuButton from './components/MenuButton';
import Home from './pages/Home';
import PostProject from './pages/PostProject';
import ViewBids from './pages/ViewBids';
import ProjectProgress from './pages/ProjectProgress';
import Payments from './pages/Payments';
import MaterialsRequest from './pages/MaterialsRequest';
import Messaging from './pages/Messaging';
import Profile from './pages/Profile';
import { Building2, User, ChevronDown, Menu, X, Home as HomeIcon, Plus, Eye, BarChart3, CreditCard, Package, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';


function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState(3);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  // User profile data (matches the profile page data)
  const userProfile = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    company: 'Johnson Construction Group',
    address: '123 Business Ave, Suite 100, New York, NY 10001',
    bio: 'Experienced project manager with over 10 years in commercial construction. Specialized in office buildings and retail spaces.',
    role: 'Client',
    avatar: null // Could be an image URL
  };

  // Sidebar menu items
  const menuItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'post-project', label: 'Post Project', icon: Plus },
    { id: 'view-bids', label: 'View Bids', icon: Eye },
    { id: 'project-progress', label: 'Project Progress', icon: BarChart3 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'messaging', label: 'Messages', icon: MessageCircle, hasNotification: true },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Handle sidebar menu item click
  const handleSidebarMenuClick = (itemId) => {
    setActiveTab(itemId);
    if (isMobile) {
      setIsMobileSidebarOpen(false); // Close mobile sidebar after selection
    }
  };


  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home setActiveTab={setActiveTab} />;
      case 'post-project':
        return <PostProject />;
      case 'view-bids':
        return <ViewBids />;
      case 'project-progress':
        return <ProjectProgress />;
      case 'payments':
        return <Payments />;
      case 'materials':
        return <MaterialsRequest />;
      case 'messaging':
        return <Messaging notifications={notifications} setNotifications={setNotifications} />;
      case 'profile':
        return <Profile userProfile={userProfile} />;
      default:
        return <Home />;
    }
  };


  return (
    <div className="h-screen w-screen bg-gray-50 flex overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isMobile && isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: Always visible, Mobile: Sliding */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : `relative bg-white shadow-sm border-r border-gray-200 transition-all duration-300 ease-in-out ${
              isDesktopSidebarCollapsed ? 'w-16' : 'w-64'
            }`
        }
      `}>
        {/* Desktop Sidebar Header (only when collapsed) */}
        {!isMobile && isDesktopSidebarCollapsed && (
          <div className="p-4 border-b border-gray-200 flex justify-center">
            <button
              onClick={() => setIsDesktopSidebarCollapsed(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Expand Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Full Sidebar Header (Mobile + Desktop when expanded) */}
        {(isMobile || !isDesktopSidebarCollapsed) && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Bid2Build</h2>
                  <p className="text-sm text-gray-500">Client Dashboard</p>
                </div>
              </div>
              {isMobile ? (
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              ) : (
                <button
                  onClick={() => setIsDesktopSidebarCollapsed(true)}
                  className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Collapse Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Sidebar Navigation */}
        <nav className="mt-6 flex-1 overflow-y-auto">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleSidebarMenuClick(item.id)}
                    className={`w-full flex items-center transition-colors duration-200 ${
                      !isMobile && isDesktopSidebarCollapsed 
                        ? 'justify-center p-3 rounded-lg relative group'
                        : 'space-x-3 px-4 py-3 rounded-lg'
                    } ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${
                      isActive && (!isMobile && !isDesktopSidebarCollapsed)
                        ? 'border-l-4 border-blue-600'
                        : ''
                    }`}
                    title={!isMobile && isDesktopSidebarCollapsed ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {(isMobile || !isDesktopSidebarCollapsed) && (
                      <>
                        <span className="font-medium">{item.label}</span>
                        {item.hasNotification && notifications > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {notifications}
                          </span>
                        )}
                      </>
                    )}
                    {/* Tooltip for collapsed desktop sidebar */}
                    {!isMobile && isDesktopSidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                        {item.label}
                        {item.hasNotification && notifications > 0 && (
                          <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {notifications}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Always visible */}
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3 relative">
              {/* Left Side - Menu Button (Mobile only) */}
              <div className="flex items-center">
                {isMobile && (
                  <button
                    onClick={() => setIsMobileSidebarOpen(true)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                )}
              </div>
              
              {/* Center - Brand Logo and Name */}
              <div className={`flex items-center space-x-3 ${!isMobile ? 'absolute left-1/2 transform -translate-x-1/2' : ''}`}>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    Bid2Build
                  </h1>
                  <p className="text-sm text-blue-600 font-medium">
                    Client Dashboard
                  </p>
                </div>
              </div>
              
              {/* Right Side - User Profile */}
              <div className="flex items-center space-x-3">
                <div 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-3 rounded-full px-4 py-2 transition-colors cursor-pointer border ${
                    activeTab === 'profile' 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {/* Profile Picture */}
                  {userProfile.avatar ? (
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activeTab === 'profile' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-green-400 to-blue-500'
                    }`}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  {/* User Name and Role */}
                  <div className="hidden sm:flex flex-col">
                    <span className={`text-sm font-semibold ${
                      activeTab === 'profile' ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {userProfile.name}
                    </span>
                    <span className={`text-xs ${
                      activeTab === 'profile' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {userProfile.role}
                    </span>
                  </div>
                  {/* Dropdown Arrow */}
                  <ChevronDown className={`w-4 h-4 hidden sm:block ${
                    activeTab === 'profile' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full w-full p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;