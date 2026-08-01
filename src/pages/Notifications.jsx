import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import notificationService from "../services/notificationService";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";
import { Bell } from "lucide-react";

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await notificationService.getUserNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error("Failed to load notifications");
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
      // First update local UI
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      // Then notify Navbar
      window.dispatchEvent(new Event("notificationsUpdated"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      // First update local UI
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      // Then notify Navbar
      window.dispatchEvent(new Event("notificationsUpdated"));
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error(error);
      toast.error("Failed to mark all as read");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);
      // First update local UI
      setNotifications(notifications.filter((n) => n.id !== id));
      // Then notify Navbar
      window.dispatchEvent(new Event("notificationsUpdated"));
      toast.success("Notification deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete notification");
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.clearAll();
      setNotifications([]);
      window.dispatchEvent(new Event("notificationsUpdated"));
      toast.success("All notifications cleared");
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear notifications");
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "Unread") return !n.isRead;
    if (activeTab === "Read") return n.isRead;
    return true;
  });

  const getIconForType = (type) => {
    switch (type) {
      case "Success":
        return "✅";
      case "Error":
        return "❌";
      case "Warning":
        return "⚠️";
      case "Order":
        return "🛒";
      case "Refund":
        return "💸";
      case "Coupon":
        return "🎟️";
      case "Inventory":
        return "📦";
      case "System":
        return "⚙️";
      case "Info":
      default:
        return "ℹ️";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SkeletonLoader type="table" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="mb-0 font-bold text-slate-900 dark:text-white transition-colors">
          Notifications
        </h2>
        <div className="flex items-center gap-3">
          <button
            className="bg-transparent text-orange-500 font-bold p-0 hover:text-orange-600 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed"
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some((n) => !n.isRead)}
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-700 px-6 pt-6">
          {["All", "Unread"].map((tab) => (
            <button
              key={tab}
              className={`pb-6 px-6 text-sm font-bold uppercase tracking-wide transition-colors bg-transparent border-b-2  ${
                activeTab === tab
                  ? "text-orange-500 border-orange-500"
                  : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-200"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        {/* Tabs */}

        {/* Notifications List */}
        <div>
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors empty-state-container mx-6 my-6">
              <div
                className="empty-state-icon bg-slate-100 text-slate-400 dark:bg-slate-800 mx-auto transition-colors mb-6 flex items-center justify-center rounded-full"
                style={{ width: "64px", height: "64px" }}
              >
                <Bell size={32} />
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">
                You're all caught up!
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mb-0 transition-colors">
                No new notifications
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => {
                  if (!notification.isRead) handleMarkAsRead(notification.id);
                }}
                className={`flex p-6 border-b border-slate-100 dark:border-slate-700/50 transition-colors ${
                  !notification.isRead
                    ? "bg-white dark:bg-slate-800 cursor-pointer"
                    : "bg-slate-50 dark:bg-slate-800/50 opacity-75"
                }`}
                style={{
                  cursor: !notification.isRead ? "pointer" : "default",
                  opacity: notification.isRead ? 0.6 : 1,
                }}
              >
                <div className="mr-4 text-2xl font-bold flex items-center">
                  {getIconForType(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <h3
                        className={`m-0 ${!notification.isRead ? "font-bold !text-slate-900 dark:!text-slate-100" : "font-medium !text-slate-700 dark:!text-slate-300"}`}
                      >
                        {notification.title}
                      </h3>
                      {notification.isRead && (
                        <span className="rounded-md bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          Read
                        </span>
                      )}
                    </div>
                    <small className="text-slate-400 dark:text-slate-500 font-medium">
                      {formatDate(notification.createdAt)}
                    </small>
                  </div>
                  <p
                    className={`mb-2 ${!notification.isRead ? "!text-slate-700 dark:!text-slate-300" : "!text-slate-500 dark:!text-slate-400"}`}
                  >
                    {notification.message}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="ml-auto bg-transparent p-0 text-sm font-medium text-rose-500 transition-colors hover:text-rose-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
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
