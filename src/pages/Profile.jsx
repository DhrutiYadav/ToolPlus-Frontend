import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserById, updateUser } from "../api/userApi";
import { getMyOrders } from "../services/orderService";
import SkeletonLoader from "../components/SkeletonLoader";
import { toast } from "react-toastify";
import { changePassword } from "../api/profileApi";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  // Calculate some stats
  const totalOrdersCount = orders.length;
  const completedOrders = orders.filter(o => (o.status || "").toLowerCase() === "completed" || !(o.status));
  const totalInvested = completedOrders.reduce((sum, o) => sum + (o.purchasePrice * (o.quantity || 1)), 0);

  return (
    <div className="profile-page py-4">
      <div className="mb-4">
        <h1 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Account Profile Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Manage your credentials, view roles, and see transaction statistics.</p>
      </div>

      <div className="row g-4">
        {/* Left Column: Stats & Avatar */}
        <div className="col-lg-4">
          <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 rounded-4 text-center bg-white dark:bg-slate-900 mb-4 transition-colors">
            <div className="avatar-wrapper bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3 transition-colors" style={{ width: "90px", height: "90px" }}>
              <span className="fs-1 fw-bold">{(profile?.name || "U")[0].toUpperCase()}</span>
            </div>
            
            <h4 className="fw-bold text-slate-900 dark:text-white mb-1 transition-colors">{profile?.name || "Member"}</h4>
            <span className="badge bg-slate-900 dark:bg-slate-700 text-white text-uppercase px-3 py-1 rounded-pill fw-semibold mb-4 d-inline-block fs-8 transition-colors">
              {profile?.role || "User"} Member
            </span>

            <hr className="my-3 border-slate-200 dark:border-slate-800 opacity-100 transition-colors" />

            <div className="row g-2 text-start mt-2">
              <div className="col-12 mb-2">
                <span className="text-slate-500 dark:text-slate-400 d-block fs-8 text-uppercase fw-semibold transition-colors">Email Contact</span>
                <span className="text-slate-900 dark:text-white fw-medium transition-colors">{profile?.email}</span>
              </div>
              <div className="col-12">
                <span className="text-slate-500 dark:text-slate-400 d-block fs-8 text-uppercase fw-semibold transition-colors">Member Since</span>
                <span className="text-slate-900 dark:text-white fw-medium transition-colors">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) : "Unknown"}</span>
              </div>
            </div>
          </div>

          {/* Account Stats Widget */}
          <div className="card border-0 shadow-sm p-4 rounded-4 bg-orange-500 dark:bg-orange-600 text-white transition-colors">
            <h5 className="fw-bold mb-3 text-white">⚡ Marketplace Activity</h5>
            
            <div className="row text-center mt-2">
              <div className="col-6 border-end border-white border-opacity-25">
                <span className="fs-2 fw-extrabold d-block text-white">{totalOrdersCount}</span>
                <span className="fs-8 text-uppercase text-white-50">Total Claims</span>
              </div>
              <div className="col-6">
                <span className="fs-2 fw-extrabold d-block text-white">${totalInvested.toFixed(2)}</span>
                <span className="fs-8 text-uppercase text-white-50">Total Paid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Profile */}
        <div className="col-lg-8">
          <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 rounded-4 bg-white dark:bg-slate-900 h-100 transition-colors">
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

              <button 
                type="submit" 
                className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm"
                disabled={updating}
              >
                {updating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Saving Changes...
                  </>
                ) : (
                  "Save Settings"
                )}
              </button>
            </form>
          </div>

          <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 rounded-4 bg-white dark:bg-slate-900 mt-4 transition-colors">
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

              <button 
                type="submit" 
                className="btn btn-warning rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm text-dark"
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
