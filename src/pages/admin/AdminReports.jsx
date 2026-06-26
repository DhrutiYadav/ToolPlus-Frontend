import React, { useState } from "react";
import { Download, FileSpreadsheet, Users as UsersIcon, ShoppingCart, Shield } from "lucide-react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { getAllUsers } from "../../api/userApi";
import { getAdminOrders, getDashboardStats } from "../../services/adminService";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../../components/SkeletonLoader";
import AdminDataTable from "../../components/AdminDataTable";
import RevenueAreaChart from "../../components/charts/RevenueAreaChart";
import PaymentLineChart from "../../components/charts/PaymentLineChart";
import RefundBarChart from "../../components/charts/RefundBarChart";
import CouponBarChart from "../../components/charts/CouponBarChart";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import "../../styles/Charts.css";

function AdminReports() {
  const [exportingUsers, setExportingUsers] = useState(false);
  const [exportingOrders, setExportingOrders] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: getDashboardStats,
  });

  const exportUsersToCSV = async () => {
    setExportingUsers(true);
    try {
      const users = await getAllUsers();
      const csv = Papa.unparse(users.map(u => ({
        ID: u.id,
        Name: u.name || u.username,
        Email: u.email,
        Role: u.role,
        IsBanned: u.isBanned,
        JoinedDate: u.createdAt ? new Date(u.createdAt).toISOString() : ""
      })));
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `users_report_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Users exported successfully!");
    } catch (error) {
      toast.error("Failed to export users");
    } finally {
      setExportingUsers(false);
    }
  };

  const exportOrdersToCSV = async () => {
    setExportingOrders(true);
    try {
      const orders = await getAdminOrders();
      const csv = Papa.unparse(orders.map(o => ({
        OrderID: o.id,
        CustomerName: o.userName,
        CustomerEmail: o.userEmail,
        DealTitle: o.dealTitle,
        Quantity: o.quantity,
        Price: o.price,
        Status: o.status,
        Date: new Date(o.createdAt).toISOString()
      })));
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `orders_report_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Orders exported successfully!");
    } catch (error) {
      toast.error("Failed to export orders");
    } finally {
      setExportingOrders(false);
    }
  };

  if (isLoading) return <div className="p-6"><SkeletonLoader type="dealDetails" /></div>;

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
          <p className="font-bold text-slate-900 dark:text-white truncate max-w-[150px]">
            {row.title}
          </p>
        </div>
      ),
    },
    {
      header: "Price",
      render: (row) => (
        <span className="deal-price-badge">
          ${(row.salePrice || row.discountPrice || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Rating",
      render: (row) => (
        <span className="deal-rating-badge">
          <Star className="w-3 h-3 fill-current" />
          {row.averageRating?.toFixed(1) || "—"}
          <span style={{ opacity: 0.6, fontWeight: 500 }}>({row.reviewCount || 0})</span>
        </span>
      ),
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: "flex", flexDirection: "column", gap: "28px" }}
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="reports-header">
        <h1 className="reports-header__title">Platform Reports & Analytics</h1>
        <p className="reports-header__subtitle">
          View real-time analytics and download comprehensive CSV reports for offline analysis.
        </p>
      </motion.div>

      {/* Charts Grid — 4 columns desktop, 2 tablet, 1 mobile */}
      <motion.div variants={itemVariants} className="charts-grid">
        <RevenueAreaChart data={stats?.monthlyRevenueData} />
        <PaymentLineChart data={stats?.paymentsTrendData} />
        <RefundBarChart data={stats?.refundTrendData} />
        <CouponBarChart data={stats?.couponUsageData} />
      </motion.div>

      {/* Bottom Row: Top Deals + Export Tools */}
      <motion.div variants={itemVariants} className="reports-bottom-row">
        {/* Top Selling Deals */}
        <div className="top-deals-card">
          <div className="top-deals-card__header">
            <h3 className="top-deals-card__title">
              Top Selling Deals
              <span className="top-deals-card__count">
                {(stats?.topDeals || []).length} deals
              </span>
            </h3>
          </div>
          <div className="top-deals-card__body">
            <AdminDataTable
              columns={topDealColumns}
              data={stats?.topDeals || []}
              emptyMessage="No Reports Available"
              emptyDescription="Check back later when sales data has been recorded."
            />
          </div>
        </div>

        {/* Export Tools */}
        <div className="export-card">
          <div className="export-card__header">
            <h3 className="export-card__title">Export Tools</h3>
            <p className="export-card__desc">
              Download platform data as CSV for external analysis and record-keeping.
            </p>
          </div>

          <div className="export-card__actions">
            <button
              onClick={exportUsersToCSV}
              disabled={exportingUsers}
              className="export-btn export-btn--users"
            >
              {exportingUsers ? (
                <>
                  <span className="export-btn__spinner" />
                  <span>Generating Users…</span>
                </>
              ) : (
                <>
                  <UsersIcon size={17} />
                  <span>Export Users CSV</span>
                </>
              )}
            </button>

            <div className="export-card__divider">or</div>

            <button
              onClick={exportOrdersToCSV}
              disabled={exportingOrders}
              className="export-btn export-btn--orders"
            >
              {exportingOrders ? (
                <>
                  <span className="export-btn__spinner" />
                  <span>Generating Orders…</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={17} />
                  <span>Export Orders CSV</span>
                </>
              )}
            </button>
          </div>

          <div className="export-card__meta">
            <p className="export-card__meta-text">
              <Shield size={12} />
              Reports contain no sensitive information
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default AdminReports;
