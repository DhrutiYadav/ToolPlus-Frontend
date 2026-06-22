import { useQuery } from "@tanstack/react-query";
import {
  getDashboardStats,
  getAdminReviews,
} from "../../services/adminService";
import { getDeals } from "../../services/dealService";
import SkeletonLoader from "../../components/SkeletonLoader";
import AdminDataTable from "../../components/AdminDataTable";
import AdminStatusBadge from "../../components/AdminStatusBadge";
import { Link } from "react-router-dom";
import {
  Users,
  Briefcase,
  Tags,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PlusCircle,
  UserPlus,
  Ticket,
  BarChart2,
  AlertCircle,
  Star,
  Edit2,
  Trash2,
  Activity,
  CreditCard,
} from "lucide-react";

function Sparkline({ color }) {
  return (
    <svg
      className="w-16 h-8"
      viewBox="0 0 100 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 25C10 25 15 10 25 10C35 10 40 20 50 20C60 20 65 5 75 5C85 5 90 15 100 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 25C10 25 15 10 25 10C35 10 40 20 50 20C60 20 65 5 75 5C85 5 90 15 100 15V30H0V25Z"
        fill={`url(#gradient-${color})`}
        opacity="0.2"
      />
      <defs>
        <linearGradient
          id={`gradient-${color}`}
          x1="50"
          y1="5"
          x2="50"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={color} />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Simple bar chart component for analytics section */
function MiniBarChart({ data, color, label }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white">
          {label}
        </h4>
      </div>
      <div className="flex items-end gap-1.5 flex-1 min-h-[100px]">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 group">
            <div
              className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 min-h-[4px]"
              style={{
                height: `${Math.max((item.value / maxVal) * 100, 5)}%`,
                backgroundColor: color,
                opacity: 0.8 + (idx / data.length) * 0.2,
              }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: getDashboardStats,
    refetchInterval: 30000,
  });

  const { data: reviewsData } = useQuery({
    queryKey: ["adminRecentReviews"],
    queryFn: () => getAdminReviews("", 1, 5),
  });

  const { data: dealsData } = useQuery({
    queryKey: ["adminAllDeals"],
    queryFn: getDeals,
  });

  if (statsLoading) {
    return <div className="p-6"><SkeletonLoader type="dealDetails" /></div>;
  }

  if (statsError) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-6 text-rose-800 dark:text-rose-300">
        <h4 className="font-bold mb-2">Error Loading Dashboard</h4>
        <p className="text-sm">
          Failed to retrieve administrative statistics. Please try refreshing
          the page.
        </p>
      </div>
    );
  }

  // Stat cards — expanded with Revenue Today, Orders Today, Coupon Usage, and Conversion Rate
  const totalRevenue = stats?.totalRevenue || 0;
  const totalOrders = stats?.totalOrders || 0;
  const revenueToday = stats?.revenueToday || 0;
  const couponUsage = stats?.couponUsage || 0;

  const statCards = [
    {
      title: "Revenue Today",
      value: `$${revenueToday.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      growth: "+5.7%",
      trend: "up",
      hex: "#10b981",
    },
    {
      title: "Revenue This Month",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: CreditCard,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50 dark:bg-cyan-500/10",
      growth: "+12.5%",
      trend: "up",
      hex: "#06b6d4",
    },
    {
      title: "Successful Payments",
      value: stats?.successfulPayments || totalOrders,
      icon: ShoppingBag,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-500/10",
      growth: "+8.2%",
      trend: "up",
      hex: "#f97316",
    },
    {
      title: "Failed Payments",
      value: stats?.failedPayments || 0,
      icon: AlertCircle,
      color: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-500/10",
      growth: "-1.2%",
      trend: "down",
      hex: "#f43f5e",
    },
    {
      title: "Refund Count",
      value: stats?.refundCount || 0,
      icon: TrendingDown,
      color: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      growth: "+0.0%",
      trend: "up",
      hex: "#f59e0b",
    },
    {
      title: "Average Order Value",
      value: `$${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0}`,
      icon: Activity,
      color: "text-violet-500",
      bgColor: "bg-violet-50 dark:bg-violet-500/10",
      growth: "+2.1%",
      trend: "up",
      hex: "#8b5cf6",
    },
    {
      title: "Active Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      growth: "+15.3%",
      trend: "up",
      hex: "#3b82f6",
    },
    {
      title: "Active Deals",
      value: stats?.totalDeals || 0,
      icon: Briefcase,
      color: "text-pink-500",
      bgColor: "bg-pink-50 dark:bg-pink-500/10",
      growth: "-2.1%",
      trend: "down",
      hex: "#ec4899",
    },
  ];

  const recentOrderColumns = [
    { header: "Order ID", accessor: "orderId" },
    {
      header: "Customer",
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">
            {row.userName || row.userEmail?.split("@")[0]}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            {row.userEmail}
          </p>
        </div>
      ),
    },
    {
      header: "Deal Title",
      render: (row) => (
        <span className="text-slate-800 dark:text-slate-200 font-medium">
          {row.items?.length > 1
            ? `${row.items[0].dealTitle} +${row.items.length - 1} more`
            : row.items?.[0]?.dealTitle || "Unknown"}
        </span>
      ),
    },
    {
      header: "Price",
      render: (row) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          ${(row.subtotal || row.price || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      render: (row) => <AdminStatusBadge status={row.status} type="order" />,
    },
    {
      header: "Date",
      render: (row) => (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      header: "Actions",
      render: () => (
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/orders`}
            className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
            title="View Order"
          >
            <Edit2 size={16} />
          </Link>
          <Link
            to={`/admin/orders`}
            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
            title="Manage Order"
          >
            <Activity size={16} />
          </Link>
        </div>
      ),
    },
  ];

  const topDealColumns = [
    {
      header: "Deal",
      render: (row) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.imageSrc || row.imageUrl}
            alt={row.title}
            className="w-10 h-10 object-cover rounded-lg border border-slate-100 dark:border-slate-700"
          />
          <div>
            <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
              {row.title}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              ${row.originalPrice} original
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Sale Price",
      render: (row) => (
        <span className="font-bold text-slate-800 dark:text-slate-200">
          ${(row.salePrice || row.discountPrice || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Ratings",
      render: (row) => (
        <div className="flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-bold text-slate-700 dark:text-slate-300">
            {row.averageRating?.toFixed(1) || "N/A"}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            ({row.reviewCount || 0})
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      render: () => (
        <div className="flex items-center space-x-2">
          <Link
            to={`/admin/deals`}
            className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
            title="Edit Deal"
          >
            <Edit2 size={16} />
          </Link>
          <Link
            to={`/admin/deals`}
            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
            title="Delete Deal"
          >
            <Trash2 size={16} />
          </Link>
        </div>
      ),
    },
  ];

  const quickActions = [
    {
      label: "Add Deal",
      icon: PlusCircle,
      path: "/admin/deals",
      color: "text-indigo-500",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      label: "Add Category",
      icon: Tags,
      path: "/admin/categories",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
    },
    {
      label: "Manage Users",
      icon: UserPlus,
      path: "/admin/users",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: "Coupons",
      icon: Ticket,
      path: "/admin/coupons",
      color: "text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      label: "Reports",
      icon: BarChart2,
      path: "/admin/reports",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-500/10",
    },
  ];

  // Process low stock deals
  const lowStockDeals =
    dealsData
      ?.filter((d) => d.stockQuantity <= 10)
      .sort((a, b) => a.stockQuantity - b.stockQuantity)
      .slice(0, 5) || [];

  // Consume real analytics data from backend
  const monthlyRevenueData = stats?.monthlyRevenueData || [];
  const paymentsTrendData = stats?.paymentsTrendData || [];
  const refundTrendData = stats?.refundTrendData || [];
  const couponUsageData = stats?.couponUsageData || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in-up">
      {/* Metric Cards Grid — 4 columns on xl, 2 on sm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const isUp = card.trend === "up";
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 card-shadow hover-lift flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-bl-full"></div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider z-10">
                  {card.title}
                </span>
                <div
                  className={`p-2 rounded-xl ${card.bgColor} ${card.color} z-10`}
                >
                  <Icon size={16} />
                </div>
              </div>

              <div className="flex items-end justify-between z-10">
                <div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {card.value}
                  </h3>
                  <div className="flex items-center space-x-1.5 mt-1.5">
                    <span
                      className={`flex items-center text-[10px] font-bold ${isUp ? "text-emerald-500" : "text-rose-500"}`}
                    >
                      {isUp ? (
                        <TrendingUp size={10} className="mr-0.5" />
                      ) : (
                        <TrendingDown size={10} className="mr-0.5" />
                      )}
                      {card.growth}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">
                      vs last mo
                    </span>
                  </div>
                </div>
                <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                  <Sparkline color={card.hex} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={monthlyRevenueData}
            color="#10b981"
            label="Monthly Revenue"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={paymentsTrendData}
            color="#f97316"
            label="Payments Trend"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={refundTrendData}
            color="#f43f5e"
            label="Refund Trend"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={couponUsageData}
            color="#8b5cf6"
            label="Coupon Usage"
          />
        </div>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map((action, idx) => {
              const ActionIcon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.path}
                  className={`${idx === quickActions.length - 1 ? "col-span-2" : ""} flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 dark:border-slate-700/50 hover:border-orange-500 dark:hover:border-orange-500 bg-slate-50 dark:bg-slate-800/30 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover-lift group quick-action-card`}
                >
                  <div
                    className={`p-2 rounded-lg ${action.bg} ${action.color} group-hover:scale-110 transition-transform mb-2`}
                  >
                    <ActionIcon size={16} />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Reviews Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Recent Reviews
            </h3>
            <Link
              to="/admin/reviews"
              className="text-xs font-semibold text-orange-500 hover:text-orange-600"
            >
              View All
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-3">
            {reviewsData?.items?.slice(0, 4).map((review) => (
              <div
                key={review.id}
                className="flex space-x-3 pb-3 border-b border-slate-50 dark:border-slate-800/50 last:border-0 last:pb-0"
              >
                <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs shrink-0">
                  {review.userName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {review.userName || "User"}
                    </span>
                    <span className="flex items-center text-amber-500 text-xs shrink-0">
                      <Star size={10} className="fill-amber-500 mr-0.5" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {review.comment}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) || (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No recent reviews.
              </p>
            )}
          </div>
        </div>

        {/* Low Stock Deals Widget */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center">
              <AlertCircle size={14} className="text-rose-500 mr-2" />
              Low Stock Alert
            </h3>
            <Link
              to="/admin/deals"
              className="text-xs font-semibold text-orange-500 hover:text-orange-600"
            >
              Manage
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
            {lowStockDeals.length > 0 ? (
              lowStockDeals.map((deal) => {
                const isCrit = deal.stockQuantity === 0;
                const isWarn =
                  deal.stockQuantity > 0 && deal.stockQuantity <= 5;
                const badgeClass = isCrit
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400"
                  : isWarn
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400";

                return (
                  <div
                    key={deal.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <img
                        src={deal.imageSrc || deal.imageUrl}
                        alt={deal.title}
                        className="w-9 h-9 rounded-lg object-cover shrink-0"
                      />
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {deal.title}
                      </p>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${badgeClass} shrink-0`}
                    >
                      {deal.stockQuantity}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                All deals are well stocked.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
              <span>Recent Orders</span>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Latest 10
              </span>
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold text-orange-500 hover:text-orange-600"
            >
              View All
            </Link>
          </div>
          <div className="p-1">
            <AdminDataTable
              columns={recentOrderColumns}
              data={stats?.recentOrders || []}
              emptyMessage="No recent orders found."
            />
          </div>
        </div>

        {/* Top Selling Deals */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
              <span>Top Deals</span>
              <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                Top 5
              </span>
            </h3>
          </div>
          <div className="p-1">
            <AdminDataTable
              columns={topDealColumns}
              data={stats?.topDeals || []}
              emptyMessage="No sales recorded yet."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
