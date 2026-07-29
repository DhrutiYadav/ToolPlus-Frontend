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
      toast.error(
        error.response?.data?.message || "Failed to change password.",
      );
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

  if (loading)
    return (
      <div className="py-12">
        <SkeletonLoader type="dealDetails" />
      </div>
    );

  // const totalOrdersCount = orders.length;
  // const completedOrders = orders.filter(
  //   (o) => (o.status || "").toLowerCase() === "completed" || !o.status,
  // );
  // const totalInvested = completedOrders.reduce(
  //   (sum, o) => sum + o.purchasePrice * (o.quantity || 1),
  //   0,
  // );

  const tabs = [
    { key: "profile", label: "Profile Settings", icon: "bi-person-fill" },
    { key: "security", label: "Security", icon: "bi-shield-lock-fill" },
    { key: "orders", label: "Order History", icon: "bi-bag-fill" },
  ];

  const getOrderStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "completed" || s === "paid")
      return (
        <span className="inline-block leading-none text-center whitespace-nowrap align-baseline px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold">
          {status}
        </span>
      );
    if (s === "pending" || s === "refundrequested")
      return (
        <span className="inline-block leading-none text-center whitespace-nowrap align-baseline px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 font-semibold">
          {status}
        </span>
      );
    if (s === "cancelled" || s === "refunded")
      return (
        <span className="inline-block leading-none text-center whitespace-nowrap align-baseline px-2 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-semibold">
          {status}
        </span>
      );
    return (
      <span className="inline-block leading-none text-center whitespace-nowrap align-baseline px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-semibold">
        {status || "Unknown"}
      </span>
    );
  };

  return (
    <div className="relative overflow-hidden py-10">
      {/* Animated Background Blobs */}
      <div className="auth-bg-blobs pointer-events-none" aria-hidden="true">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
        <div className="auth-blob auth-blob-3"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h1
            className="
              text-4xl
              sm:text-5xl
              font-black
              tracking-tight
              text-slate-900
              dark:text-white
              mb-2
              "
          >
            Account Profile Settings
          </h1>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">
            Manage your credentials, view roles, and see transaction statistics.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          {/* Left Column: Sidebar Tabs */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <div
              className="
                rounded-2xl
                border
                border-slate-200
                dark:border-slate-700
                bg-white/95
                dark:bg-slate-900/95
                backdrop-blur-2xl
                shadow-[0_25px_70px_rgba(0,0,0,0.18)]
                dark:shadow-[0_30px_80px_rgba(0,0,0,0.45)]
                p-8
                text-center
                transition-all
                duration-300
                "
            >
              <div
                className="
                  mx-auto
                  flex
                  h-24
                  w-24
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-orange-500
                  to-orange-600
                  shadow-lg
                  text-white
                  "
              >
                <span className="text-4xl font-black">
                  {(profile?.name || "U")[0].toUpperCase()}
                </span>
              </div>
              <h5
                className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1 transition-colors"
              >
                {profile?.name || "Member"}
              </h5>
              <span className="text-slate-500 text-sm dark:text-slate-400 transition-colors mb-2 block">
                {profile?.email}
              </span>
              <span className="text-slate-500 text-sm dark:text-slate-400 transition-colors mb-6 block">
                Member since{" "}
                {profile?.createdAt
                  ? new Date(profile?.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "Unknown"}
              </span>
              <span className="inline-block leading-none text-center whitespace-nowrap align-baseline bg-slate-900 dark:bg-slate-700 text-white uppercase px-6 py-1 rounded-full font-semibold text-xs transition-colors">
                {profile?.role || "User"} Member
              </span>
            </div>

            <div
              className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]
              dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]
              backdrop-blur-2xl
              bg-white/95
              dark:bg-slate-900/95 
              rounded-2xl  overflow-hidden transition-colors"
            >
              <div className="space-y-2 p-3" style={{ whiteSpace: "nowrap" }}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        borderLeft: isActive
                          ? "3px solid #f97316"
                          : "3px solid transparent",
                      }}
                      className={`
                        w-full
                        flex
                        items-center
                        rounded-xl
                        px-4
                        py-3.5
                        text-left
                        font-semibold
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "bg-orange-500 text-white shadow-lg"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                        }
                        `}
                    >
                      <i className={`bi ${tab.icon} mr-4`}></i>
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Tabbed Content */}
          <div className="lg:col-span-8 xl:col-span-9">
            {/* Tab: Profile Info */}
            {activeTab === "profile" && (
              <div
                className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]
                dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                backdrop-blur-2xl
                bg-white/95
                dark:bg-slate-900/95
                hover:-translate-y-1
                hover:shadow-2xl
                duration-300
                
                p-6 rounded-2xl bg-white dark:bg-slate-900 transition-colors"
              >
                <h4 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 transition-colors">
                  Edit Profile Information
                </h4>
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-6">
                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        tracking-wide
                        text-slate-800
                        dark:text-slate-200
                        uppercase
                        "
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        dark:border-slate-600
                        bg-white
                        dark:bg-slate-800
                        text-slate-900
                        dark:text-white
                        placeholder:text-slate-400
                        px-4
                        py-3.5
                        outline-none
                        transition-all
                        focus:border-orange-500
                        focus:ring-2
                        ring-
                        ring-orange-500/30
                        "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={updating}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        tracking-wide
                        text-slate-800
                        dark:text-slate-200
                        "
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        dark:border-slate-600
                        bg-white
                        dark:bg-slate-800
                        text-slate-900
                        dark:text-white
                        placeholder:text-slate-400
                        px-4
                        py-3.5
                        outline-none
                        transition-all
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-500/30
                        "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={updating}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-r
                      from-orange-500
                      to-orange-600
                      px-6
                      py-3.5
                      font-semibold
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      active:scale-95
                      hover:shadow-xl
                      disabled:opacity-60
                      "
                    disabled={updating}
                  >
                    {updating ? (
                      <>
                        <span
                          className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving Changes...
                      </>
                    ) : (
                      "Save Settings"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Security */}
            {activeTab === "security" && (
              <div
                className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]
                dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                backdrop-blur-2xl
                bg-white/95
                dark:bg-slate-900/95 
                p-6 rounded-2xl bg-white dark:bg-slate-900 transition-colors"
              >
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-6 transition-colors">
                  Change Password
                </h4>
                <form onSubmit={handleChangePassword}>
                  <div className="mb-6">
                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        tracking-wide
                        text-slate-800
                        dark:text-slate-200
                        "
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        dark:border-slate-600
                        bg-white
                        dark:bg-slate-800
                        text-slate-900
                        dark:text-white
                        placeholder:text-slate-400
                        px-4
                        py-3.5
                        outline-none
                        transition-all
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-500/30
                        "
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      disabled={changingPassword}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        tracking-wide
                        text-slate-800
                        dark:text-slate-200
                        "
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        dark:border-slate-600
                        bg-white
                        dark:bg-slate-800
                        text-slate-900
                        dark:text-white
                        placeholder:text-slate-400
                        px-4
                        py-3.5
                        outline-none
                        transition-all
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-500/30
                        "
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={changingPassword}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="
                        mb-2
                        block
                        text-sm
                        font-semibold
                        tracking-wide
                        text-slate-800
                        dark:text-slate-200
                        uppercase
                      "
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-slate-300
                        dark:border-slate-600
                        bg-white
                        dark:bg-slate-800
                        text-slate-900
                        dark:text-white
                        placeholder:text-slate-400
                        px-4
                        py-3.5
                        outline-none
                        transition-all
                        focus:border-orange-500
                        focus:ring-2
                        focus:ring-orange-500/30
                        "
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={changingPassword}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-xl
                      bg-gradient-to-r
                      from-amber-500
                      to-orange-500
                      px-6
                      py-3.5
                      font-semibold
                      text-white
                      shadow-lg
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                      active:scale-95
                      hover:shadow-xl
                      disabled:opacity-60
                      "
                    disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <>
                        <span
                          className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Tab: My Orders */}
            {activeTab === "orders" && (
              <div
                className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]
                dark:shadow-[0_30px_80px_rgba(0,0,0,0.35)]
                backdrop-blur-2xl
                bg-white/95
                dark:bg-slate-900/95 
                p-6 rounded-2xl bg-white dark:bg-slate-900 transition-colors"
              >
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6 mb-6 transition-colors">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-0">
                    Order History
                  </h4>
                  <Link
                    to="/orders"
                    className="
                      inline-flex
                      items-center
                      rounded-xl
                      border
                      border-orange-500
                      text-orange-500
                      px-4
                      py-2
                      font-semibold
                      transition-all
                      hover:bg-orange-500
                      hover:text-white
                      "
                  >
                    View my orders
                  </Link>
                </div>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <i
                      className="bi bi-bag-x text-slate-300 dark:text-slate-700"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="text-slate-500 dark:text-slate-400 mt-6 mb-0">
                      You haven't placed any orders yet.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order) => (
                      <div
                        key={order.orderId}
                        className="flex items-center justify-between gap-4 p-6 rounded-2xl bg-white
                        dark:bg-slate-800
                        hover:-translate-y-1
                        hover:shadow-xl
                        transition-all
                        duration-300 
                        border border-slate-100 
                        dark:border-slate-700"
                      >
                        <div className="grow">
                          <div
                            className="font-bold text-slate-900 dark:text-white"
                            style={{ fontSize: "14px" }}
                          >
                            Order #{order.orderId}
                          </div>
                          <div
                            className="text-slate-500 dark:text-slate-400"
                            style={{ fontSize: "12px" }}
                          >
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  },
                                )
                              : "N/A"}
                          </div>
                        </div>
                        <div
                          className="font-bold text-orange-500"
                          style={{ fontSize: "15px" }}
                        >
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
    </div>
  );
}

export default Profile;
