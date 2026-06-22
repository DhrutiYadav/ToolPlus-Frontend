import React, { useState } from "react";
import { Download } from "lucide-react";
import Papa from "papaparse";
import { toast } from "react-toastify";
import { getAllUsers } from "../../api/userApi";
import { getAdminOrders, getDashboardStats } from "../../services/adminService";
import { useQuery } from "@tanstack/react-query";
import SkeletonLoader from "../../components/SkeletonLoader";
import AdminDataTable from "../../components/AdminDataTable";

function MiniBarChart({ data, color, label }) {
  const maxVal = Math.max(...(data || []).map((d) => d.value), 1);
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-800 dark:text-white">
          {label}
        </h4>
      </div>
      <div className="flex items-end gap-1.5 flex-1 min-h-[100px]">
        {(data || []).map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 group">
            <div
              className="w-full rounded-t-md transition-all duration-300 group-hover:opacity-80 min-h-[4px]"
              style={{
                height: `${Math.max((item.value / maxVal) * 100, 5)}%`,
                backgroundColor: color,
                opacity: 0.8 + (idx / (data?.length || 1)) * 0.2,
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
        <span className="font-bold text-slate-800 dark:text-slate-200">
          ${(row.salePrice || row.discountPrice || 0).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Reviews",
      render: (row) => (
        <span className="text-slate-600 dark:text-slate-400">
          {row.reviewCount || 0}
        </span>
      ),
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Platform Reports & Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">View real-time analytics and download comprehensive CSV reports for offline analysis.</p>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={stats?.monthlyRevenueData}
            color="#10b981"
            label="Monthly Revenue"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={stats?.paymentsTrendData}
            color="#f97316"
            label="Payment Trends"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={stats?.refundTrendData}
            color="#f43f5e"
            label="Refund Trends"
          />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
          <MiniBarChart
            data={stats?.couponUsageData}
            color="#8b5cf6"
            label="Coupon Usage"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
              <span>Top Selling Deals</span>
            </h3>
          </div>
          <div className="p-1">
            <AdminDataTable
              columns={topDealColumns}
              data={stats?.topDeals || []}
              emptyMessage="No Reports Available"
              emptyDescription="Check back later."
            />
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Export Tools</h3>
          <div className="space-y-4">
            <button 
              onClick={exportUsersToCSV}
              disabled={exportingUsers}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70"
            >
              {exportingUsers ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Generating Users...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Export Users CSV</span>
                </>
              )}
            </button>
            <button 
              onClick={exportOrdersToCSV}
              disabled={exportingOrders}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors disabled:opacity-70"
            >
              {exportingOrders ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  <span>Generating Orders...</span>
                </>
              ) : (
                <>
                  <Download size={18} />
                  <span>Export Orders CSV</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default AdminReports;
