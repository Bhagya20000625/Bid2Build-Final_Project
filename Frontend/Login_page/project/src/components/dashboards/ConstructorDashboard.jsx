import React, { useState } from 'react';
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar notifications={notifications} />
      <main className="flex-1 overflow-auto">
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