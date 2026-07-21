import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../api/authApi";
import { Lock } from "lucide-react";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
      toast.success("If an account exists, a password reset email has been sent.");
    } catch (error) {
      console.error("Forgot password failure:", error);
      toast.success("If an account exists, a password reset email has been sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper auth-page-wrapper-forgot flex items-center justify-center py-12">
      {/* Animated background blobs */}
      <div className="auth-bg-blobs" aria-hidden="true">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
        <div className="auth-blob auth-blob-3"></div>
      </div>

      <div className="login-card auth-card-foreground p-12 shadow-lg border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 transition-colors">

        {/* Back to Login */}
        <div className="mb-6">
          <Link to="/login" className="text-slate-500 dark:text-slate-400 no-underline flex items-center gap-1 font-medium hover:text-orange-500 dark:hover:text-orange-400 transition-colors text-sm">
            <i className="bi bi-arrow-left"></i> Back to Login
          </Link>
        </div>

        {/* Lock icon illustration */}
        <div className="text-center mb-6">
          <div className="bg-orange-100 dark:bg-orange-500/15 text-orange-500 dark:text-orange-400 rounded-full inline-flex items-center justify-center mb-6 transition-colors auth-icon-circle-72">
            <Lock size={32} />
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mb-6">
          <img
            src="/logo/logo-dark.png"
            alt="ToolPlus"
            className="max-w-full h-auto mx-auto dark:hidden auth-logo-sm"
          />
          <img
            src="/logo/logo-white.png"
            alt="ToolPlus"
            className="max-w-full h-auto mx-auto hidden dark:block auth-logo-sm"
          />
        </div>

        <div className="text-center mb-6">
          <h2 className="font-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Forgot Password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base transition-colors">Enter your email to receive a reset link</p>
        </div>

        {emailSent ? (
          <div className="text-center">
            <div className="relative px-4 border border-transparent bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-2xl py-6 mb-6">
              <i className="bi bi-check-circle-fill mr-2 text-lg align-middle"></i>
              Check your email for the reset link!
            </div>
            <Link to="/login" className="btn btn-outline-primary w-full py-6 rounded-full font-bold uppercase tracking-wider">
              Return to Log In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleForgotPassword)} noValidate>
            <div className="mb-6">
              <label className="form-label font-bold text-slate-900 dark:text-white text-sm transition-colors">Email Address</label>
              <input
                type="email"
                className={`form-control py-2 px-6 border ${errors.email ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
                placeholder="name@example.com"
                disabled={loading}
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <div className="invalid-feedback block">{errors.email.message}</div>}
            </div>

            <button
              className="btn btn-primary w-full py-6 rounded-full font-bold uppercase tracking-wider flex justify-center items-center mb-6 shadow-sm hover-lift"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}

        {!emailSent && (
          <div className="text-center mt-6">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-0 transition-colors">
              Remember your password?{" "}
              <Link to="/login" className="text-orange-500 dark:text-orange-400 font-bold no-underline hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
                Log In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
