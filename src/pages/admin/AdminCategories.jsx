import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, createCategory, updateCategory, deleteCategory } from "../../api/categoryApi";
import AdminLoadingSpinner from "../../components/AdminLoadingSpinner";
import AdminSearchBar from "../../components/AdminSearchBar";
import AdminPagination from "../../components/AdminPagination";
import AdminModal from "../../components/AdminModal";
import AdminConfirmDialog from "../../components/AdminConfirmDialog";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { PlusCircle, Search, Edit2, Trash2, Pencil, Folder, Layers } from "lucide-react";

function AdminCategories() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals / Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { register, handleSubmit, reset } = useForm();
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

  // Queries
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: getCategories,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Category created successfully");
      setIsCreateOpen(false);
      reset();
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Category updated successfully");
      setEditCategory(null);
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
      queryClient.invalidateQueries({ queryKey: ["adminDashboardStats"] });
      toast.success("Category deleted successfully");
      setDeleteId(null);
    },
    onError: () => toast.error("Failed to delete category"),
  });

  if (isLoading) return <AdminLoadingSpinner fullPage={true} />;
  if (error) return <div className="text-rose-500 font-bold p-6">Failed to load platform categories.</div>;

  // Client Search Filter
  const filteredCategories = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.description && c.description.toLowerCase().includes(term))
    );
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  const handleCreateSubmit = (data) => {
    createMutation.mutate(data);
  };

  const handleEditOpen = (category) => {
    setEditCategory(category);
    resetEdit({
      name: category.name,
      description: category.description,
    });
  };

  const handleEditSubmit = (data) => {
    updateMutation.mutate({ id: editCategory.id, data: { ...data, id: editCategory.id } });
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <AdminSearchBar
          placeholder="Search categories by name or description..."
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
          className="flex items-center justify-center space-x-2 px-12 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-orange-500/20 w-full sm:w-auto"
        >
          <PlusCircle size={18} />
          <span>New Category</span>
        </button>
      </div>

      {/* Main Grid */}
      {paginatedCategories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedCategories.map((category) => (
            <div key={category.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col hover:shadow-md hover:bg-orange-50 dark:hover:bg-slate-800/60 transition-colors group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-12 h-12 bg-orange-50 dark:bg-orange-500/10 text-orange-500 rounded-xl flex items-center justify-center shadow-sm">
                  <Folder size={24} />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{category.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-6 flex-1">
                {category.description || "No description provided for this category."}
              </p>
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-slate-400 dark:text-slate-500">ID: {category.id}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditOpen(category)}
                    className="btn btn-outline-primary btn-sm"
                    title="Edit Category"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => setDeleteId(category.id)}
                    className="btn btn-outline-danger btn-sm"
                    title="Delete Category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Layers size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No categories found</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create a new category to organize your deals.</p>
        </div>
      )}

      {/* Pagination */}
      {filteredCategories.length > 0 && (
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
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
        title="Add New Category"
        size="md"
      >
        <form onSubmit={handleSubmit(handleCreateSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category Name</label>
            <input
              type="text"
              placeholder="e.g., Marketing Tools"
              {...register("name", { required: true })}
              className="w-full px-6 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={3}
              placeholder="Describe the type of deals in this category..."
              {...register("description", { required: true })}
              className="w-full px-6 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-12 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-12 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all"
            >
              Create Category
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Edit Modal */}
      <AdminModal
        isOpen={!!editCategory}
        onClose={() => setEditCategory(null)}
        title="Edit Category"
        size="md"
      >
        <form onSubmit={handleSubmitEdit(handleEditSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category Name</label>
            <input
              type="text"
              {...registerEdit("name", { required: true })}
              className="w-full px-6 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</label>
            <textarea
              rows={3}
              {...registerEdit("description", { required: true })}
              className="w-full px-6 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all resize-none"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditCategory(null)}
              className="px-12 py-2.5 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-12 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 shadow-md shadow-orange-500/20 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmDialog
        isOpen={!!deleteId}
        title="Delete Category?"
        message="Are you sure you want to delete this category? Any deals currently mapped to this category may lose their categorization."
        onConfirm={() => deleteMutation.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
        confirmText="Confirm Delete"
      />
    </div>
  );
}

export default AdminCategories;
