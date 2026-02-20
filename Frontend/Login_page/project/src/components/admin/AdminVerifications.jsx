import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, FileText, Eye, User, XCircle } from 'lucide-react';
import adminVerificationService from '../../services/adminVerificationService';

const AdminVerifications = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState({
    pending: 0,
    approved_today: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pendingResponse, statsResponse] = await Promise.all([
        adminVerificationService.getPendingVerifications(),
        adminVerificationService.getVerificationStats()
      ]);

      setPendingUsers(pendingResponse.data.pendingUsers || []);
      setStats(statsResponse.data.users || {});
    } catch (error) {
      console.error('Error loading verification data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviewDocuments = async (user) => {
    try {
      setSelectedUser(user);
      const response = await adminVerificationService.getUserDocuments(user.id);
      setUserDocuments(response.data.documents || []);
      setShowDocumentModal(true);
    } catch (error) {
      console.error('Error loading user documents:', error);
      alert('Error loading documents: ' + (error.message || 'Unknown error'));
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await adminVerificationService.approveVerification(userId, 'Approved by admin');
      alert('User verification approved successfully!');
      loadData(); // Refresh the list
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Error approving user: ' + (error.message || 'Unknown error'));
    }
  };

  const handleRejectUser = async (userId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      await adminVerificationService.rejectVerification(userId, reason);
      alert('User verification rejected successfully!');
      loadData(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Error rejecting user: ' + (error.message || 'Unknown error'));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'constructor': return 'bg-purple-100 text-purple-800';
      case 'architect': return 'bg-green-100 text-green-800';
      case 'supplier': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading verification data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Document Verifications</h2>
        <p className="text-gray-600 mt-2">
          Review and approve user verification documents
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-full">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.pending || 0}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.approved_today || 0}</p>
              <p className="text-sm text-gray-600">Approved Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">{stats.rejected || 0}</p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Verifications */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pending Document Reviews</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {pendingUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No pending verifications found.</p>
            </div>
          ) : (
            pendingUsers.map((user) => (
              <div key={user.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Registered as <span className="font-medium capitalize">{user.user_role}</span> • 
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500 mb-2">
                        Email: {user.email}
                      </p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.user_role)}`}>
                          {user.user_role.charAt(0).toUpperCase() + user.user_role.slice(1)}
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                          Pending Review
                        </span>
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                          {user.document_count} Documents
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handlePreviewDocuments(user)}
                      className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview Documents
                    </button>
                    <button 
                      onClick={() => handleApproveUser(user.id)}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleRejectUser(user.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Document Preview Modal */}
      {showDocumentModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Documents for {selectedUser.first_name} {selectedUser.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedUser.email} • {selectedUser.user_role}
                  </p>
                </div>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {userDocuments.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No documents uploaded yet.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    User may need to upload verification documents during registration.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userDocuments.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 capitalize">
                            {doc.document_type.replace('_', ' ')}
                          </h4>
                          <p className="text-xs text-gray-500">{doc.file_name}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          doc.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                          doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        Uploaded: {new Date(doc.uploaded_at).toLocaleString()}<br />
                        Size: {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      
                      <button
                        onClick={() => window.open(adminVerificationService.getDocumentUrl(doc.file_path), '_blank')}
                        className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        View Document
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                {userDocuments.length > 0 && (
                  <>
                    <button
                      onClick={() => {
                        handleApproveUser(selectedUser.id);
                        setShowDocumentModal(false);
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                    >
                      Approve User
                    </button>
                    <button
                      onClick={() => {
                        handleRejectUser(selectedUser.id);
                        setShowDocumentModal(false);
                      }}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                    >
                      Reject User
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerifications;