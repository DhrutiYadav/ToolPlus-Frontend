import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminReviews, deleteAdminReview } from "../../services/adminService";
import { getDeals } from "../../services/dealService";
import SkeletonLoader from "../../components/SkeletonLoader";
import AdminDataTable from "../../components/AdminDataTable";
import AdminSearchBar from "../../components/AdminSearchBar";
import AdminPagination from "../../components/AdminPagination";
import AdminConfirmDialog from "../../components/AdminConfirmDialog";
import { toast } from "react-toastify";
import { Trash2, Star, MessageSquare, AlertCircle, ThumbsUp, CheckCircle, XCircle } from "lucide-react";
import { approveReview, rejectReview } from "../../api/reviewApi";

function AdminReviews() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8; // we'll fetch a bit more for local filtering since API only has searchTerm
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionType, setActionType] = useState(null); // 'bulkDelete'

  // Dialog State
  const [deleteReview, setDeleteReview] = useState(null);

  // Queries - fetch more to allow local rating filtering
  const { data: pagedData, isLoading, error } = useQuery({
    queryKey: ["adminReviews", searchTerm, 1], // Always fetch first page large for filtering mock
    queryFn: () => getAdminReviews(searchTerm, 1, 100),
  });

  const { data: dealsData } = useQuery({
    queryKey: ["adminAllDeals"],
    queryFn: getDeals,
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Review deleted successfully");
      setDeleteReview(null);
    },
    onError: () => toast.error("Failed to delete review moderation item"),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => approveReview(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      toast.success("Review approved");
    },
    onError: () => toast.error("Failed to approve review"),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectReview(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["adminReviews"] });
      toast.success("Review rejected");
    },
    onError: () => toast.error("Failed to reject review"),
  });

  if (isLoading) return <div className="p-6"><SkeletonLoader type="table" /></div>;
  if (error) return <div className="text-rose-500 font-bold p-6">Failed to load platform reviews.</div>;

  const allReviews = pagedData?.items || [];

  // Local filtering for rating
  const filteredReviews = allReviews.filter(review => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Pending") return review.rating <= 2; // Mock pending
    return review.rating === parseInt(activeFilter.charAt(0));
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredReviews.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReviews = filteredReviews.slice(startIndex, startIndex + pageSize);

  // Mock Analytics Data based on allReviews
  const avgRating = allReviews.length ? (allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length).toFixed(1) : "0.0";
  const total5Stars = allReviews.filter(r => r.rating === 5).length;
  const pendingCount = allReviews.filter(r => r.rating <= 2).length; // Mocking 1-2 star as pending/flagged

  const analyticsCards = [
    { title: "Average Rating", value: avgRating, icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    { title: "Total Reviews", value: allReviews.length, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
    { title: "5 Star Reviews", value: total5Stars, icon: ThumbsUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    { title: "Pending Moderation", value: pendingCount, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10" },
  ];

  const handleBulkActionConfirm = async () => {
    if (actionType === "bulkDelete") {
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id);
      }
      setSelectedIds([]);
      toast.success(`${selectedIds.length} reviews deleted`);
    }
    setActionType(null);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}
          />
        ))}
      </div>
    );
  };

  const columns = [
    {
      header: "Review Details",
      render: (row) => {
        const displayName = row.userName ? `${row.userName}` : (row.userEmail?.split("@")[0] || "User");
        const initial = displayName.charAt(0).toUpperCase();
        return (
          <div className="flex items-start space-x-4 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-sm mt-1">
              {initial}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <p className="font-bold text-slate-900 dark:text-white">{displayName}</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">{row.userRole || 'User'}</span>
              </div>
              <div className="mb-2">
                {renderStars(row.rating)}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 italic">"{row.comment}"</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Product",
      render: (row) => {
        // Fallback to default placeholder if deal details aren't found or missing image
        const dealImageUrl = dealsData?.find(d => d.id === row.dealId)?.imageSrc || "https://via.placeholder.com/100x100?text=No+Image";
        return (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
              <img src={dealImageUrl} alt="Deal" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-2">{row.dealTitle}</p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {row.dealId}</p>
            </div>
          </div>
        );
      },
    },
    {
      header: "Date",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{new Date(row.createdAt).toLocaleDateString()}</p>
          <p className="text-xs text-slate-400">{new Date(row.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
        </div>
      )
    },
    {
      header: "Status",
      render: (row) => {
        if (row.isApproved) {
          return <span className="badge bg-success">Approved</span>;
        } else if (row.isRejected) {
          return <span className="badge bg-danger">Rejected</span>;
        } else {
          return <span className="badge bg-warning text-dark">Pending</span>;
        }
      }
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center space-x-2">
          {!row.isApproved && !row.isRejected && (
            <button
              onClick={() => approveMutation.mutate(row.id)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:border-emerald-500/50 rounded-xl transition-all shadow-sm"
              title="Approve Review"
            >
              <CheckCircle size={16} />
            </button>
          )}
          {!row.isApproved && !row.isRejected && (
            <button
              onClick={() => rejectMutation.mutate(row.id)}
              className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-orange-500 hover:bg-orange-50 hover:border-orange-200 dark:hover:border-orange-500/50 rounded-xl transition-all shadow-sm"
              title="Reject Review"
            >
              <XCircle size={16} />
            </button>
          )}
          <button
            onClick={() => setDeleteReview(row)}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200 dark:hover:border-rose-500/50 rounded-xl transition-all shadow-sm"
            title="Delete Review"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const filters = ["All", "5★", "4★", "3★", "2★", "1★", "Pending"];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {analyticsCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 card-shadow hover-lift flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{card.title}</p>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">{card.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Controls & Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeFilter === filter 
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <AdminSearchBar
            placeholder="Search reviews..."
            onSearch={(val) => {
              setSearchTerm(val);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl animate-fade-in-up">
            <div className="flex items-center space-x-2 text-rose-700 dark:text-rose-400 font-bold text-sm px-2">
              <Trash2 size={18} />
              <span>{selectedIds.length} reviews selected</span>
            </div>
            <button
              onClick={() => setActionType("bulkDelete")}
              className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-sm font-bold hover:bg-rose-700 transition-colors shadow-sm"
            >
              Delete Selected
            </button>
          </div>
        )}
      </div>

      {/* Main Grid */}
      <AdminDataTable 
        columns={columns} 
        data={paginatedReviews} 
        emptyMessage="No Reviews Yet"
        emptyDescription="Check back later."
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredReviews.length)} of {filteredReviews.length} reviews
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteReview}
        title="Delete Review?"
        message={`Are you sure you want to permanently delete this review? This action cannot be undone.`}
        onConfirm={() => deleteMutation.mutate(deleteReview.id)}
        onCancel={() => setDeleteReview(null)}
        confirmText="Permanently Delete"
      />

      {/* Bulk Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={actionType === "bulkDelete"}
        title={`Delete ${selectedIds.length} Reviews?`}
        message={`Are you sure you want to permanently delete ${selectedIds.length} reviews? This action cannot be undone.`}
        onConfirm={handleBulkActionConfirm}
        onCancel={() => setActionType(null)}
        confirmText="Delete All Selected"
      />
    </div>
  );
}

export default AdminReviews;
