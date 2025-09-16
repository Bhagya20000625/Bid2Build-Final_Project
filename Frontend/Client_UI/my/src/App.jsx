import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import PostProject from './pages/PostProject';
import ViewBids from './pages/ViewBids';
import ProjectProgress from './pages/ProjectProgress';
import Payments from './pages/Payments';
import MaterialsRequest from './pages/MaterialsRequest';
import Messaging from './pages/Messaging';
import Profile from './pages/Profile';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [notifications, setNotifications] = useState(3);

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
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        notifications={notifications}
      />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;