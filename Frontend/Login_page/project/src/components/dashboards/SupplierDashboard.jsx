import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../supplier/Sidebar';
import SupplierHome from '../../pages/supplier/SupplierHome';
import MaterialRequests from '../../pages/supplier/MaterialRequestsNew';
import Quotations from '../../pages/supplier/Quotations';
import Orders from '../../pages/supplier/Orders';
import Notifications from '../../pages/supplier/Notifications';
import Messaging from '../../pages/supplier/Messaging';
import Payments from '../../pages/supplier/Payments';
import Profile from '../../pages/supplier/Profile';

const SupplierDashboard = () => {
  const [notifications] = useState(2);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar notifications={notifications} />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<div className="p-8"><SupplierHome /></div>} />
          <Route path="/material-requests" element={<div className="p-8"><MaterialRequests /></div>} />
          <Route path="/quotations" element={<div className="p-8"><Quotations /></div>} />
          <Route path="/orders" element={<div className="p-8"><Orders /></div>} />
          <Route path="/notifications" element={<div className="p-8"><Notifications /></div>} />
          <Route path="/messaging" element={<div className="p-8"><Messaging /></div>} />
          <Route path="/profile" element={<div className="p-8"><Profile /></div>} />
        </Routes>
      </main>
    </div>
  );
};

export default SupplierDashboard;