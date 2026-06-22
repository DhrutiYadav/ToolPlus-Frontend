import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { resetPassword } from "../api/authApi";

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
    <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: "80vh" }}>
      <div className="login-card p-5 shadow-lg border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 transition-colors" style={{ maxWidth: "450px", width: "100%" }}>
        
        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src="/logo/logo-dark.png"
            alt="ToolPlus"
            className="img-fluid mx-auto"
            style={{ maxWidth: "200px", height: "auto" }}
          />
        </div>

        <div className="text-center mb-4">
          <h2 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Create New Password</h2>
          <p className="text-slate-500 dark:text-slate-400 fs-6 transition-colors">Enter your new strong password below</p>
        </div>

        <form onSubmit={handleSubmit(handleResetPassword)} noValidate>
          <div className="mb-3">
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">New Password</label>
            <input
              type="password"
              className={`form-control py-2 px-3 border ${errors.newPassword ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
              placeholder="••••••••"
              disabled={loading}
              {...register("newPassword", { 
                  required: "New Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
              })}
            />
            {errors.newPassword && <div className="invalid-feedback d-block">{errors.newPassword.message}</div>}
          </div>

          <div className="mb-4">
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Confirm New Password</label>
            <input
              type="password"
              className={`form-control py-2 px-3 border ${errors.confirmPassword ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
              placeholder="••••••••"
              disabled={loading}
              {...register("confirmPassword", { required: "Confirm Password is required" })}
            />
            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword.message}</div>}
          </div>

          <button
            className="btn btn-primary w-100 py-3 rounded-pill fw-bold text-uppercase tracking-wider d-flex justify-content-center align-items-center mb-3 shadow-sm hover-lift"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
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
