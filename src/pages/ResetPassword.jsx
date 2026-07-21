import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { resetPassword } from "../api/authApi";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

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
      const errorMessage = error.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) return null;

  return (
    <div className="flex items-center justify-center py-12" style={{ minHeight: "80vh" }}>
      <div className="login-card p-12 shadow-lg border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 transition-colors" style={{ maxWidth: "450px", width: "100%", position: "relative" }}>
        
        {/* Back to Login */}
        <div className="mb-6">
          <Link to="/login" className="text-slate-500 dark:text-slate-400 no-underline flex items-center gap-1 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors text-sm">
            <i className="bi bi-arrow-left"></i> Back to Login
          </Link>
        </div>

        {/* Lock icon illustration */}
        <div className="text-center mb-6">
          <div className="bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-full inline-flex items-center justify-center mb-6 transition-colors" style={{ width: 64, height: 64 }}>
            <Lock size={32} />
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo/logo-dark.png"
            alt="ToolPlus"
            className="max-w-full h-auto mx-auto dark:hidden"
            style={{ maxWidth: "180px", height: "auto" }}
          />
          <img
            src="/logo/logo-white.png"
            alt="ToolPlus"
            className="max-w-full h-auto mx-auto hidden dark:block"
            style={{ maxWidth: "180px", height: "auto" }}
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Create New Password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base transition-colors">Enter your new strong password below</p>
        </div>

        <form onSubmit={handleSubmit(handleResetPassword)} noValidate>
          <div className="mb-6">
            <label className="form-label font-bold text-slate-900 dark:text-white text-sm transition-colors">New Password</label>
            <input
              type="password"
              className={`form-control py-2 px-6 border ${errors.newPassword ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
              placeholder="••••••••"
              disabled={loading}
              {...register("newPassword", { 
                  required: "New Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
            />
            {errors.newPassword && <div className="invalid-feedback block">{errors.newPassword.message}</div>}
          </div>

          <div className="mb-6">
            <label className="form-label font-bold text-slate-900 dark:text-white text-sm transition-colors">Confirm New Password</label>
            <input
              type="password"
              className={`form-control py-2 px-6 border ${errors.confirmPassword ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
              placeholder="••••••••"
              disabled={loading}
              {...register("confirmPassword", { required: "Confirm Password is required" })}
            />
            {errors.confirmPassword && <div className="invalid-feedback block">{errors.confirmPassword.message}</div>}
          </div>

          <button
            className="btn btn-primary w-full py-6 rounded-full font-bold uppercase tracking-wider flex justify-center items-center mb-6 shadow-sm hover-lift"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" role="status" aria-hidden="true"></span>
                Saving...
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
