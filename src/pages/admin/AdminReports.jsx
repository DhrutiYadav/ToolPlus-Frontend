import React, { useState } from "react";
import {
  Users as UsersIcon,
  ShoppingCart,
  Shield,
  Star,
} from "lucide-react";
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
// import { Star } from "lucide-react";
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
      const csv = Papa.unparse(
        users.map((u) => ({
          ID: u.id,
          Name: u.name || u.username,
          Email: u.email,
          Role: u.role,
          IsBanned: u.isBanned,
          JoinedDate: u.createdAt ? new Date(u.createdAt).toISOString() : "",
        })),
      );
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
      const csv = Papa.unparse(
        orders.map((o) => ({
          OrderID: o.id,
          CustomerName: o.userName,
          CustomerEmail: o.userEmail,
          DealTitle: o.dealTitle,
          Quantity: o.quantity,
          Price: o.price,
          Status: o.status,
          Date: new Date(o.createdAt).toISOString(),
        })),
      );
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `orders_report_${new Date().getTime()}.csv`,
      );
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

  if (isLoading)
    return (
      <div className="p-6">
        <SkeletonLoader type="dealDetails" />
      </div>
    );

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
        <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
          ${(row.salePrice || row.discountPrice || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Rating",
      render: (row) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
          <Star className="w-3 h-3 fill-current" />
          {row.averageRating?.toFixed(1) || "—"}
          <span style={{ opacity: 0.6, fontWeight: 500 }}>
            ({row.reviewCount || 0})
          </span>
        </span>
      ),
    },
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
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-7"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Platform Reports & Analytics
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          View real-time analytics and download comprehensive CSV reports for
          offline analysis.
        </p>
      </motion.div>

      {/* Charts Grid — 4 columns desktop, 2 tablet, 1 mobile */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
      >
        <RevenueAreaChart data={stats?.monthlyRevenueData} />
        <PaymentLineChart data={stats?.paymentsTrendData} />
        <RefundBarChart data={stats?.refundTrendData} />
        <CouponBarChart data={stats?.couponUsageData} />
      </motion.div>

      {/* Bottom Row: Top Deals + Export Tools */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        {/* Top Selling Deals */}
        <div className="xl:col-span-2 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-700">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              Top Selling Deals
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                {(stats?.topDeals || []).length} deals
              </span>
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            <AdminDataTable
              columns={topDealColumns}
              data={stats?.topDeals || []}
              emptyMessage="No Reports Available"
              emptyDescription="Check back later when sales data has been recorded."
            />
          </div>
        </div>

        {/* Export Tools */}
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Export Tools
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Download platform data as CSV for external analysis and
              record-keeping.
            </p>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <button
              onClick={exportUsersToCSV}
              disabled={exportingUsers}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportingUsers ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Generating Users…</span>
                </>
              ) : (
                <>
                  <UsersIcon size={17} />
                  <span>Export Users CSV</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              OR
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <button
              onClick={exportOrdersToCSV}
              disabled={exportingOrders}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exportingOrders ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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

          <div className="mt-auto border-t border-slate-200 pt-5 dark:border-slate-700">
            <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
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
