import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyOrders,
  requestRefund,
  cancelOrder,
} from "../services/orderService";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";
import { motion } from "framer-motion";
import AdminConfirmDialog from "../components/AdminConfirmDialog";
import { Check } from "lucide-react";
import AdminModal from "../components/AdminModal";

const STATUS_FLOW = ["Placed", "Processing", "Completed"];

function getTimelineStep(status) {
  const s = (status || "").toLowerCase();
  if (s === "cancelled" || s === "refunded" || s === "refundrequested")
    return -1;
  if (s === "pending" || s === "awaitingpayment") return 0;
  if (s === "paid" || s === "processing") return 1;
  if (s === "completed") return 2;
  return 0;
}

function OrderTimeline({ status }) {
  const s = (status || "").toLowerCase();
  const isCancelled =
    s === "cancelled" || s === "refunded" || s === "refundrequested";
  const activeStep = getTimelineStep(status);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 mt-6 flex-wrap">
        <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold uppercase">
          Order Status:
        </span>
        <span className="inline-block leading-none text-center whitespace-nowrap align-baseline rounded-full px-6 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          {s === "refundrequested" ? "Refund Requested" : status}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center mt-6 max-w-sm">
      {STATUS_FLOW.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`
                w-7
                h-7
                rounded-full
                flex
                items-center
                justify-center
                font-bold
                text-xs
                transition-all
                ${
                  idx <= activeStep
                    ? "bg-orange-500 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400"
                }
                `}
            >
              {idx < activeStep ? <Check size={14} /> : idx + 1}
            </div>
            <span
              className={`
                mt-1
                text-[11px]
                font-semibold
                ${idx <= activeStep ? "text-orange-500" : "text-slate-400 dark:text-slate-600"}
                `}
            >
              {step}
            </span>
          </div>
          {idx < STATUS_FLOW.length - 1 && (
            <div
              className={`
                flex-1
                h-0.5
                mx-2
                mb-6
                transition-colors
                ${idx < activeStep ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-700"}
                `}
            ></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const FILTER_TABS = ["All", "Completed", "Cancelled", "Refunded"];

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  // Cancel confirm dialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingCancelId, setPendingCancelId] = useState(null);

  // Refund modal state
  const [refundModalOpen, setRefundModalOpen] = useState(false);
  const [pendingRefundId, setPendingRefundId] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundSubmitting, setRefundSubmitting] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Could not load purchase history.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = (orderId) => {
    setPendingCancelId(orderId);
    setConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    setConfirmOpen(false);
    try {
      await cancelOrder(pendingCancelId);
      toast.success("Order cancelled successfully.");
      const data = await getMyOrders();
      setOrders(data || []);
    } catch (err) {
      toast.error("Failed to cancel order.");
    } finally {
      setPendingCancelId(null);
    }
  };

  const handleRefund = (orderId) => {
    setPendingRefundId(orderId);
    setRefundReason("");
    setRefundModalOpen(true);
  };

  const handleSubmitRefund = async () => {
    if (!refundReason.trim()) {
      toast.error("Please enter a reason for the refund.");
      return;
    }
    setRefundSubmitting(true);
    try {
      await requestRefund(pendingRefundId, refundReason);
      toast.success("Refund requested successfully.");
      const data = await getMyOrders();
      setOrders(data || []);
      setRefundModalOpen(false);
      setRefundReason("");
      setPendingRefundId(null);
    } catch (err) {
      toast.error("Failed to request refund.");
    } finally {
      setRefundSubmitting(false);
    }
  };

  const API_BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "https://localhost:7033";
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getStatusBadge = (status) => {
    const s = (status || "Completed").toLowerCase();
    let bg = "bg-slate-100 dark:bg-slate-800";
    let text = "text-slate-600 dark:text-slate-400";
    if (s === "paid") {
      bg = "bg-green-100 dark:bg-green-900/30";
      text = "text-green-700 dark:text-green-400";
    } else if (s === "completed") {
      bg = "bg-emerald-100 dark:bg-emerald-900/30";
      text = "text-emerald-700 dark:text-emerald-400";
    } else if (s === "refundrequested" || s === "pending") {
      bg = "bg-orange-100 dark:bg-orange-900/30";
      text = "text-orange-700 dark:text-orange-400";
    } else if (s === "refunded" || s === "cancelled") {
      bg = "bg-gray-100 dark:bg-gray-800";
      text = "text-gray-600 dark:text-gray-400";
    }
    return (
      <span
        className={`
          inline-flex
          items-center
          justify-center
          px-5
          py-2
          rounded-full
          text-xs
          font-bold
          ${bg}
          ${text}
          `}
      >
        {status}
      </span>
    );
  };

  const formatDateMain = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const formatDateSecondary = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "All") return true;
    const s = (order.status || "").toLowerCase();
    if (activeTab === "Completed") return s === "completed" || s === "paid";
    if (activeTab === "Cancelled") return s === "cancelled";
    if (activeTab === "Refunded")
      return s === "refunded" || s === "refundrequested";
    return true;
  });

  return (
    <div className="orders-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
      {/* <style>{`
          .order-card { background: white; border-radius: 24px; padding: 0; box-shadow: 0 8px 30px rgba(0,0,0,0.06); overflow: hidden; transition: all 0.3s ease; border: 1px solid transparent; }
          .dark .order-card { background: #0f172a; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
          .order-card:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .dark .order-card:hover { box-shadow: 0 10px 30px rgba(0,0,0,0.4); }
          .product-title { font-size: 22px; font-weight: 700; color: #0f172a; transition: color 0.2s; }
          .dark .product-title { color: #f8fafc; }
          .product-title:hover { color: #ff6b00; }
          .dark .product-title:hover { color: #ff8c00; }
          .refund-btn { height: 42px; padding: 0 22px; border-radius: 999px; border: 1px solid #ff4d6d; color: #ff4d6d; font-weight: 600; background: transparent; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; font-size: 14px; }
          .refund-btn:hover { background: #ff4d6d; color: white; }
          .cancel-btn { height: 42px; padding: 0 22px; border-radius: 999px; border: 1px solid #f59e0b; color: #f59e0b; font-weight: 600; background: transparent; transition: all 0.25s ease; display: flex; align-items: center; justify-content: center; font-size: 14px; }
          .cancel-btn:hover { background: #f59e0b; color: white; }
          .tab-filter-btn { border: none; background: transparent; padding: 8px 20px; border-radius: 999px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s ease; color: #64748b; }
          .tab-filter-btn.active { background: #fff7ed; color: #f97316; box-shadow: 0 2px 8px rgba(249,115,22,0.15); }
          .dark .tab-filter-btn { color: #94a3b8; }
          .dark .tab-filter-btn.active { background: rgba(249,115,22,0.1); color: #f97316; }
          .tab-filter-btn:hover:not(.active) { background: #f1f5f9; color: #374151; }
          .dark .tab-filter-btn:hover:not(.active) { background: #1e293b; color: #e2e8f0; }
        `}</style> */}

      {/* Cancel Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={confirmOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        onConfirm={handleConfirmCancel}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingCancelId(null);
        }}
      />

      {/* Refund Reason Modal */}
      <AdminModal
        isOpen={refundModalOpen}
        onClose={() => {
          setRefundModalOpen(false);
          setRefundReason("");
          setPendingRefundId(null);
        }}
        title="Request a Refund"
        size="md"
      >
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Please describe the reason for your refund request. Our team will
            review it within 2–3 business days.
          </p>
          <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
            Refund Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            rows={5}
            placeholder="Describe your refund reason..."
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              dark:border-slate-700
              bg-white
              dark:bg-slate-800
              px-4
              py-3
              text-slate-900
              dark:text-white
              placeholder:text-slate-400
              focus:outline-none
              focus:ring-2
              focus:ring-orange-500
              resize-none
            "
          />
          <div className="flex justify-end gap-2 mt-6">
            <button
              className="
                px-6
                py-2.5
                rounded-full
                border
                border-slate-300
                dark:border-slate-600
                bg-white
                dark:bg-slate-800
                text-slate-700
                dark:text-slate-300
                hover:bg-slate-100
                dark:hover:bg-slate-700
                transition-all
                duration-200
                "
              onClick={() => {
                setRefundModalOpen(false);
                setRefundReason("");
                setPendingRefundId(null);
              }}
              disabled={refundSubmitting}
            >
              Cancel
            </button>
            <button
              className="
                px-6
                py-2.5
                rounded-full
                bg-red-600
                hover:bg-red-700
                text-white
                font-bold
                transition-all
                duration-200
                "
              onClick={handleSubmitRefund}
              disabled={refundSubmitting}
            >
              {refundSubmitting ? (
                <>
                  <span
                    className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Submitting...
                </>
              ) : (
                "Submit Refund Request"
              )}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Page Header */}
      <div className="flex flex-col mb-8">
        <div className="flex items-center gap-3 mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            fill="currentColor"
            className="text-slate-800 dark:text-white"
            viewBox="0 0 16 16"
          >
            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.239zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
          </svg>
          <h1
            className="
              text-5xl
              font-extrabold
              text-slate-900
              dark:text-white
              "
          >
            My Purchase History
          </h1>
        </div>
        <p
          className="
            text-lg
            text-slate-500
            "
        >
          Review and manage your lifetime software keys and billing status.
        </p>
      </div>

      {/* Filter Tabs */}
      {!loading && orders.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap p-2 bg-white dark:bg-slate-900 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 inline-flex transition-colors">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              className={`
                px-5
                py-2
                rounded-full
                font-semibold
                text-sm
                transition-all
                duration-200
                ${
                  activeTab === tab
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-500 shadow"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }
                `}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab !== "All" && (
                <span className="ml-1">
                  (
                  {
                    orders.filter((o) => {
                      const s = (o.status || "").toLowerCase();
                      if (tab === "Completed")
                        return s === "completed" || s === "paid";
                      if (tab === "Cancelled") return s === "cancelled";
                      if (tab === "Refunded")
                        return s === "refunded" || s === "refundrequested";
                      return true;
                    }).length
                  }
                  )
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-6">
          <SkeletonLoader type="table" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="
            text-center
            py-12
            rounded-3xl
            bg-white
            dark:bg-slate-900
            shadow-lg
            border
            border-slate-200
            dark:border-slate-700
            min-h-[400px]
            flex
            flex-col
            items-center
            justify-center
            gap-3
            "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            fill="#e2e8f0"
            className="mb-6 dark:opacity-20"
            viewBox="0 0 16 16"
          >
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
          </svg>
          <h4
            className="
              text-3xl
              font-bold
              text-slate-900
              dark:text-white
              "
          >
            {activeTab === "All"
              ? "No Purchases Yet"
              : `No ${activeTab} Orders`}
          </h4>
          <p
            className="
              max-w-md
              text-base
              text-slate-500
              dark:text-slate-400
              mb-6
              "
          >
            {activeTab === "All"
              ? "Looks like you haven't made any purchases yet. Browse our marketplace to discover incredible software tools."
              : `You have no ${activeTab.toLowerCase()} orders yet.`}
          </p>
          <Link
            to="/deals"
            className="
              inline-flex
              items-center
              justify-center
              px-8
              py-3
              rounded-full
              font-bold
              text-white
              bg-gradient-to-r
              from-orange-500
              to-orange-600
              hover:from-orange-600
              hover:to-orange-700
              shadow-lg
              transition-all
              duration-300
            "
          >
            {activeTab === "All" ? "Browse Deals" : "View All Orders"}
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-7">
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="
              bg-white
              dark:bg-slate-900
              rounded-3xl
              border
              border-slate-200
              dark:border-slate-700
              shadow-lg
              hover:shadow-xl
              hover:-translate-y-1
              transition-all
              duration-300
              overflow-hidden
              "
            >
              <div
                className="
                  flex
                  flex-col
                  lg:flex-row
                  flex-wrap
                  items-start
                  lg:items-center
                  justify-between
                  gap-4
                  p-7
                  "
              >
                {/* Column 1: Items */}
                <div className="flex-1 w-full">
                  <div className="flex flex-col gap-3">
                    {order.items &&
                      order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img
                              src={getImageUrl(item.imageUrl)}
                              alt={item.dealTitle}
                              className="object-cover bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-xl"
                            />
                          ) : (
                            <div className="flex justify-center items-center bg-slate-50 dark:bg-slate-800 w-16 h-16 rounded-xl">
                              <span className="text-2xl">📦</span>
                            </div>
                          )}
                          <div>
                            <Link
                              to={`/deals/${item.dealId}`}
                              className="no-underline hover:no-underline"
                            >
                              <h3
                                className="
                                  mb-1
                                  text-2xl
                                  font-bold
                                  text-slate-900
                                  dark:text-white
                                  hover:text-orange-500
                                  dark:hover:text-orange-400
                                  transition-colors
                                  duration-200
                                "
                              >
                                {item.dealTitle || `Deal Code #${item.dealId}`}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-500 dark:text-slate-400">
                                Qty: {item.quantity}
                              </span>
                              <span className="text-xs text-slate-400">
                                Order ID: #{order.orderId}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {/* Order timeline */}
                  <OrderTimeline status={order.status} />
                </div>

                {/* Column 2: Date */}
                <div className="flex flex-col items-start w-full lg:w-auto min-w-[150px]">
                  <span
                    className="
                      text-base
                      font-semibold
                      text-slate-900
                      dark:text-slate-200
                      "
                  >
                    {formatDateMain(order.createdAt)}
                  </span>
                  <span className="mt-1 text-sm text-slate-500">
                    {formatDateSecondary(order.createdAt)}
                  </span>
                </div>

                {/* Column 3: Price */}
                <div className="flex items-center w-full lg:w-auto min-w-[120px]">
                  <div
                    className="
                      text-3xl
                      font-extrabold
                      text-orange-500
                      drop-shadow-[0_0_10px_rgba(255,107,0,0.15)]
                      "
                  >
                    ₹{(order.subtotal || 0).toFixed(2)}
                  </div>
                </div>

                {/* Column 4: Status & Actions */}
                <div
                  className="
                  flex
                  flex-col
                  items-start
                  lg:items-end
                  gap-3
                  w-full
                  lg:w-auto
                  min-w-[160px]
                  "
                >
                  <div>{getStatusBadge(order.status)}</div>
                  {["Completed", "Paid"].includes(order.status) && (
                    <button
                      className="
                        w-full
                        mt-1
                        h-11
                        rounded-full
                        border
                        border-rose-500
                        text-rose-500
                        font-semibold
                        hover:bg-rose-500
                        hover:text-white
                        transition-all
                        duration-200
                        "
                      onClick={() => handleRefund(order.orderId)}
                    >
                      Request Refund
                    </button>
                  )}
                  {["Pending", "AwaitingPayment"].includes(order.status) && (
                    <button
                      className="
                        w-full
                        mt-1
                        h-11
                        rounded-full
                        border
                        border-amber-500
                        text-amber-500
                        font-semibold
                        hover:bg-amber-500
                        hover:text-white
                        transition-all
                        duration-200
                        "
                      onClick={() => handleCancel(order.orderId)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
