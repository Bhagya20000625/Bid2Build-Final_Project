import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../constructor/Sidebar';
import BrowseProjects from '../../pages/constructor/BrowseProjects';
import ActiveProjects from '../../pages/constructor/ActiveProjects';
import MyBids from '../../pages/constructor/MyBids';
import Notifications from '../../pages/constructor/Notifications';
import Payments from '../../pages/constructor/Payments';
import Messages from '../../pages/constructor/Messages';

const ConstructorDashboard = () => {
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
          <Route path="/" element={<div className="p-8"><BrowseProjects /></div>} />
          <Route path="/browse-projects" element={<div className="p-8"><BrowseProjects /></div>} />
          <Route path="/active-projects" element={<div className="p-8"><ActiveProjects /></div>} />
          <Route path="/my-bids" element={<div className="p-8"><MyBids /></div>} />
          <Route path="/notifications" element={<div className="p-8"><Notifications /></div>} />
          <Route path="/payments" element={<div className="p-8"><Payments /></div>} />
          <Route path="/messages" element={<div className="p-8"><Messages /></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default ConstructorDashboard;