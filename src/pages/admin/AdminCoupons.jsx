import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import couponService from "../../services/couponService";
import SkeletonLoader from "../../components/SkeletonLoader";
import AdminDataTable from "../../components/AdminDataTable";
import AdminStatusBadge from "../../components/AdminStatusBadge";
import AdminSearchBar from "../../components/AdminSearchBar";
import AdminPagination from "../../components/AdminPagination";
import AdminModal from "../../components/AdminModal";
import AdminConfirmDialog from "../../components/AdminConfirmDialog";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PlusCircle, Search, Edit2, Trash2, Tag, Percent, DollarSign, Calendar, AlertCircle, Pencil, Copy, Check, ToggleLeft, ToggleRight } from "lucide-react";

function AdminCoupons() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [copiedCode, setCopiedCode] = useState(null);

  // Modals / Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      discountType: "Percentage",
      isActive: true,
      minimumPurchaseAmount: 0,
      usageLimit: 100,
    }
  });

  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit, watch: watchEdit } = useForm();

  // Queries
  const { data: coupons = [], isLoading, error } = useQuery({
    queryKey: ["adminCoupons"],
    queryFn: couponService.getAllCoupons,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: couponService.createCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
      toast.success("Coupon created successfully");
      setIsCreateOpen(false);
      reset();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to create coupon";
      toast.error(msg);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => couponService.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
      toast.success("Coupon updated successfully");
      setEditCoupon(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to update coupon";
      toast.error(msg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: couponService.deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
      toast.success("Coupon deleted successfully");
      setDeleteId(null);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to delete coupon";
      toast.error(msg);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }) => 
      isActive ? couponService.deactivateCoupon(id) : couponService.activateCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCoupons"] });
      toast.success("Coupon status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });

  if (isLoading) return <div className="p-6"><SkeletonLoader type="table" /></div>;
  if (error) return <div className="text-rose-500 font-bold p-6">Failed to load platform coupons.</div>;

  // Search filter
  const filteredCoupons = coupons.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.code && c.code.toLowerCase().includes(term)) ||
      (c.description && c.description.toLowerCase().includes(term)) ||
      (c.discountType && c.discountType.toLowerCase().includes(term))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCoupons = filteredCoupons.slice(startIndex, startIndex + itemsPerPage);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied code: ${code}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatToBackendDate = (dateStr) => {
    if (!dateStr) return null;
    
    const trimmed = dateStr.trim();
    
    // 1. Check if it already starts with YYYY-MM-DDTHH:mm:ss
    const isoStandardRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/;
    const standardMatch = trimmed.match(isoStandardRegex);
    if (standardMatch) {
      return trimmed.slice(0, 19);
    }

    // 2. If it's in YYYY-MM-DDTHH:mm style (datetime-local format)
    const isoLocalRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
    const isoMatch = trimmed.match(isoLocalRegex);
    if (isoMatch) {
      return `${trimmed}:00`;
    }
    
    // 3. Check for DD-MM-YYYY hh:mm AM/PM format (e.g. 16-06-2026 12:00 AM)
    const dmyRegex = /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})\s*(AM|PM)$/i;
    const match = trimmed.match(dmyRegex);
    if (match) {
      const [_, day, month, year, hoursStr, minutes, ampm] = match;
      let hours = parseInt(hoursStr, 10);
      const upperAmpm = ampm.toUpperCase();
      if (upperAmpm === "PM" && hours < 12) {
        hours += 12;
      } else if (upperAmpm === "AM" && hours === 12) {
        hours = 0;
      }
      const paddedHours = String(hours).padStart(2, '0');
      const paddedMinutes = String(minutes).padStart(2, '0');
      return `${year}-${month}-${day}T${paddedHours}:${paddedMinutes}:00`;
    }
    
    // Fallback: try parsing with native Date and manually format local components
    try {
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
      }
    } catch (e) {
      console.error("Failed to parse date using fallback", e);
    }
    
    return trimmed;
  };

  const handleCreateSubmit = (data) => {
    const payload = {
      code: data.code,
      description: data.description || "",
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minimumPurchaseAmount: Number(data.minimumPurchaseAmount),
      maximumDiscountAmount: (data.maximumDiscountAmount === "" || data.maximumDiscountAmount === undefined || data.maximumDiscountAmount === null) ? null : Number(data.maximumDiscountAmount),
      startDate: formatToBackendDate(data.startDate),
      endDate: formatToBackendDate(data.endDate),
      usageLimit: Number(data.usageLimit),
      isActive: !!data.isActive,
    };
    console.log("Submitting Create Coupon Payload:", JSON.stringify(payload, null, 2));
    createMutation.mutate(payload);
  };

  const handleEditOpen = (coupon) => {
    setEditCoupon(coupon);
    resetEdit({
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumPurchaseAmount: coupon.minimumPurchaseAmount,
      maximumDiscountAmount: coupon.maximumDiscountAmount || "",
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 16) : "",
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().slice(0, 16) : "",
      usageLimit: coupon.usageLimit,
      isActive: coupon.isActive,
    });
  };

  const handleEditSubmit = (data) => {
    const payload = {
      id: editCoupon.id,
      code: data.code,
      description: data.description || "",
      discountType: data.discountType,
      discountValue: Number(data.discountValue),
      minimumPurchaseAmount: Number(data.minimumPurchaseAmount),
      maximumDiscountAmount: (data.maximumDiscountAmount === "" || data.maximumDiscountAmount === undefined || data.maximumDiscountAmount === null) ? null : Number(data.maximumDiscountAmount),
      startDate: formatToBackendDate(data.startDate),
      endDate: formatToBackendDate(data.endDate),
      usageLimit: Number(data.usageLimit),
      isActive: !!data.isActive,
    };
    console.log("Submitting Edit Coupon Payload:", JSON.stringify(payload, null, 2));
    updateMutation.mutate({ 
      id: editCoupon.id, 
      data: payload 
    });
  };

  // Usage statistics calculations
  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.isActive).length;
  const totalUsed = coupons.reduce((sum, c) => sum + c.usedCount, 0);
  const avgDiscount = coupons.length > 0 
    ? (coupons.reduce((sum, c) => sum + c.discountValue, 0) / coupons.length).toFixed(1)
    : "0";

  const columns = [
    {
      header: "Coupon Code",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <span className="font-mono text-sm font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
            {row.code}
          </span>
          <button 
            onClick={() => handleCopyCode(row.code)}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Copy Coupon Code"
          >
            {copiedCode === row.code ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          </button>
        </div>
      ),
    },
    {
      header: "Description",
      render: (row) => (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px] block" title={row.description}>
          {row.description || "No description"}
        </span>
      )
    },
    {
      header: "Discount",
      render: (row) => {
        const isPercent = row.discountType === "Percentage";
        return (
          <div className="flex items-center text-sm font-bold text-slate-900 dark:text-white">
            {isPercent ? <Percent size={14} className="mr-1 text-orange-500" /> : <DollarSign size={14} className="mr-0.5 text-orange-500" />}
            <span>{row.discountValue}{isPercent ? "%" : ""}</span>
          </div>
        );
      }
    },
    {
      header: "Min Spend",
      render: (row) => (
        <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
          ${row.minimumPurchaseAmount?.toFixed(2)}
        </span>
      )
    },
    {
      header: "Usage (Used / Limit)",
      render: (row) => {
        const percent = Math.min((row.usedCount / row.usageLimit) * 100, 100);
        return (
          <div className="w-40">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
              <span>{row.usedCount} used</span>
              <span>Limit {row.usageLimit}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${percent === 100 ? 'bg-rose-500' : percent > 75 ? 'bg-amber-500' : 'bg-orange-500'}`} 
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      }
    },
    {
      header: "Validity",
      render: (row) => {
        const now = new Date();
        const start = new Date(row.startDate);
        const end = new Date(row.endDate);
        const isExpired = now > end;
        const isUpcoming = now < start;

        return (
          <div className="flex flex-col space-y-0.5">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center">
              <Calendar size={12} className="mr-1 opacity-60" />
              Until {end.toLocaleDateString()}
            </span>
            {isExpired ? (
              <span className="text-[10px] font-bold text-rose-500 flex items-center">
                <AlertCircle size={10} className="mr-0.5" /> Expired
              </span>
            ) : isUpcoming ? (
              <span className="text-[10px] font-bold text-blue-500">Upcoming</span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-500">Active Campaign</span>
            )}
          </div>
        );
      }
    },
    {
      header: "Status",
      render: (row) => (
        <button
          onClick={() => toggleStatusMutation.mutate({ id: row.id, isActive: row.isActive })}
          className="flex items-center space-x-1.5 focus:outline-none"
          title="Click to toggle status"
        >
          <AdminStatusBadge status={row.isActive ? "Active" : "Inactive"} type="coupon" />
          {row.isActive ? (
            <ToggleRight className="text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer" size={20} />
          ) : (
            <ToggleLeft className="text-slate-400 hover:text-slate-500 transition-colors cursor-pointer" size={20} />
          )}
        </button>
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEditOpen(row)}
            className="btn btn-outline-primary btn-sm"
            title="Edit Coupon"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-outline-danger btn-sm"
            title="Delete Coupon"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Usage Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <Ticket size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Coupons</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalCoupons}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Check size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Campaigns</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{activeCoupons}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Redemptions</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{totalUsed}</h3>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex items-center space-x-4 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Percent size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Avg Discount Value</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{avgDiscount}% / $</h3>
          </div>
        </div>
      </div>

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <AdminSearchBar
          placeholder="Search coupons by code or description..."
          onSearch={(val) => {
            setSearchTerm(val);
            setCurrentPage(1);
          }}
        />
        <button
          onClick={() => {
            setIsCreateOpen(true);
            reset();
          }}
          className="flex items-center justify-center space-x-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-500/20 w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>New Coupon</span>
        </button>
      </div>

      {/* Table */}
      <AdminDataTable
        columns={columns}
        data={paginatedCoupons}
        emptyMessage="No Coupons Available"
        emptyDescription="Check back later."
      />

      {/* Pagination */}
      {filteredCoupons.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCoupons.length)} of {filteredCoupons.length} coupons
          </div>
          <AdminPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Create Modal */}
      <AdminModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Coupon"
        size="md"
      >
        <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Coupon Code</label>
              <input
                type="text"
                placeholder="e.g. SUMMER50"
                {...register("code", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Discount Type</label>
              <select
                {...register("discountType", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="FixedAmount">Fixed Amount ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <input
              type="text"
              placeholder="e.g. Save $50 on any purchase above $200"
              {...register("description")}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Discount Value</label>
              <input
                type="number"
                step="0.01"
                placeholder="10"
                {...register("discountValue", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Min Purchase</label>
              <input
                type="number"
                step="0.01"
                placeholder="0"
                {...register("minimumPurchaseAmount", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Max Cap ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="No Limit"
                {...register("maximumDiscountAmount")}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
              <input
                type="datetime-local"
                {...register("startDate", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">End Date</label>
              <input
                type="datetime-local"
                {...register("endDate", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Usage Limit</label>
              <input
                type="number"
                placeholder="100"
                {...register("usageLimit", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="isActive"
                {...register("isActive")}
                className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500 dark:border-slate-700"
              />
              <label htmlFor="isActive" className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300">Is Coupon Active</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editCoupon}
        onClose={() => setEditCoupon(null)}
        title="Edit Coupon"
        size="md"
      >
        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Coupon Code</label>
              <input
                type="text"
                {...registerEdit("code", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Discount Type</label>
              <select
                {...registerEdit("discountType", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              >
                <option value="Percentage">Percentage (%)</option>
                <option value="FixedAmount">Fixed Amount ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <input
              type="text"
              {...registerEdit("description")}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Discount Value</label>
              <input
                type="number"
                step="0.01"
                {...registerEdit("discountValue", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Min Purchase</label>
              <input
                type="number"
                step="0.01"
                {...registerEdit("minimumPurchaseAmount", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Max Cap ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="No Limit"
                {...registerEdit("maximumDiscountAmount")}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Start Date</label>
              <input
                type="datetime-local"
                {...registerEdit("startDate", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">End Date</label>
              <input
                type="datetime-local"
                {...registerEdit("endDate", { required: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Usage Limit</label>
              <input
                type="number"
                {...registerEdit("usageLimit", { required: true, valueAsNumber: true })}
                className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all font-semibold"
              />
            </div>
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                id="isActiveEdit"
                {...registerEdit("isActive")}
                className="w-4 h-4 text-orange-500 border-slate-300 rounded focus:ring-orange-500 dark:border-slate-700"
              />
              <label htmlFor="isActiveEdit" className="ml-2 text-sm font-bold text-slate-700 dark:text-slate-300">Is Coupon Active</label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditCoupon(null)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteId}
        title="Delete Coupon?"
        message="Are you sure you want to delete this coupon? This action is permanent and cannot be undone."
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmText="Confirm Delete"
      />
    </div>
  );
}

export default AdminCoupons;
