import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import api from "../api/axiosInstance";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleForgotPassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/profile/forgot-password", data);
      toast.success("Password reset successfully! You can now log in.");
      navigate("/login");
    } catch (error) {
      console.error("Forgot password failure:", error);
      const errorMessage = error.response?.data?.message || "Failed to reset password.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Reset Password</h2>
          <p className="text-slate-500 dark:text-slate-400 fs-6 transition-colors">Enter your email and a new password</p>
        </div>

        <form onSubmit={handleSubmit(handleForgotPassword)} noValidate>
          <div className="mb-3">
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Email Address</label>
            <input
              type="email"
              className={`form-control py-2 px-3 border ${errors.email ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
              placeholder="name@example.com"
              disabled={loading}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">New Password</label>
            <input
              type="password"
              className={`form-control py-2 px-3 border ${errors.newPassword ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
              placeholder="••••••••"
              disabled={loading}
              {...register("newPassword", { required: "New Password is required" })}
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
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-slate-500 dark:text-slate-400 fs-7 mb-0 transition-colors">
            Remember your password?{" "}
            <Link to="/login" className="text-orange-500 dark:text-orange-400 fw-bold text-decoration-none hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
