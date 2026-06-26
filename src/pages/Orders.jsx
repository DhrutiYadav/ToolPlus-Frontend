import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, requestRefund, cancelOrder } from "../services/orderService";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";
import { motion } from "framer-motion";
import AdminConfirmDialog from "../components/AdminConfirmDialog";
import AdminModal from "../components/AdminModal";

const STATUS_FLOW = ["Placed", "Processing", "Completed"];

function getTimelineStep(status) {
  const s = (status || "").toLowerCase();
  if (s === "cancelled" || s === "refunded" || s === "refundrequested") return -1;
  if (s === "pending" || s === "awaitingpayment") return 0;
  if (s === "paid" || s === "processing") return 1;
  if (s === "completed") return 2;
  return 0;
}

function OrderTimeline({ status }) {
  const s = (status || "").toLowerCase();
  const isCancelled = s === "cancelled" || s === "refunded" || s === "refundrequested";
  const activeStep = getTimelineStep(status);

  if (isCancelled) {
    return (
      <div className="order-timeline d-flex align-items-center gap-2 mt-3 flex-wrap">
        <span className="text-slate-400 dark:text-slate-500 fs-8 fw-semibold text-uppercase">Order Status:</span>
        <span className="badge rounded-pill px-3 py-1 fs-8 fw-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          {s === "refundrequested" ? "Refund Requested" : status}
        </span>
      </div>
    );
  }

  return (
    <div className="order-timeline d-flex align-items-center gap-0 mt-3">
      {STATUS_FLOW.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="d-flex flex-column align-items-center">
            <div
              className={`timeline-dot rounded-circle d-flex align-items-center justify-content-center transition-all ${
                idx <= activeStep
                  ? "bg-orange-500 text-white"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400"
              }`}
              style={{ width: 28, height: 28, fontSize: 12, fontWeight: 700 }}
            >
              {idx < activeStep ? <i className="bi bi-check"></i> : idx + 1}
            </div>
            <span className={`fs-9 mt-1 fw-semibold ${idx <= activeStep ? "text-orange-500" : "text-slate-400 dark:text-slate-600"}`}
              style={{ fontSize: "0.65rem", whiteSpace: "nowrap" }}>
              {step}
            </span>
          </div>
          {idx < STATUS_FLOW.length - 1 && (
            <div className={`flex-grow-1 transition-all mb-3`}
              style={{
                height: 2,
                background: idx < activeStep ? "#f97316" : "#e2e8f0",
                minWidth: 20,
                maxWidth: 60,
                transition: "background 0.3s ease"
              }}
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

  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "https://localhost:7033";
  const getImageUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  };

  const getStatusBadge = (status) => {
    const s = (status || "Completed").toLowerCase();
    let bg = "bg-slate-100 dark:bg-slate-800";
    let text = "text-slate-600 dark:text-slate-400";
    if (s === "paid") { bg = "bg-green-100 dark:bg-green-900/30"; text = "text-green-700 dark:text-green-400"; }
    else if (s === "completed") { bg = "bg-emerald-100 dark:bg-emerald-900/30"; text = "text-emerald-700 dark:text-emerald-400"; }
    else if (s === "refundrequested" || s === "pending") { bg = "bg-orange-100 dark:bg-orange-900/30"; text = "text-orange-700 dark:text-orange-400"; }
    else if (s === "refunded" || s === "cancelled") { bg = "bg-gray-100 dark:bg-gray-800"; text = "text-gray-600 dark:text-gray-400"; }
    return (
      <span className={`${bg} ${text}`} style={{ padding: '8px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: 700, display: 'inline-block' }}>
        {status}
      </span>
    );
  };

  const formatDateMain = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const formatDateSecondary = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  // Filter orders by tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === "All") return true;
    const s = (order.status || "").toLowerCase();
    if (activeTab === "Completed") return s === "completed" || s === "paid";
    if (activeTab === "Cancelled") return s === "cancelled";
    if (activeTab === "Refunded") return s === "refunded" || s === "refundrequested";
    return true;
  });

  return (
    <div className="orders-page py-5 container">
      <style>{`
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
      `}</style>

      {/* Cancel Confirm Dialog */}
      <AdminConfirmDialog
        isOpen={confirmOpen}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        confirmText="Yes, Cancel Order"
        cancelText="Keep Order"
        onConfirm={handleConfirmCancel}
        onCancel={() => { setConfirmOpen(false); setPendingCancelId(null); }}
      />

      {/* Refund Reason Modal */}
      <AdminModal
        isOpen={refundModalOpen}
        onClose={() => { setRefundModalOpen(false); setRefundReason(""); setPendingRefundId(null); }}
        title="Request a Refund"
        size="md"
      >
        <div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
            Please describe the reason for your refund request. Our team will review it within 2–3 business days.
          </p>
          <label className="form-label fw-bold text-slate-900 dark:text-white fs-7">
            Refund Reason <span className="text-rose-500">*</span>
          </label>
          <textarea
            className="form-control bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
            rows={4}
            placeholder="e.g. The product did not meet my expectations..."
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            disabled={refundSubmitting}
          />
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={() => { setRefundModalOpen(false); setRefundReason(""); setPendingRefundId(null); }}
              disabled={refundSubmitting}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger rounded-pill px-4 fw-bold"
              onClick={handleSubmitRefund}
              disabled={refundSubmitting}
            >
              {refundSubmitting ? (
                <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...</>
              ) : "Submit Refund Request"}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Page Header */}
      <div className="d-flex flex-column" style={{ marginBottom: '32px' }}>
        <div className="d-flex align-items-center gap-3 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" fill="currentColor" className="text-slate-800 dark:text-white" viewBox="0 0 16 16">
            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.239zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z"/>
          </svg>
          <h1 className="text-slate-900 dark:text-white mb-0" style={{ fontSize: '44px', fontWeight: 800 }}>My Purchase History</h1>
        </div>
        <p className="mb-0" style={{ fontSize: '18px', color: '#64748b' }}>Review and manage your lifetime software keys and billing status.</p>
      </div>

      {/* Filter Tabs */}
      {!loading && orders.length > 0 && (
        <div className="d-flex gap-2 mb-4 flex-wrap p-2 bg-white dark:bg-slate-900 rounded-pill shadow-sm border border-slate-100 dark:border-slate-800 d-inline-flex transition-colors">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              className={`tab-filter-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {tab !== "All" && (
                <span className="ms-1" style={{ fontSize: 12, opacity: 0.7 }}>
                  ({orders.filter(o => {
                    const s = (o.status || "").toLowerCase();
                    if (tab === "Completed") return s === "completed" || s === "paid";
                    if (tab === "Cancelled") return s === "cancelled";
                    if (tab === "Refunded") return s === "refunded" || s === "refundrequested";
                    return true;
                  }).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="py-4"><SkeletonLoader type="table" /></div>
      ) : filteredOrders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="text-center py-5 rounded-[24px] bg-white dark:bg-[#0f172a] transition-colors d-flex flex-column align-items-center justify-content-center gap-3"
          style={{ boxShadow: "0 8px 30px rgba(0,0,0,0.06)", border: "1px solid rgba(255,255,255,0.08)", minHeight: '400px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#e2e8f0" className="mb-3 dark:opacity-20" viewBox="0 0 16 16">
            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
          </svg>
          <h4 className="fw-bold text-slate-900 dark:text-white" style={{ fontSize: '28px' }}>
            {activeTab === "All" ? "No Purchases Yet" : `No ${activeTab} Orders`}
          </h4>
          <p className="text-slate-500 dark:text-slate-400 mb-4" style={{ maxWidth: "400px", fontSize: '16px' }}>
            {activeTab === "All"
              ? "Looks like you haven't made any purchases yet. Browse our marketplace to discover incredible software tools."
              : `You have no ${activeTab.toLowerCase()} orders yet.`}
          </p>
          <Link to="/deals" className="btn btn-primary rounded-pill fw-bold shadow-sm hover-lift" style={{ padding: '14px 32px', fontSize: '16px', background: 'linear-gradient(to right, #ff6b00, #ff8c00)', border: 'none', color: 'white' }}>
            {activeTab === "All" ? "Browse Deals" : "View All Orders"}
          </Link>
        </motion.div>
      ) : (
        <div className="d-flex flex-column" style={{ gap: '28px' }}>
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.orderId}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: index * 0.06 }}
              className="order-card"
            >
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-4" style={{ padding: '24px 28px' }}>
                {/* Column 1: Items */}
                <div className="flex-grow-1 w-100">
                  <div className="d-flex flex-column gap-3">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center gap-3">
                        {item.imageUrl ? (
                          <img src={getImageUrl(item.imageUrl)} alt={item.dealTitle} className="object-cover bg-[#F8FAFC] dark:bg-slate-800" style={{ width: '64px', height: '64px', borderRadius: '14px' }} />
                        ) : (
                          <div className="d-flex justify-content-center align-items-center bg-[#F8FAFC] dark:bg-slate-800" style={{ width: '64px', height: '64px', borderRadius: '14px' }}>
                            <span style={{ fontSize: '24px' }}>📦</span>
                          </div>
                        )}
                        <div>
                          <Link to={`/deals/${item.dealId}`} className="text-decoration-none">
                            <h3 className="mb-1 product-title">{item.dealTitle || `Deal Code #${item.dealId}`}</h3>
                          </Link>
                          <div className="d-flex align-items-center gap-3">
                            <span style={{ fontSize: '14px', color: '#64748b' }}>Qty: {item.quantity}</span>
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Order ID: #{order.orderId}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Order timeline */}
                  <OrderTimeline status={order.status} />
                </div>

                {/* Column 2: Date */}
                <div className="d-flex flex-column align-items-start w-100 w-lg-auto" style={{ minWidth: '150px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 600 }} className="text-slate-900 dark:text-slate-200">{formatDateMain(order.createdAt)}</span>
                  <span style={{ fontSize: '14px', color: '#64748b' }} className="mt-1">{formatDateSecondary(order.createdAt)}</span>
                </div>

                {/* Column 3: Price */}
                <div className="d-flex align-items-center w-100 w-lg-auto" style={{ minWidth: '120px' }}>
                  <div style={{ fontSize: '30px', fontWeight: 800, color: '#ff6b00', textShadow: '0 0 10px rgba(255,107,0,.15)' }}>
                    ₹{(order.subtotal || 0).toFixed(2)}
                  </div>
                </div>

                {/* Column 4: Status & Actions */}
                <div className="d-flex flex-column align-items-start align-items-lg-end gap-3 w-100 w-lg-auto" style={{ minWidth: '160px' }}>
                  <div>{getStatusBadge(order.status)}</div>
                  {['Completed', 'Paid'].includes(order.status) && (
                    <button className="refund-btn w-100 mt-1" onClick={() => handleRefund(order.orderId)}>Request Refund</button>
                  )}
                  {['Pending', 'AwaitingPayment'].includes(order.status) && (
                    <button className="cancel-btn w-100 mt-1" onClick={() => handleCancel(order.orderId)}>Cancel Order</button>
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
