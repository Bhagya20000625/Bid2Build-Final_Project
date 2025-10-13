import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../client/Sidebar';
import Home from '../../pages/client/Home';
import PostProject from '../../pages/client/PostProject';
import ViewBids from '../../pages/client/ViewBids';
import ProjectProgress from '../../pages/client/ProjectProgress';
import Payments from '../../pages/client/Payments';
import MaterialsRequest from '../../pages/client/MaterialsRequest';
import Notifications from '../../pages/client/Notifications';
import Messaging from '../../pages/client/Messaging';
import Profile from '../../pages/client/Profile';


const CustomerDashboard = () => {
  const [notifications] = useState(3);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Start with sidebar hidden
  const sidebarRef = useRef(null);

  // Handle clicks outside sidebar to auto-collapse it
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't collapse if clicking on the sidebar itself or if already collapsed
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !isSidebarCollapsed) {
        // Check if the clicked element is the toggle button or its children
        const isToggleButton = event.target.closest('button[title*="Sidebar"]');
        if (!isToggleButton) {
          setIsSidebarCollapsed(true);
        }
      }
    };

    // Add event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarCollapsed]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div ref={sidebarRef}>
        <Sidebar 
          notifications={notifications} 
          isCollapsed={isSidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>
      <main className={`flex-1 overflow-auto transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-0' : 'ml-0'
      }`}>
        <Routes>
          <Route path="/" element={<div className="p-8"><Home /></div>} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/view-bids" element={<div className="p-8"><ViewBids /></div>} />
          <Route path="/project-progress" element={<ProjectProgress />} />
          <Route path="/payments" element={<div className="p-8"><Payments /></div>} />
          <Route path="/materials" element={<div className="p-8"><MaterialsRequest /></div>} />
          <Route path="/notifications" element={<div className="p-8"><Notifications /></div>} />
          <Route path="/messaging" element={<div className="p-8"><Messaging /></div>} />
          <Route path="/profile" element={<div className="p-8"><Profile /></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default CustomerDashboard;