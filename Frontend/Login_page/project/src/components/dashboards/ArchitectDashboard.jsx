import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../architect/Sidebar';
import BrowseProjects from '../../pages/architect/BrowseProjects';
import Notifications from '../../pages/architect/Notifications';
import Messages from '../../pages/architect/Messages';
import MyProposals from '../../pages/architect/MyProposals';

// Temporary placeholder component for Payments
const Payments = () => (
  <div className="flex-1 bg-gray-50 p-8">
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Payments & Earnings</h1>
      <p className="text-gray-600">Track your project payments and financial overview. (Component will be integrated soon)</p>
    </div>
  </div>
);

const ArchitectDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <Routes>
        <Route path="/" element={<BrowseProjects />} />
        <Route path="/proposals" element={<MyProposals />} />
        <Route path="/notifications" element={<div className="p-8"><Notifications /></div>} />
        <Route path="/messages" element={<div className="p-8"><Messages /></div>} />
      </Routes>
    </div>
  );
};

export default ArchitectDashboard;