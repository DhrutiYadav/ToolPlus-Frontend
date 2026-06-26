import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserById, updateUser } from "../api/userApi";
import { getMyOrders } from "../services/orderService";
import SkeletonLoader from "../components/SkeletonLoader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { changePassword } from "../api/profileApi";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        const [profileData, ordersData] = await Promise.all([
          getUserById(user.id),
          getMyOrders(),
        ]);
        setProfile(profileData);
        setOrders(ordersData || []);
        setName(profileData.name || "");
        setEmail(profileData.email || "");
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Could not load account profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  // Password Fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword({ oldPassword, newPassword, confirmPassword });
      toast.success("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response?.data?.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Please fill in all fields.");
      return;
    }
    setUpdating(true);
    try {
      await updateUser(user.id, { id: user.id, name, email });
      toast.success("Profile updated successfully!");
      setProfile((prev) => ({ ...prev, name, email }));
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile settings.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="py-5"><SkeletonLoader type="dealDetails" /></div>;

  const totalOrdersCount = orders.length;
  const completedOrders = orders.filter(o => (o.status || "").toLowerCase() === "completed" || !(o.status));
  const totalInvested = completedOrders.reduce((sum, o) => sum + (o.purchasePrice * (o.quantity || 1)), 0);

  const tabs = [
    { key: "profile", label: "Profile Settings", icon: "bi-person-fill" },
    { key: "security", label: "Security", icon: "bi-shield-lock-fill" },
    { key: "orders", label: "Order History", icon: "bi-bag-fill" },
  ];

  const getOrderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "paid") return <span className="badge rounded-pill bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 fw-semibold">{status}</span>;
    if (s === "pending" || s === "refundrequested") return <span className="badge rounded-pill bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 fw-semibold">{status}</span>;
    if (s === "cancelled" || s === "refunded") return <span className="badge rounded-pill bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 fw-semibold">{status}</span>;
    return <span className="badge rounded-pill bg-slate-100 text-slate-600 fw-semibold">{status || "Unknown"}</span>;
  };

  return (
    <div className="profile-page py-4">
      <div className="mb-4">
        <h1 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Account Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Manage your credentials, view roles, and see transaction statistics.</p>
      </div>

      <div className="row g-4">
        {/* Left Column: Sidebar Tabs */}
        <div className="col-lg-3">
          <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 rounded-4 text-center bg-white dark:bg-slate-900 mb-4 transition-colors">
            <div className="avatar-wrapper bg-orange-500 text-white rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3 transition-colors" style={{ width: "80px", height: "80px" }}>
              <span className="fs-2 fw-bold">{(profile?.name || "U")[0].toUpperCase()}</span>
            </div>
            <h5 className="fw-bold fs-5 text-slate-900 dark:text-white mb-1 transition-colors">{profile?.name || "Member"}</h5>
            <span className="text-slate-500 fs-7 dark:text-slate-400 transition-colors mb-2 d-block">{profile?.email}</span>
            <span className="text-slate-500 fs-7 dark:text-slate-400 transition-colors mb-3 d-block">
              Member since {profile?.createdAt ? new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
            </span>
            <span className="badge bg-slate-900 dark:bg-slate-700 text-white text-uppercase px-3 py-1 rounded-pill fw-semibold fs-8 transition-colors">
              {profile?.role || "User"} Member
            </span>
          </div>

          <div className="card border border-slate-100 dark:border-slate-800 shadow-sm rounded-4 bg-white dark:bg-slate-900 overflow-hidden transition-colors">
            <div className="nav flex-row flex-lg-column nav-pills p-2 overflow-auto" style={{ whiteSpace: 'nowrap' }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      borderLeft: isActive ? "3px solid #f97316" : "3px solid transparent",
                    }}
                    className={`nav-link text-start px-4 py-3 fw-semibold rounded-3 mb-1 transition-colors d-lg-block d-inline-block ${
                      isActive
                        ? "active bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 d-lg-block border-bottom-0"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 d-lg-block"
                    }`}
                  >
                    <i className={`bi ${tab.icon} me-3`}></i>
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="col-lg-9">
          {/* Tab: Profile Info */}
          {activeTab === "profile" && (
            <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 rounded-4 bg-white dark:bg-slate-900 transition-colors">
              <h4 className="fw-bold text-slate-900 dark:text-white border-bottom border-slate-200 dark:border-slate-800 pb-2 mb-4 transition-colors">Edit Profile Information</h4>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Full Name</label>
                  <input
                    type="text"
                    className="form-control py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={updating}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Email Address</label>
                  <input
                    type="email"
                    className="form-control py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={updating}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm" disabled={updating}>
                  {updating ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving Changes...</>) : "Save Settings"}
                </button>
              </form>
            </div>
          )}

          {/* Tab: Security */}
          {activeTab === "security" && (
            <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 rounded-4 bg-white dark:bg-slate-900 transition-colors">
              <h4 className="fw-bold text-slate-900 dark:text-white border-bottom border-slate-200 dark:border-slate-800 pb-2 mb-4 transition-colors">Change Password</h4>
              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Current Password</label>
                  <input
                    type="password"
                    className="form-control py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={changingPassword}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">New Password</label>
                  <input
                    type="password"
                    className="form-control py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={changingPassword}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={changingPassword}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm text-dark" disabled={changingPassword}>
                  {changingPassword ? (<><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Changing...</>) : "Change Password"}
                </button>
              </form>
            </div>
          )}

          {/* Tab: My Orders */}
          {activeTab === "orders" && (
            <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 rounded-4 bg-white dark:bg-slate-900 transition-colors">
              <div className="d-flex justify-content-between align-items-center border-bottom border-slate-200 dark:border-slate-800 pb-3 mb-4 transition-colors">
                <h4 className="fw-bold text-slate-900 dark:text-white mb-0">Order History</h4>
                <Link to="/orders" className="btn btn-outline-primary btn-sm fw-bold rounded-pill px-3 shadow-sm hover-lift">View my orders</Link>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-bag-x text-slate-300 dark:text-slate-700" style={{ fontSize: '3rem' }}></i>
                  <p className="text-slate-500 dark:text-slate-400 mt-3 mb-0">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {orders.map((order) => (
                    <div
                      key={order.orderId}
                      className="d-flex align-items-center justify-content-between gap-3 p-3 rounded-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-colors"
                    >
                      <div className="flex-grow-1">
                        <div className="fw-bold text-slate-900 dark:text-white" style={{ fontSize: '14px' }}>
                          Order #{order.orderId}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400" style={{ fontSize: '12px' }}>
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                        </div>
                      </div>
                      <div className="fw-bold text-orange-500" style={{ fontSize: '15px' }}>
                        ₹{(order.subtotal || 0).toFixed(2)}
                      </div>
                      <div>{getOrderStatusBadge(order.status)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
