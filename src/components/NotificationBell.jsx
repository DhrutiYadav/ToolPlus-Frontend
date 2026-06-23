import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';

const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getUserNotifications();
      setNotifications(data.slice(0, 5)); // Last 5 for dropdown
      const unreadData = await notificationService.getUnreadCount();
      setUnreadCount(unreadData.count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    window.addEventListener('notificationsUpdated', fetchNotifications);
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsUpdated', fetchNotifications);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Success': return '✅';
      case 'Error': return '❌';
      case 'Warning': return '⚠️';
      case 'Order': return '🛒';
      case 'Refund': return '💸';
      case 'Coupon': return '🎟️';
      case 'Inventory': return '📦';
      case 'System': return '⚙️';
      case 'Info':
      default: return 'ℹ️';
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // in seconds
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate('/notifications');
  };

  return (
    <div className="nav-item position-relative d-flex align-items-center ms-lg-1" ref={dropdownRef}>
      <button 
        className="btn btn-link nav-link d-flex align-items-center cart-link py-2 px-3 rounded-pill !text-slate-700 dark:!text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
        style={{ border: 'none' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="cart-badge ms-1 fw-bold d-flex align-items-center justify-content-center bg-rose-500 text-white rounded-circle" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="dropdown-menu dropdown-menu-end show shadow-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-3 mt-2" 
             style={{ position: 'absolute', right: 0, top: '100%', minWidth: '320px', zIndex: 9999, padding: 0 }}>
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-slate-100 dark:border-slate-700">
            <h6 className="m-0 fw-bold !text-slate-800 dark:!text-slate-200">Notifications</h6>
            {unreadCount > 0 && (
              <span className="badge bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 rounded-pill">
                {unreadCount} New
              </span>
            )}
          </div>
          
          <div className="notification-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                <p className="mb-0">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`d-flex p-3 border-bottom border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${!notification.isRead ? 'bg-slate-50/50 dark:bg-slate-800/80' : ''}`}
                  onClick={() => {
                    if (!notification.isRead) handleMarkAsRead({ stopPropagation: () => {} }, notification.id);
                  }}
                >
                  <div className="me-3 fs-4">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <h6 className={`m-0 text-truncate ${!notification.isRead ? 'fw-bold !text-slate-900 dark:!text-slate-100' : 'fw-medium !text-slate-700 dark:!text-slate-300'}`} style={{ fontSize: '0.9rem' }}>
                        {notification.title}
                      </h6>
                      <small className="text-slate-400 dark:text-slate-500 ms-2 flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                        {timeAgo(notification.createdAt)}
                      </small>
                    </div>
                    <p className={`m-0 text-truncate ${!notification.isRead ? '!text-slate-600 dark:!text-slate-300' : '!text-slate-500 dark:!text-slate-400'}`} style={{ fontSize: '0.85rem' }}>
                      {notification.message}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="ms-2 d-flex align-items-center">
                      <div className="bg-orange-500 rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 border-top border-slate-100 dark:border-slate-700 text-center">
            <button 
              className="btn btn-link text-decoration-none fw-semibold !text-orange-500 hover:!text-orange-600 w-100"
              onClick={handleViewAll}
            >
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
