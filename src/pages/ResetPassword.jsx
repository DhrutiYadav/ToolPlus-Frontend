import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { resetPassword } from "../api/authApi";
import { Lock, Eye, EyeOff } from "lucide-react";
import { ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid or missing reset token.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleResetPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, data.newPassword, data.confirmPassword);
      toast.success("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Reset password failure:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div
      className="flex items-center justify-center py-12"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="login-card p-12 shadow-lg border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 transition-colors"
        style={{ maxWidth: "450px", width: "100%", position: "relative" }}
      >
        {/* Back to Login */}
        <div className="mb-6">
          <Link
            to="/login"
            className="text-slate-500 dark:text-slate-400 no-underline flex items-center gap-1 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo/logo-horizontal-removebg.png"
            alt="ToolPlus"
            className="w-52 h-auto mx-auto dark:hidden"
            // style={{ maxWidth: "180px", height: "auto" }}
          />
          <img
            src="/logo/dark-horizontal-logo-removebg.png"
            alt="ToolPlus"
            className="w-52 h-auto mx-auto hidden dark:block"
            // style={{ maxWidth: "180px", height: "auto" }}
          />
        </div>

        {/* Lock icon illustration */}
        <div className="text-center mb-6">
          <div
            className="bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-full inline-flex items-center justify-center mb-6 transition-colors"
            style={{ width: 64, height: 64 }}
          >
            <Lock size={32} />
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">
            Create New Password
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base transition-colors">
            Enter your new strong password below
          </p>
        </div>

        <form onSubmit={handleSubmit(handleResetPassword)} noValidate>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full rounded-xl border px-4 py-3 pr-12
                bg-white dark:bg-slate-800
                text-slate-900 dark:text-white
                placeholder:text-slate-400
                focus:outline-none
                focus:ring-2 focus:ring-orange-500
                transition
                ${
                  errors.newPassword
                    ? "border-red-500"
                    : "border-slate-300 dark:border-slate-700"
                }`}
                placeholder="••••••••"
                disabled={loading}
                {...register("newPassword", {
                  required: "New Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Confirm New Password
            </label>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full rounded-xl border px-4 py-3 pr-12
      bg-white dark:bg-slate-800
      text-slate-900 dark:text-white
      placeholder:text-slate-400
      focus:outline-none
      focus:ring-2 focus:ring-orange-500
      transition
      ${
        errors.confirmPassword
          ? "border-red-500"
          : "border-slate-300 dark:border-slate-700"
      }`}
                placeholder="••••••••"
                disabled={loading}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                })}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            className="
              w-full
              !rounded-full
              bg-orange-500
              py-3.5
              font-semibold
              text-white
              transition-all
              duration-300
              hover:bg-orange-600
              hover:shadow-lg
              disabled:cursor-not-allowed
              disabled:opacity-60
              flex
              items-center
              justify-center
              "
            style={{ borderRadius: "9999px" }}
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Updating Password...
              </>
            ) : (
              "Save New Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
