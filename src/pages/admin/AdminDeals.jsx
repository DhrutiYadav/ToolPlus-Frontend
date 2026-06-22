import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDeals,
  createDeal,
  updateDeal,
  deleteDeal,
  uploadDealImage,
} from "../../services/dealService";
import { getCategories } from "../../api/categoryApi";
import AdminLoadingSpinner from "../../components/AdminLoadingSpinner";
import AdminSearchBar from "../../components/AdminSearchBar";
import AdminPagination from "../../components/AdminPagination";
import AdminModal from "../../components/AdminModal";
import AdminConfirmDialog from "../../components/AdminConfirmDialog";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Star,
  Package,
  TrendingUp,
} from "lucide-react";

function AdminDeals() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals / Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editDeal, setEditDeal] = useState(null);
  const [uploadDeal, setUploadDeal] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const { register, handleSubmit, reset } = useForm();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
  } = useForm();

  // Queries
  const {
    data: deals = [],
    isLoading: isDealsLoading,
    error: dealsError,
  } = useQuery({
    queryKey: ["adminDeals"],
    queryFn: getDeals,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["adminDealsCategories"],
    queryFn: getCategories,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDeals"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Deal created successfully");
      setIsCreateOpen(false);
      reset();
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create new deal"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDeal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDeals"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Deal details updated");
      setEditDeal(null);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update deal"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDeals"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Deal deleted successfully");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete deal"),
  });

  const uploadMutation = useMutation({
    mutationFn: ({ id, file }) => uploadDealImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDeals"] });
      toast.success("Deal image updated successfully");
      setUploadDeal(null);
      setSelectedFile(null);
    },
    onError: () => toast.error("Failed to upload deal image"),
  });

  if (isDealsLoading) return <AdminLoadingSpinner fullPage={true} />;
  if (dealsError)
    return (
      <div className="text-rose-500 font-bold p-6">
        Failed to load platform deals.
      </div>
    );

  // Search Filter
  const filteredDeals = deals.filter((d) => {
    const term = searchTerm.toLowerCase();
    return (
      (d.title && d.title.toLowerCase().includes(term)) ||
      (d.description && d.description.toLowerCase().includes(term)) ||
      (d.categoryName && d.categoryName.toLowerCase().includes(term))
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDeals = filteredDeals.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleCreateSubmit = (data) => {
    const formatted = {
      ...data,
      originalPrice: parseFloat(data.originalPrice),
      salePrice: parseFloat(data.salePrice),
      stockQuantity: parseInt(data.stockQuantity),
      categoryId: parseInt(data.categoryId),
    };
    createMutation.mutate(formatted);
  };

  const handleEditOpen = (deal) => {
    setEditDeal(deal);
    resetEdit({
      title: deal.title,
      description: deal.description,
      originalPrice: deal.originalPrice,
      salePrice: deal.salePrice,
      stockQuantity: deal.stockQuantity,
      categoryId: deal.categoryId,
    });
  };

  const handleEditSubmit = (data) => {
    const formatted = {
      ...data,
      originalPrice: parseFloat(data.originalPrice),
      salePrice: parseFloat(data.salePrice),
      stockQuantity: parseInt(data.stockQuantity),
      categoryId: parseInt(data.categoryId),
    };
    updateMutation.mutate({ id: editDeal.id, data: formatted });
  };

  const handleImageUploadSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image file first");
      return;
    }
    uploadMutation.mutate({ id: uploadDeal.id, file: selectedFile });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <AdminSearchBar
          placeholder="Search deals by title, category..."
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
          className="flex items-center space-x-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-500/20 self-stretch sm:self-auto"
        >
          <Plus size={18} />
          <span>New Deal Listing</span>
        </button>
      </div>

      {/* Main Grid of Cards */}
      {paginatedDeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedDeals.map((deal) => {
            // Mocking total capacity for progress bar if not provided by backend
            const totalStock = deal.totalStock ?? deal.stockQuantity ?? 0;
            const stockPercent = Math.min(
              100,
              Math.max(0, (deal.stockQuantity / totalStock) * 100),
            );
            const rating = deal.averageRating ?? 0;

            return (
              <div
                key={deal.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
              >
                {/* Image Header */}
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={deal.imageSrc}
                    alt={deal.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src =
                        "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                    }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                    {deal.categoryName || "Uncategorized"}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-sm flex items-center">
                    <Star size={12} className="fill-white mr-1" />
                    {rating}
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3
                    className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight mb-2 line-clamp-2"
                    title={deal.title}
                  >
                    {deal.title}
                  </h3>

                  <div className="flex items-baseline space-x-2 mt-auto mb-4">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      ${deal.salePrice?.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ${deal.originalPrice?.toFixed(2)}
                    </span>
                  </div>

                  {/* Stock Progress */}
                  <div className="space-y-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Package size={12} className="mr-1" /> Remaining
                      </span>
                      <span>
                        {deal.stockQuantity} / {totalStock}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${deal.stockQuantity < 20 ? "bg-rose-500" : "bg-orange-500"}`}
                        style={{ width: `${stockPercent}%` }}
                      ></div>
                    </div>
                    {deal.stockQuantity === 0 && (
                      <p className="text-xs font-bold text-rose-500 mt-1">
                        Out of stock
                      </p>
                    )}
                  </div>

                  {/* Action Buttons Footer */}
                  <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleEditOpen(deal)}
                      className="flex-1 flex items-center justify-center space-x-1.5 px-2.5 py-2 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition-colors border border-blue-100 dark:border-blue-500/10"
                      title="Edit Deal"
                    >
                      <Edit2 size={14} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setUploadDeal(deal)}
                      className="flex-1 flex items-center justify-center space-x-1.5 px-2.5 py-2 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-colors border border-slate-100 dark:border-slate-700"
                      title="Upload Image"
                    >
                      <Upload size={14} />
                      <span>Image</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(deal.id)}
                      className="flex-1 flex items-center justify-center space-x-1.5 px-2.5 py-2 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors border border-rose-100 dark:border-rose-500/10"
                      title="Delete Deal"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <TrendingUp size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
            No deals found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Create a new deal to populate this catalog.
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredDeals.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + itemsPerPage, filteredDeals.length)} of{" "}
            {filteredDeals.length} deals
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
        title="Add New Deal Listing"
        size="lg"
      >
        <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Deal Title
              </label>
              <input
                type="text"
                placeholder="e.g., Notion Premium Lifetime Plan"
                {...register("title", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                {...register("categoryId", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 299"
                {...register("originalPrice", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Sale Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g., 49"
                {...register("salePrice", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Stock / Code Quantity
              </label>
              <input
                type="number"
                placeholder="e.g., 150"
                {...register("stockQuantity", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={4}
              placeholder="Provide key details, features, and specs..."
              {...register("description", { required: true })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all resize-none"
            />
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
              Save Deal
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editDeal}
        onClose={() => setEditDeal(null)}
        title="Edit Deal Listing"
        size="lg"
      >
        <form
          onSubmit={handleSubmitEdit(handleEditSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Deal Title
              </label>
              <input
                type="text"
                {...registerEdit("title", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                {...registerEdit("categoryId", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...registerEdit("originalPrice", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Sale Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                {...registerEdit("salePrice", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                {...registerEdit("stockQuantity", { required: true })}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={4}
              {...registerEdit("description", { required: true })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditDeal(null)}
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

      {/* Image Upload Modal */}
      <AdminModal
        isOpen={!!uploadDeal}
        onClose={() => {
          setUploadDeal(null);
          setSelectedFile(null);
        }}
        title="Upload Deal Image Asset"
        size="md"
      >
        {uploadDeal && (
          <form onSubmit={handleImageUploadSubmit} className="space-y-6">
            <div className="flex items-center space-x-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <img
                src={uploadDeal.imageSrc}
                alt={uploadDeal.title}
                className="w-20 h-20 object-cover rounded-xl shadow-sm"
                onError={(e) => {
                  e.target.src =
                    "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
                }}
              />
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white truncate max-w-xs">
                  {uploadDeal.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Current asset preview
                </p>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center hover:border-orange-500 dark:hover:border-orange-500 transition-colors cursor-pointer relative bg-slate-50 dark:bg-slate-800/50">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-slate-500 dark:text-slate-400 rounded-xl mb-3">
                <ImageIcon size={24} />
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">
                {selectedFile ? selectedFile.name : "Choose an image asset"}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                PNG, JPG or WEBP (Max 2MB)
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setUploadDeal(null);
                  setSelectedFile(null);
                }}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all flex items-center space-x-2"
              >
                <Upload size={16} />
                <span>Upload Asset</span>
              </button>
            </div>
          </form>
        )}
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteId}
        title="Delete Deal Listing?"
        message="Are you sure you want to permanently delete this deal? This cannot be undone and may affect active client shopping carts."
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmText="Permanently Delete"
      />
    </div>
  );
}

export default AdminDeals;
