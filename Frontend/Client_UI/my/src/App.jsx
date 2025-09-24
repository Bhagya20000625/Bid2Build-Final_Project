import React, { useState } from 'react';
import MenuButton from './components/MenuButton';
import Home from './pages/Home';
import PostProject from './pages/PostProject';
import ViewBids from './pages/ViewBids';
import ProjectProgress from './pages/ProjectProgress';
import Payments from './pages/Payments';
import MaterialsRequest from './pages/MaterialsRequest';
import Messaging from './pages/Messaging';
import Profile from './pages/Profile';
import { Building2, User, ChevronDown } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState(3);
  
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
    <div className="h-screen w-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Header with Menu Button and Centered Brand */}
      <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 relative">
            {/* Left Side - Menu Button */}
            <div className="flex items-center">
              <MenuButton 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                notifications={notifications}
              />
            </div>
            
            {/* Center - Brand Logo and Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
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
      
      {/* Main Content - Full Screen */}
      <main className="flex-1 w-full overflow-auto">
        <div className="h-full w-full p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;