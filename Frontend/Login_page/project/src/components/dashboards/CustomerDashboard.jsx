import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../client/Sidebar';
import Home from '../../pages/client/Home';
import PostProject from '../../pages/client/PostProject';
import ViewBids from '../../pages/client/ViewBids';
import ProjectProgress from '../../pages/client/ProjectProgress';
import Payments from '../../pages/client/Payments';
import MaterialsRequest from '../../pages/client/MaterialsRequest';
import Messaging from '../../pages/client/Messaging';
import Profile from '../../pages/client/Profile';


const CustomerDashboard = () => {
  const [notifications] = useState(3);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar notifications={notifications} />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<div className="p-8"><Home /></div>} />
          <Route path="/post-project" element={<PostProject />} />
          <Route path="/view-bids" element={<div className="p-8"><ViewBids /></div>} />
          <Route path="/project-progress" element={<ProjectProgress />} />
          <Route path="/payments" element={<div className="p-8"><Payments /></div>} />
          <Route path="/materials" element={<div className="p-8"><MaterialsRequest /></div>} />
          <Route path="/messaging" element={<div className="p-8"><Messaging /></div>} />
          <Route path="/profile" element={<div className="p-8"><Profile /></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default CustomerDashboard;