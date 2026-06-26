import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, updateUser, deleteUser } from "../../api/userApi";
import { changeUserRole, banUser, unbanUser } from "../../services/adminService";
import AdminLoadingSpinner from "../../components/AdminLoadingSpinner";
import AdminDataTable from "../../components/AdminDataTable";
import AdminStatusBadge from "../../components/AdminStatusBadge";
import AdminSearchBar from "../../components/AdminSearchBar";
import AdminPagination from "../../components/AdminPagination";
import AdminModal from "../../components/AdminModal";
import AdminConfirmDialog from "../../components/AdminConfirmDialog";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Eye, Edit2, ShieldAlert, ShieldCheck, Trash2, Download, UserX, CheckSquare, Pencil, Check } from "lucide-react";

function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [selectedIds, setSelectedIds] = useState([]);

  // Modals / Dialog States
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [actionUser, setActionUser] = useState(null); // For single user actions
  const [actionType, setActionType] = useState(null); // 'ban' | 'unban' | 'delete' | 'bulkDelete' | 'bulkBan'

  const { register, handleSubmit, reset } = useForm();

  // Queries
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: getAllUsers,
  });

  // Mutations
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("User updated successfully");
      setEditUser(null);
    },
    onError: () => toast.error("Failed to update user details"),
  });

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => changeUserRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("User role updated successfully");
    },
    onError: () => toast.error("Failed to change user role"),
  });

  const banMutation = useMutation({
    mutationFn: (id) => banUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("Action completed");
      setActionUser(null);
    },
    onError: () => toast.error("Action failed"),
  });

  const unbanMutation = useMutation({
    mutationFn: (id) => unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("Action completed");
      setActionUser(null);
    },
    onError: () => toast.error("Action failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("User deleted");
      setActionUser(null);
    },
    onError: () => toast.error("Failed to delete"),
  });

  if (isLoading) return <AdminLoadingSpinner fullPage={true} />;
  if (error) return <div className="text-rose-500 font-bold p-6">Failed to load user list.</div>;

  // Filter users based on Search Term and Tab
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const displayName = u.name || u.username || "";
    const matchesSearch = displayName.toLowerCase().includes(term) || (u.email && u.email.toLowerCase().includes(term));
    
    let matchesTab = true;
    if (activeTab === "Admin") matchesTab = u.role === "Admin";
    else if (activeTab === "Users") matchesTab = u.role === "User";
    else if (activeTab === "Active") matchesTab = !u.isBanned;
    else if (activeTab === "Inactive") matchesTab = u.isBanned;

    return matchesSearch && matchesTab;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleEditOpen = (user) => {
    setEditUser(user);
    reset({
      username: user.name || user.username || "",
      email: user.email,
    });
  };

  const handleEditSubmit = (data) => {
    const payload = {
      name: data.username,
      email: data.email
    };
    updateMutation.mutate({ id: editUser.id, data: payload });
  };

  const handleActionConfirm = async () => {
    if (actionType === "ban") {
      banMutation.mutate(actionUser.id);
    } else if (actionType === "unban") {
      unbanMutation.mutate(actionUser.id);
    } else if (actionType === "delete") {
      deleteMutation.mutate(actionUser.id);
    } else if (actionType === "bulkDelete") {
      // Mock bulk delete
      for (const id of selectedIds) {
        await deleteMutation.mutateAsync(id);
      }
      setSelectedIds([]);
      toast.success(`${selectedIds.length} users deleted`);
    } else if (actionType === "bulkDeactivate") {
      // Mock bulk ban
      for (const id of selectedIds) {
        await banMutation.mutateAsync(id);
      }
      setSelectedIds([]);
      toast.success(`${selectedIds.length} users deactivated`);
    }
    setActionType(null);
  };

  const handleRoleChange = (user, newRole) => {
    roleMutation.mutate({ id: user.id, role: newRole });
  };

  const handleExport = () => {
    toast.info("Exporting users to CSV...");
    // Mock export functionality
  };

  const columns = [
    { 
      header: "User", 
      render: (row) => {
        const name = row.name || row.username || (row.email ? row.email.split('@')[0] : "N/A");
        const initial = name.charAt(0).toUpperCase();
        return (
          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm shrink-0">
              {initial}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{row.email}</p>
            </div>
          </div>
        );
      } 
    },
    {
      header: "Role",
      render: (row) => {
        let badgeClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        if (row.role === "Admin") badgeClass = "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400";
        
        if (row.role === "User") badgeClass = "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400";

        return (
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${badgeClass}`}>
            {row.role || "User"}
          </span>
        );
      },
    },
    {
      header: "Status",
      render: (row) => (
        <AdminStatusBadge status={row.isBanned ? "Banned" : "Active"} type="user" />
      ),
    },
    {
      header: "Joined",
      render: (row) => <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{new Date(row.createdAt || Date.now()).toLocaleDateString()}</span>,
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewUser(row)}
            className="btn btn-outline-secondary btn-sm"
            title="View Details"
          >
            <Eye size={15} />
          </button>
          <button
            onClick={() => handleEditOpen(row)}
            className="btn btn-outline-primary btn-sm"
            title="Edit User"
          >
            <Pencil size={15} />
          </button>
          
          {row.isBanned ? (
            <button
              onClick={() => {
                setActionUser(row);
                setActionType("unban");
              }}
              className="btn btn-outline-success btn-sm"
              title="Unban User"
            >
              <Check size={15} />
            </button>
          ) : (
            <button
              onClick={() => {
                setActionUser(row);
                setActionType("ban");
              }}
              className="btn btn-outline-warning btn-sm"
              title="Deactivate User"
            >
              <UserX size={15} />
            </button>
          )}

          <select
            value={row.role || "User"}
            onChange={(e) => handleRoleChange(row, e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="User">User</option>
            
            <option value="Admin">Admin</option>
          </select>

          <button
            onClick={() => {
              setActionUser(row);
              setActionType("delete");
            }}
            className="btn btn-outline-danger btn-sm"
            title="Delete User"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ];

  const tabs = ["All", "Admin", "Users", "Active", "Inactive"];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Top Controls & Tabs */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex space-x-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <AdminSearchBar
              placeholder="Search users..."
              onSearch={(val) => {
                setSearchTerm(val);
                setCurrentPage(1);
              }}
            />
            <button 
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm whitespace-nowrap"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl animate-fade-in-up">
            <div className="flex items-center space-x-2 text-orange-700 dark:text-orange-400 font-bold text-sm px-2">
              <CheckSquare size={18} />
              <span>{selectedIds.length} users selected</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setActionType("bulkDeactivate")}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-500 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
              >
                Deactivate Selected
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
        data={paginatedUsers} 
        emptyMessage="No users match search parameters."
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />

      {/* Pagination */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
        </div>
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* View User Modal */}
      <AdminModal
        isOpen={!!viewUser}
        onClose={() => setViewUser(null)}
        title="User Account Details"
        size="md"
      >
        {viewUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 border-b border-slate-100 dark:border-slate-700 pb-6">
              <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-extrabold text-3xl shadow-lg">
                {(viewUser.name || viewUser.username || "U").charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">{viewUser.name || viewUser.username}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{viewUser.email}</p>
                <div className="mt-2">
                  <AdminStatusBadge status={viewUser.isBanned ? "Banned" : "Active"} type="user" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">User Role</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{viewUser.role}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Account Created</p>
                <p className="font-extrabold text-slate-800 dark:text-slate-200">{new Date(viewUser.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="col-span-2 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-xs mb-1">Account ID</p>
                <p className="font-mono text-slate-800 dark:text-slate-200 text-xs">{viewUser.id}</p>
              </div>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Edit User Modal */}
      <AdminModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        title="Modify User Details"
        size="md"
      >
        <form onSubmit={handleSubmit(handleEditSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Username</label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm text-slate-900 dark:text-white transition-all"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setEditUser(null)}
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

      {/* Action Confirmation Dialog */}
      <AdminConfirmDialog
        isOpen={!!actionType && !["bulkDelete", "bulkDeactivate"].includes(actionType) && !!actionUser}
        title={`${actionType === "ban" ? "Deactivate" : actionType === "unban" ? "Reactivate" : "Delete"} Account?`}
        message={
          actionType === "ban"
            ? `Are you sure you want to deactivate ${actionUser?.name || actionUser?.username}? They will no longer be able to log into the platform.`
            : actionType === "unban"
            ? `Are you sure you want to reactivate ${actionUser?.name || actionUser?.username}? Access will be restored immediately.`
            : `Are you sure you want to permanently delete the account for ${actionUser?.name || actionUser?.username}? This action is irreversible.`
        }
        onConfirm={handleActionConfirm}
        onCancel={() => setActionType(null)}
        confirmText={actionType === "delete" ? "Permanently Delete" : actionType === "ban" ? "Deactivate Account" : "Reactivate"}
      />

      {/* Bulk Action Confirmation */}
      <AdminConfirmDialog
        isOpen={["bulkDelete", "bulkDeactivate"].includes(actionType)}
        title={`${actionType === "bulkDelete" ? "Delete" : "Deactivate"} ${selectedIds.length} Users?`}
        message={`Are you sure you want to ${actionType === "bulkDelete" ? "permanently delete" : "deactivate"} ${selectedIds.length} users? This action cannot be easily undone.`}
        onConfirm={handleActionConfirm}
        onCancel={() => setActionType(null)}
        confirmText={actionType === "bulkDelete" ? "Delete All Selected" : "Deactivate All Selected"}
      />
    </div>
  );
}

export default AdminUsers;
