import  { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import '../styles/AdminLayout.css';
import notificationService from "../services/notificationService";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  MessageSquare,
  Tags,
  Briefcase,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Ticket,
  BarChart2,
} from "lucide-react";

function AdminLayout() {
  const { user, logout } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const notifRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationService.getUserNotifications();
      setNotifications(data.slice(0, 5));
      const unread = data.filter(n => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    window.addEventListener('notificationsUpdated', fetchNotifications);
    return () => {
      clearInterval(interval);
      window.removeEventListener('notificationsUpdated', fetchNotifications);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    const savedSidebar = localStorage.getItem("adminSidebarCollapsed");
    if (savedSidebar === "true") setIsSidebarCollapsed(true);
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem("adminSidebarCollapsed", newState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
      window.dispatchEvent(new Event('notificationsUpdated'));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'Order': return { icon: '🛒', color: 'text-emerald-500' };
      case 'Refund': return { icon: '💸', color: 'text-amber-500' };
      case 'Coupon': return { icon: '🎟️', color: 'text-purple-500' };
      case 'Inventory': return { icon: '📦', color: 'text-rose-500' };
      case 'System': return { icon: '⚙️', color: 'text-blue-500' };
      case 'Success': return { icon: '✅', color: 'text-emerald-500' };
      case 'Error': return { icon: '❌', color: 'text-rose-500' };
      case 'Warning': return { icon: '⚠️', color: 'text-amber-500' };
      case 'Info':
      default: return { icon: 'ℹ️', color: 'text-blue-500' };
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

  const navGroups = [
    {
      label: "MAIN",
      items: [{ label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard }],
    },
    {
      label: "MANAGEMENT",
      items: [
        { label: "Users", path: "/admin/users", icon: Users },
        { label: "Orders", path: "/admin/orders", icon: ShoppingBag },
        { label: "Reviews", path: "/admin/reviews", icon: MessageSquare },
      ],
    },
    {
      label: "CATALOG",
      items: [
        { label: "Categories", path: "/admin/categories", icon: Tags },
        { label: "Deals", path: "/admin/deals", icon: Briefcase },
      ],
    },
    {
      label: "MARKETING",
      items: [{ label: "Coupons", path: "/admin/coupons", icon: Ticket }],
    },
    {
      label: "ANALYTICS",
      items: [{ label: "Reports", path: "/admin/reports", icon: BarChart2 }],
    },
  ];

  const adminName = user?.email ? user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1) : "Admin";

  return (
    <div className={`flex h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300`}>
      {/* Sidebar */}
      <aside
        className="bg-slate-900 text-slate-300 flex flex-col justify-between shadow-2xl transition-all duration-300 z-20 shrink-0 relative"
        style={{ width: isSidebarCollapsed ? "80px" : "256px" }}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-orange-500 text-white rounded-full p-1 shadow-lg hover:bg-orange-600 transition-colors z-50"
        >
          {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Area */}
          <div className="h-[80px] flex items-center justify-center border-b border-slate-800 shrink-0 px-4">
                {isSidebarCollapsed ? (
              <Link to="/admin/dashboard" className="flex items-center justify-center w-full transition-transform hover:scale-105">
                <img
                  src="/logo/logo-square-dark.png"
                  alt="ToolPlus Logo"
                  className="admin-logo-small"
                />
              </Link>
            ) : (
              <Link to="/admin/dashboard" className="flex items-center justify-center w-full transition-transform hover:scale-105">
                <img
                  src="/logo/dark-horizontal-logo.png"
                  alt="ToolPlus Logo"
                  className="admin-logo-large"
                />
              </Link>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-hide">
            {navGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="mb-6">
                {!isSidebarCollapsed && (
                  <h3 className="px-6 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {group.label}
                  </h3>
                )}
                {isSidebarCollapsed && <div className="h-4 border-b border-slate-800 mb-4 mx-4" />}
                
                <ul className="space-y-1 px-3">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname.includes(item.path);
                    return (
                      <li key={item.path} className="relative group">
                        <Link
                          to={item.path}
                          className={`flex items-center ${
                            isSidebarCollapsed ? "justify-center px-0" : "justify-start space-x-3 px-3"
                          } py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isActive
                              ? "bg-orange-500/10 text-orange-500"
                              : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
                          }`}
                        >
                          <Icon size={20} className={`flex-shrink-0 ${isActive ? "text-orange-500" : ""}`} />
                          {!isSidebarCollapsed && <span>{item.label}</span>}
                        </Link>
                        
                        {/* Tooltip for collapsed mode */}
                        {isSidebarCollapsed && (
                          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                            {item.label}
                            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer Area */}
          <div className="p-4 border-t border-slate-800 shrink-0">
            {!isSidebarCollapsed ? (
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {adminName.charAt(0)}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-sm font-bold text-white truncate">{adminName}</p>
                    <p className="text-xs text-emerald-400 font-medium">Online</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 p-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shadow-md cursor-pointer group relative">
                  {adminName.charAt(0)}
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {adminName}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors group relative"
                >
                  <LogOut size={20} />
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-rose-900 text-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    Logout
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-rose-900 rotate-45"></div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Top Navbar */}
        <header className="min-h-[80px] pt-2 bg-[#ffffff] dark:!bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-50 shrink-0 transition-colors duration-300">
          <div className="flex flex-col justify-center">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight mb-1">
              Welcome back, {adminName} <span className="animate-wave inline-block origin-bottom-right">👋</span>
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
              {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 18 ? 'Good Afternoon' : 'Good Evening'}, here's what's happening today.
            </p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 flex items-center justify-center text-[10px] text-white font-bold px-1">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-[#ffffff] dark:!bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-[9999] transform origin-top-right transition-all">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h4 className="font-bold text-slate-800 dark:text-white">Notifications</h4>
                    {unreadCount > 0 && (
                      <span
                        className="text-xs text-orange-500 font-semibold cursor-pointer hover:underline"
                        onClick={handleMarkAllRead}
                      >
                        Mark all read
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto scrollbar-hide">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 dark:text-slate-500">
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const { icon, color } = getIconForType(notif.type);
                        return (
                          <div key={notif.id} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer flex gap-3 ${!notif.isRead ? 'bg-slate-50/50 dark:bg-slate-800/80' : ''}`}
                            onClick={async (e) => {
                              if (!notif.isRead) {
                                e.stopPropagation();
                                try {
                                  await notificationService.markAsRead(notif.id);
                                  fetchNotifications();
                                  window.dispatchEvent(new Event('notificationsUpdated'));
                                } catch (error) {
                                  console.error(error);
                                }
                              }
                            }}
                          >
                            <div className={`mt-0.5 text-lg flex-shrink-0`}>
                              {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium'} text-slate-800 dark:text-slate-200 truncate`}>{notif.title}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{notif.message}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{timeAgo(notif.createdAt)}</p>
                            </div>
                            {!notif.isRead && (
                              <div className="mt-2 flex-shrink-0">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="p-3 text-center border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <button
                      className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                      onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                    >
                      View All
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

            {/* Profile area */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{adminName}</span>
                <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white dark:border-slate-800">
                {adminName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth dark:bg-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

