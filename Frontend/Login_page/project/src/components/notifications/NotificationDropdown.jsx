import React, { useState, useEffect, useRef } from 'react';
import { Bell, X, Check, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../../services/notificationService.js';

const NotificationDropdown = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();


  // Load notifications when component mounts or when dropdown opens
  useEffect(() => {
    if (userId) {
      loadNotifications();
    }
  }, [userId]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationService.getUserNotifications(userId, { limit: 20 });

      if (result.success) {
        setNotifications(result.notifications);
        setUnreadCount(result.unreadCount);
      }
    } catch (error) {
      console.error('🔴 Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      // Mark as read if unread
      if (!notification.is_read) {
        await notificationService.markNotificationRead(notification.id);
        setUnreadCount(prev => Math.max(0, prev - 1));

        // Update local state
        setNotifications(prev => prev.map(n =>
          n.id === notification.id ? { ...n, is_read: 1 } : n
        ));
      }

      // Navigate to action URL if provided
      if (notification.action_url) {
        navigate(notification.action_url);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllNotificationsRead(userId);
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation(); // Prevent notification click

    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      // Update unread count if deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId);
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          // Navigate to the user's notifications page instead of only toggling the dropdown
          const role = localStorage.getItem('userRole');
          let target = '/notifications';
          if (role === 'Architect') target = '/architect-dashboard/notifications';
          else if (role === 'Constructor') target = '/constructor-dashboard/notifications';
          else if (role === 'Supplier') target = '/supplier-dashboard/notifications';
          else if (role === 'Customer') target = '/customer-dashboard/notifications';
          else target = '/notifications';

          navigate(target);
        }}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className="absolute w-80 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-hidden"
          style={{
            zIndex: 9999,
            position: 'absolute',
            top: '100%',
            transform: 'translateX(-85%)', // Center it relative to the bell
            marginTop: '8px'
          }}
        >

          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
              >
                <CheckCheck className="w-4 h-4 mr-1" />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg font-medium">No notifications</p>
                <p className="text-sm">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200 ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        <span className="text-lg mr-2">
                          {notificationService.getNotificationIcon(notification.type)}
                        </span>
                        <h4 className={`text-sm font-medium truncate ${
                          !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {notificationService.formatNotificationTime(notification.created_at)}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full border ${
                          notificationService.getNotificationPriority(notification.priority)
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNotification(notification.id, e)}
                      className="ml-2 p-1 text-gray-400 hover:text-red-600 rounded transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => {
                  const role = localStorage.getItem('userRole');
                  let target = '/notifications';
                  if (role === 'Architect') target = '/architect-dashboard/notifications';
                  else if (role === 'Constructor') target = '/constructor-dashboard/notifications';
                  else if (role === 'Supplier') target = '/supplier-dashboard/notifications';
                  else if (role === 'Customer') target = '/customer-dashboard/notifications';
                  else target = '/notifications';

                  navigate(target);
                  setIsOpen(false);
                }}
                className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;