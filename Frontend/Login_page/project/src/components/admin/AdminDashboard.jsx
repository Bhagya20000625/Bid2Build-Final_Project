import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminOverview from './AdminOverview';
import AdminUsers from './AdminUsers';
import AdminVerifications from './AdminVerifications';
import AdminNotifications from './AdminNotifications';
import adminAuthService from '../../services/adminAuthService';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated
    if (!adminAuthService.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    // Get admin user data
    const user = adminAuthService.getAdminUser();
    setAdminUser(user);
    setLoading(false);
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await adminAuthService.logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader adminUser={adminUser} onLogout={handleLogout} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/users" element={<AdminUsers />} />
            <Route path="/verifications" element={<AdminVerifications />} />
            <Route path="/notifications" element={<AdminNotifications />} />
            {/* Redirect any unknown admin routes to overview */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;