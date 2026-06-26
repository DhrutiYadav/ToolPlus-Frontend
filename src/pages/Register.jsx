import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api/authApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import "../styles/Login.css";

// Password strength calculator
const getPasswordStrength = (password) => {
  if (!password) return { strength: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { strength: 20, label: "Weak", color: "#ef4444" };
  if (score <= 2) return { strength: 40, label: "Fair", color: "#f59e0b" };
  if (score <= 3) return { strength: 65, label: "Good", color: "#3b82f6" };
  return { strength: 100, label: "Strong", color: "#22c55e" };
};

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [watchedPassword, setWatchedPassword] = useState("");
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const password = watch("password", "");
  const passwordStrength = getPasswordStrength(password);

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      await apiRegister(data.name, data.email, data.password);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error.response?.data?.message || "Registration failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper auth-page-wrapper-register d-flex align-items-center justify-content-center py-5">
      {/* Animated background blobs */}
      <div className="auth-bg-blobs" aria-hidden="true">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
        <div className="auth-blob auth-blob-3"></div>
      </div>

      <div className="login-card auth-card-foreground p-5 shadow-lg border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 transition-colors">
        <div className="login-header text-center mb-4">
          <div className="mb-4 d-flex justify-content-center">
            <img
              src="/logo/logo-dark.png"
              alt="ToolPlus Logo"
              className="img-fluid mx-auto dark:hidden auth-logo-lg"
            />
            <img
              src="/logo/logo-white.png"
              alt="ToolPlus Logo"
              className="img-fluid mx-auto hidden dark:block auth-logo-lg"
            />
          </div>
          <h2 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Create Account</h2>
          <p className="text-slate-500 dark:text-slate-400 fs-6 transition-colors">Sign up to access lifetime software deals</p>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} noValidate>
          <div className="mb-3">
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Full Name</label>
            <input
              type="text"
              className={`form-control py-2 px-3 border ${errors.name ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors`}
              placeholder="John Doe"
              disabled={loading}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
          </div>

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

          <div className="mb-1">
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control py-2 px-3 border ${errors.password ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors pe-5`}
                placeholder="At least 6 characters"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
              />
              <button
                type="button"
                className="btn btn-link position-absolute inset-e-0 top-50 translate-middle-y me-1 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors border-0"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} fs-5`}></i>
              </button>
            </div>
            {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mb-3 mt-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fs-8 text-slate-500 dark:text-slate-400">Password strength</span>
                <span className="fs-8 fw-bold" style={{ color: passwordStrength.color }}>{passwordStrength.label}</span>
              </div>
              <div className="progress auth-progress-track">
                <div
                  className="progress-bar auth-progress-bar"
                  role="progressbar"
                  style={{
                    width: `${passwordStrength.strength}%`,
                    background: passwordStrength.color,
                    borderRadius: "999px"
                  }}
                  aria-valuenow={passwordStrength.strength}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          )}

          <div className="mb-4">
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Confirm Password</label>
            <div className="position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className={`form-control py-2 px-3 border ${errors.confirmPassword ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors pe-5`}
                placeholder="Repeat password"
                disabled={loading}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: value => value === password || "Passwords do not match"
                })}
              />
              <button
                type="button"
                className="btn btn-link position-absolute inset-e-0 top-50 translate-middle-y me-1 p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors border-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'} fs-5`}></i>
              </button>
            </div>
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-slate-500 dark:text-slate-400 fs-7 mb-0 transition-colors">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 dark:text-orange-400 fw-bold text-decoration-none hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
