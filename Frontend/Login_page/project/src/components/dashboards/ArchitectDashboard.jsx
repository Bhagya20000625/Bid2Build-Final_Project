import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../architect/Sidebar';
import BrowseProjects from '../../pages/architect/BrowseProjects';
// Import other pages when they're copied
// import MyProposals from '../../pages/architect/MyProposals';
// import Messages from '../../pages/architect/Messages';
// import Payments from '../../pages/architect/Payments';

// Temporary placeholder components for the other pages
const MyProposals = () => (
  <div className="flex-1 bg-gray-50 p-8">
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">My Proposals</h1>
      <p className="text-gray-600">Track your submitted proposals and their current status. (Component will be integrated soon)</p>
    </div>
  </div>
);

const Messages = () => (
  <div className="flex-1 bg-gray-50 p-8">
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
      <p className="text-gray-600">Communicate with clients and project stakeholders. (Component will be integrated soon)</p>
    </div>
  </div>
);

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
        <Route path="/messages" element={<Messages />} />
        <Route path="/payments" element={<Payments />} />
      </Routes>
    </div>
  );
};

export default ArchitectDashboard;