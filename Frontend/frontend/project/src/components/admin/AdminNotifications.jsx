import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info, UserPlus } from 'lucide-react';

const AdminNotifications = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Admin Notifications</h2>
        <p className="text-gray-600 mt-2">
          Monitor platform activities and system alerts
        </p>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">Unread</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-600">New Users Today</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Urgent Actions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-gray-900">24</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Mark all as read
          </button>
        </div>
        
        <div className="divide-y divide-gray-200">
          {/* Sample notifications - will be replaced with real data */}
          <div className="p-6 bg-blue-50">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-2 rounded-full">
                <UserPlus className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">New User Registration</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="font-medium">John Smith</span> registered as a Constructor and needs verification
                </p>
                <p className="text-xs text-gray-500 mt-2">2 minutes ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  New Registration
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-2 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Document Approved</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Business license for <span className="font-medium">Sarah Constructor</span> has been approved
                </p>
                <p className="text-xs text-gray-500 mt-2">1 hour ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Verification
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50">
            <div className="flex items-start space-x-4">
              <div className="bg-amber-100 p-2 rounded-full">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Urgent: Multiple Failed Login Attempts</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Suspicious login activity detected for admin account from IP: 192.168.1.100
                </p>
                <p className="text-xs text-gray-500 mt-2">3 hours ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                  Security Alert
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-2 rounded-full">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">System Update Completed</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Platform maintenance completed successfully. All services are now running normally.
                </p>
                <p className="text-xs text-gray-500 mt-2">1 day ago</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                  System
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Load More */}
        <div className="px-6 py-4 border-t border-gray-200">
          <button className="w-full text-center py-2 text-sm text-blue-600 hover:text-blue-800 font-medium">
            Load more notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;