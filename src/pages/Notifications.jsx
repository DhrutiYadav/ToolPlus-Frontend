import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import notificationService from '../services/notificationService';
import { toast } from "react-toastify";
import SkeletonLoader from '../components/SkeletonLoader';

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchNotifications();
  }, [user, fetchNotifications]);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      window.dispatchEvent(new Event('notificationsUpdated'));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error(error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(n => n.id !== id));
      window.dispatchEvent(new Event('notificationsUpdated'));
      toast.success('Notification deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete notification');
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      window.dispatchEvent(new Event('notificationsUpdated'));
      toast.success('All notifications cleared');
    } catch (error) {
      console.error(error);
      toast.error('Failed to clear notifications');
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'Read') return n.isRead;
    return true;
  });

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container py-5">
        <SkeletonLoader type="table" />
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold text-slate-900 dark:text-white transition-colors">Notifications</h2>
        <div className="d-flex align-items-center gap-3">
          <div className="btn-group bg-slate-100 dark:bg-slate-800 p-1 rounded-pill transition-colors">
            {['All', 'Unread'].map(tab => (
              <button
                key={tab}
                className={`btn btn-sm rounded-pill px-4 fw-semibold transition-colors ${
                  activeTab === tab 
                    ? 'btn-white bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' 
                    : 'btn-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button 
            className="btn btn-outline-secondary btn-sm rounded-pill px-3 fw-semibold shadow-sm" 
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            Mark all read
          </button>
          <button 
            className="btn btn-outline-danger btn-sm rounded-pill px-3 fw-semibold shadow-sm" 
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            Clear all
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-4 shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}


        {/* Notifications List */}
        <div>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-5 rounded-4 shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors empty-state-container mx-3 my-4">
              <div className="empty-state-icon bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 mx-auto transition-colors mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </div>
              <h4 className="fw-bold text-slate-900 dark:text-white mb-3 transition-colors">No notifications found</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-0 transition-colors">
                You're all caught up! Check back later for updates.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`d-flex p-4 border-bottom border-slate-100 dark:border-slate-700/50 transition-colors ${
                  !notification.isRead ? 'bg-slate-50/50 dark:bg-slate-800/80' : 'bg-white dark:bg-slate-800'
                }`}
              >
                <div className="me-3 fs-3 d-flex align-items-center">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className={`m-0 ${!notification.isRead ? 'fw-bold !text-slate-900 dark:!text-slate-100' : 'fw-medium !text-slate-700 dark:!text-slate-300'}`}>
                      {notification.title}
                    </h5>
                    <small className="text-slate-400 dark:text-slate-500 fw-medium">
                      {formatDate(notification.createdAt)}
                    </small>
                  </div>
                  <p className={`mb-2 ${!notification.isRead ? '!text-slate-700 dark:!text-slate-300' : '!text-slate-500 dark:!text-slate-400'}`}>
                    {notification.message}
                  </p>
                  <div className="d-flex gap-2">
                    {!notification.isRead && (
                      <button 
                        className="btn btn-sm btn-link text-decoration-none p-0 !text-orange-500 hover:!text-orange-600"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        Mark as read
                      </button>
                    )}
                    <button 
                      className="btn btn-sm btn-link text-decoration-none p-0 !text-rose-500 hover:!text-rose-600 ms-auto"
                      onClick={() => handleDelete(notification.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
