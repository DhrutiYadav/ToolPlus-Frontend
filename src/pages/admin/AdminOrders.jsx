import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminOrders, updateOrderStatus, deleteAdminOrder } from "../../services/adminService";
import AdminLoadingSpinner from "../../components/AdminLoadingSpinner";
import AdminDataTable from "../../components/AdminDataTable";
import AdminStatusBadge from "../../components/AdminStatusBadge";
import AdminSearchBar from "../../components/AdminSearchBar";
import AdminPagination from "../../components/AdminPagination";
import AdminConfirmDialog from "../../components/AdminConfirmDialog";
import { toast } from "react-toastify";
import { Eye, Trash2, Download, CheckSquare, X, Receipt, Clock, CreditCard, User, Box } from "lucide-react";

function AdminOrders() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals / Drawer States
  const [viewOrder, setViewOrder] = useState(null);
  const [deleteOrder, setDeleteOrder] = useState(null);
  const [actionType, setActionType] = useState(null); // 'bulkDelete' | 'bulkStatus'

  // Queries
  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ["adminOrders"],
    queryFn: getAdminOrders,
  });

  // Mutations
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order status"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Order deleted successfully");
      setDeleteOrder(null);
    },
    onError: () => toast.error("Failed to delete order record"),
  });

  if (isLoading) return <AdminLoadingSpinner fullPage={true} />;
  if (error) return <div className="text-rose-500 font-bold p-6">Failed to load platform orders.</div>;

  // Filter orders based on Search Term
  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      (o.id && String(o.id).includes(term)) ||
      (o.userEmail && o.userEmail.toLowerCase().includes(term)) ||
      (o.dealTitle && o.dealTitle.toLowerCase().includes(term)) ||
      (o.status && o.status.toLowerCase().includes(term))
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = (orderId, newStatus) => {
    statusMutation.mutate({ id: orderId, status: newStatus });
    if (viewOrder && viewOrder.id === orderId) {
      setViewOrder({ ...viewOrder, status: newStatus });
    }
  };

  const handleApproveRefund = async (orderId) => {
    if (window.confirm("Are you sure you want to approve this refund?")) {
      try {
        await import("../../services/orderService").then(m => m.approveRefund(orderId));
        queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
        toast.success("Refund approved successfully");
      } catch (error) {
        toast.error("Failed to approve refund");
      }
    }
  };

  const handleBulkActionConfirm = async () => {
    if (actionType === "bulkDelete") {
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id);
      }
      setSelectedIds([]);
      toast.success(`${selectedIds.length} orders deleted`);
    } else if (actionType === "bulkComplete") {
      for (const id of selectedIds) {
        await statusMutation.mutateAsync({ id, status: "Completed" });
      }
      setSelectedIds([]);
      toast.success(`${selectedIds.length} orders marked completed`);
    }
    setActionType(null);
  };

  const handleExport = (type) => {
    toast.info(`Exporting orders to ${type}...`);
  };

  const columns = [
    { 
      header: "Order ID", 
      accessor: "id",
      render: (row) => <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">#{row.id}</span>
    },
    {
      header: "Customer",
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{row.userName || row.userEmail?.split("@")[0]}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{row.userEmail}</p>
        </div>
      ),
    },
    { 
      header: "Deal Title", 
      render: (row) => <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px] block">{row.dealTitle}</span> 
    },
    {
      header: "Price",
      render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">${row.price?.toFixed(2)}</span>,
    },
    {
      header: "Status Selection",
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300"
          disabled={row.status === "RefundRequested" || row.status === "Refunded"}
        >
          <option value="Pending">Pending</option>
          <option value="AwaitingPayment">Awaiting Payment</option>
          <option value="Paid">Paid</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="RefundRequested">Refund Requested</option>
          <option value="Refunded">Refunded</option>
          <option value="Failed">Failed</option>
        </select>
      ),
    },
    {
      header: "Status Badge",
      render: (row) => <AdminStatusBadge status={row.status} type="order" />,
    },
    {
      header: "Date",
      render: (row) => <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{new Date(row.createdAt).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.status === "RefundRequested" && (
            <>
              <button
                onClick={() => handleApproveRefund(row.id)}
                className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded hover:bg-emerald-200 transition-colors"
                title="Approve Refund"
              >
                Approve Refund
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to cancel this refund request?")) {
                    handleStatusChange(row.id, "Completed");
                  }
                }}
                className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded hover:bg-rose-200 transition-colors ml-2"
                title="Cancel Refund"
              >
                Cancel Refund
              </button>
            </>
          )}
          <button
            onClick={() => setViewOrder(row)}
            className="p-1.5 text-slate-400 hover:text-orange-500 transition-colors"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          <button
            onClick={() => setDeleteOrder(row)}
            className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
            title="Delete Order"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Controls */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <AdminSearchBar
            placeholder="Search by Order ID, Email, Deal, or Status..."
            onSearch={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
          />
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button 
              onClick={() => handleExport("CSV")}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm whitespace-nowrap"
            >
              <Download size={16} />
              <span>CSV</span>
            </button>
            <button 
              onClick={() => handleExport("Excel")}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl font-bold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors text-sm whitespace-nowrap"
            >
              <Download size={16} />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl animate-fade-in-up">
            <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-400 font-bold text-sm px-2">
              <CheckSquare size={18} />
              <span>{selectedIds.length} orders selected</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActionType("bulkComplete")}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-500 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
              >
                Mark Completed
              </button>
              <button
                onClick={() => setActionType("bulkDelete")}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-500 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <AdminDataTable 
        columns={columns} 
        data={paginatedOrders} 
        emptyMessage="No orders match search parameters."
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Order Details Drawer */}
      <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${viewOrder ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${viewOrder ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Order Details</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">ID: #{viewOrder?.id}</p>
            </div>
            <button 
              onClick={() => setViewOrder(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          {viewOrder && (
            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              
              {/* Status Section */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300">Current Status</span>
                <AdminStatusBadge status={viewOrder.status} type="order" />
              </div>

              {/* Customer Info */}
              <div>
                <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <User size={14} className="mr-2" /> Customer Information
                </h4>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 shadow-sm">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Name</p>
                    <p className="font-bold text-slate-900 dark:text-white">{viewOrder.userName || viewOrder.userEmail?.split("@")[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Email Address</p>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{viewOrder.userEmail}</p>
                  </div>
                </div>
              </div>

              {/* Deal Info */}
              <div>
                <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <Box size={14} className="mr-2" /> Deal Information
                </h4>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 shadow-sm">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Product</p>
                    <p className="font-bold text-slate-900 dark:text-white">{viewOrder.dealTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Quantity Purchased</p>
                    <p className="font-bold text-slate-900 dark:text-white">{viewOrder.quantity} code(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Amount Paid</p>
                    <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">${viewOrder.price?.toFixed(2)}</p>
                  </div>
                  {viewOrder.couponCode && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-2.5 mt-2.5">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Coupon Applied</p>
                      <p className="font-mono text-sm font-bold text-orange-500">
                        {viewOrder.couponCode}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Discount Amount</p>
                      <p className="font-semibold text-rose-500">
                        -${viewOrder.discountAmount?.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice & Payment */}
              <div>
                <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  <Receipt size={14} className="mr-2" /> Invoice Details
                </h4>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Payment Method</span>
                    <span className="text-sm font-semibold flex items-center text-slate-800 dark:text-slate-200">
                      <CreditCard size={14} className="mr-1.5" /> Credit Card
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Purchase Date</span>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{new Date(viewOrder.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-sm text-slate-500 dark:text-slate-400">Transaction ID</span>
                    <span className="text-sm font-mono text-slate-800 dark:text-slate-200">TXN-{viewOrder.id}-001</span>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="flex items-center text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  <Clock size={14} className="mr-2" /> Order Timeline
                </h4>
                <div className="relative pl-4 space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="absolute left-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-4 ring-white dark:ring-slate-900"></div>
                      <div className="ml-6">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Order Placed</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(viewOrder.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`absolute left-0 w-2.5 h-2.5 ${viewOrder.status === 'Completed' ? 'bg-emerald-500' : viewOrder.status === 'Cancelled' ? 'bg-rose-500' : 'bg-amber-500'} rounded-full ring-4 ring-white dark:ring-slate-900`}></div>
                      <div className="ml-6">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Status Updated to {viewOrder.status}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">System Note</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Drawer Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
             <button 
                onClick={() => setViewOrder(null)}
                className="px-5 py-2.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
             >
               Close Details
             </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!deleteOrder}
        title="Delete Order Record?"
        message={`Are you sure you want to permanently delete Order #${deleteOrder?.id}? This will remove it from the system records, but does not process any refund.`}
        onConfirm={() => deleteMutation.mutate(deleteOrder.id)}
        onCancel={() => setDeleteOrder(null)}
        confirmText="Confirm Delete"
      />

      {/* Bulk Action Confirmation */}
      <AdminConfirmDialog
        isOpen={["bulkDelete", "bulkComplete"].includes(actionType)}
        title={`${actionType === "bulkDelete" ? "Delete" : "Complete"} ${selectedIds.length} Orders?`}
        message={`Are you sure you want to ${actionType === "bulkDelete" ? "permanently delete" : "mark as completed"} ${selectedIds.length} orders?`}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setActionType(null)}
        confirmText={actionType === "bulkDelete" ? "Delete All Selected" : "Complete All Selected"}
      />
    </div>
  );
}

export default AdminOrders;
