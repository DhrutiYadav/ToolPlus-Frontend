import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, requestRefund, cancelOrder } from "../services/orderService";
import { toast } from "react-toastify";
import SkeletonLoader from "../components/SkeletonLoader";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleCancel = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await cancelOrder(orderId);
        toast.success("Order cancelled successfully.");
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        toast.error("Failed to cancel order.");
      }
    }
  };

  const handleRefund = async (orderId) => {
    const reason = window.prompt("Please enter a reason for the refund:");
    if (reason) {
      try {
        await requestRefund(orderId, reason);
        toast.success("Refund requested successfully.");
        const data = await getMyOrders();
        setOrders(data || []);
      } catch (err) {
        toast.error("Failed to request refund.");
      }
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
    if (s === "completed") return <span className="badge bg-emerald-500 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-2 py-1 transition-colors">Completed</span>;
    if (s === "pending") return <span className="badge bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 px-2 py-1 transition-colors">Pending</span>;
    if (s === "cancelled" || s === "refunded") return <span className="badge bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 px-2 py-1 transition-colors">Refunded</span>;
    return <span className="badge bg-slate-50 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400 border border-slate-200 dark:border-slate-500/30 px-2 py-1 transition-colors">{status}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="orders-page py-4">
      <div className="mb-4">
        <h1 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">My Purchase History</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Review and manage your lifetime software keys and billing status.</p>
      </div>

      {loading ? (
        <div className="py-4"><SkeletonLoader type="table" /></div>
      ) : orders.length === 0 ? (
        <div className="text-center py-5 border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 shadow-sm transition-colors empty-state-container d-flex flex-column align-items-center gap-2">
          <i className="bi bi-box text-muted" style={{ fontSize: '4rem' }}></i>
          <h4 className="fw-bold text-slate-900 dark:text-white transition-colors">No Orders Yet</h4>
          <p className="text-muted mx-auto mb-4 transition-colors" style={{ maxWidth: "400px" }}>
            Looks like you haven't made any purchases yet. Browse our marketplace to discover incredible software tools to boost your productivity.
          </p>
          <Link to="/deals" className="btn btn-primary rounded-pill px-5 py-2 fw-bold hover-lift shadow-sm">
            Browse Deals
          </Link>
        </div>
      ) : (
        <div className="card border border-slate-100 dark:border-slate-800 shadow-sm rounded-4 overflow-hidden bg-white dark:bg-slate-900 transition-colors">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800 text-uppercase fs-8 !text-slate-600 dark:!text-slate-400 transition-colors border-bottom border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4 bg-transparent border-0">Order Details</th>
                  <th className="py-3 bg-transparent border-0">Date Purchased</th>
                  <th className="py-3 text-end bg-transparent border-0">Total Paid</th>
                  <th className="py-3 text-center bg-transparent border-0">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  return (
                    <tr key={order.orderId} className="border-bottom border-slate-100 dark:border-slate-800 transition-colors">
                      <td className="py-3 px-4 bg-transparent border-0">
                        <div className="d-flex flex-column">
                          <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                            <span className="!text-slate-500 dark:!text-slate-400 fs-8 fw-semibold transition-colors">Order ID: #{order.orderId}</span>
                          </div>
                          
                          {/* Purchased Items List */}
                          <div className="d-flex flex-column gap-3 mt-2">
                            {order.items && order.items.map((item, idx) => (
                              <div key={idx} className="d-flex align-items-center">
                                {item.imageUrl ? (
                                  <img 
                                    src={getImageUrl(item.imageUrl)} 
                                    alt={item.dealTitle} 
                                    className="rounded me-3 shadow-sm" 
                                    style={{width: '48px', height: '48px', objectFit: 'cover'}} 
                                  />
                                ) : (
                                  <div 
                                    className="rounded me-3 bg-slate-100 dark:bg-slate-800 d-flex justify-content-center align-items-center shadow-sm" 
                                    style={{width: '48px', height: '48px'}}
                                  >
                                    <span className="text-slate-400 fs-5">📦</span>
                                  </div>
                                )}
                                <div>
                                  <Link 
                                    to={`/deals/${item.dealId}`} 
                                    className="fw-bold !text-slate-900 dark:!text-white text-decoration-none hover-primary transition-colors d-block mb-1"
                                  >
                                    {item.dealTitle || `Deal Code #${item.dealId}`}
                                  </Link>
                                  <span className="!text-slate-500 dark:!text-slate-400 fs-8 transition-colors">
                                    Qty: {item.quantity} × ₹{(item.price || 0).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 align-top !text-slate-700 dark:!text-slate-300 bg-transparent border-0 transition-colors">{formatDate(order.createdAt)}</td>
                      <td className="py-3 align-top text-end fw-extrabold !text-orange-500 dark:!text-orange-400 bg-transparent border-0 transition-colors">₹{(order.subtotal || 0).toFixed(2)}</td>
                      <td className="py-3 align-top text-center bg-transparent border-0">
                        {getStatusBadge(order.status)}
                        <div className="mt-3 d-flex flex-wrap gap-2 justify-content-center">
                        {['Completed', 'Paid'].includes(order.status) && (
                            <button 
                              className="btn btn-sm btn-outline-danger rounded-pill transition-colors fs-8 py-1 px-3"
                              onClick={() => handleRefund(order.orderId)}
                            >
                              Request Refund
                            </button>
                        )}
                        {['Pending', 'AwaitingPayment'].includes(order.status) && (
                            <button 
                              className="btn btn-sm btn-outline-warning rounded-pill transition-colors fs-8 py-1 px-3"
                              onClick={() => handleCancel(order.orderId)}
                            >
                              Cancel Order
                            </button>
                        )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Orders;
