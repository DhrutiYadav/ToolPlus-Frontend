// src/components/NotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
      setNotifications(data.slice(0, 5));
      const unreadData = await notificationService.getUnreadCount();
      setUnreadCount(unreadData.count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
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

  const handleMarkAsRead = async (id) => {
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
      case 'Order': return '🛒';
      case 'Refund': return '💸';
      default: return '🛎️';
    }
  };

  const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95"
      >
        <span className="text-2xl">🛎️</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Responsive Dropdown */}
      {isOpen && (
        <div className="fixed md:absolute md:right-0 md:mt-3 left-4 right-4 md:left-auto md:w-96 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl z-[100] max-h-[85vh] overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800 z-10">
            <h6 className="font-bold text-lg">Notifications</h6>
            {unreadCount > 0 && (
              <span className="text-xs bg-rose-100 text-rose-600 px-3 py-1 rounded-full font-medium">
                {unreadCount} New
              </span>
            )}
          </div>

          {/* Notification List */}
          <div className="overflow-auto max-h-[420px]">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-500 dark:text-slate-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id}
                  className="p-5 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer active:bg-slate-100"
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div className="flex gap-4">
                    <div className="text-2xl flex-shrink-0 mt-0.5">{getIconForType(n.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <button 
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className="w-full py-3.5 text-orange-500 font-medium hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-2xl transition-colors"
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