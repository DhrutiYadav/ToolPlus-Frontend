import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../api/authApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await apiLogin(data.email, data.password);
      login(response.accessToken, response.refreshToken);
      toast.success("Welcome back! Login successful.");
      const locationState = location.state;
      if (locationState?.returnTo) {
        navigate(locationState.returnTo, { state: locationState });
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failure:", error);
      const errorMessage = error.response?.data?.message || "Invalid Email or Password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper auth-page-wrapper-login d-flex align-items-center justify-content-center py-5">
      {/* Animated background blobs */}
      <div className="auth-bg-blobs" aria-hidden="true">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
        <div className="auth-blob auth-blob-3"></div>
      </div>

      <div className="login-card auth-card-foreground p-5 shadow-lg border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 transition-colors">

        {/* Logo */}
        <div className="text-center mb-4">
          <img
            src="/logo/logo-dark.png"
            alt="ToolPlus"
            className="img-fluid mx-auto dark:hidden auth-logo-md"
          />
          <img
            src="/logo/logo-white.png"
            alt="ToolPlus"
            className="img-fluid mx-auto hidden dark:block auth-logo-md"
          />
        </div>

        <div className="text-center mb-4">
          <h2 className="fw-extrabold text-slate-900 dark:text-white mb-1 transition-colors">Welcome Back</h2>
          <p className="text-slate-500 dark:text-slate-400 fs-6 transition-colors">Sign in to claim your lifetime deals</p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} noValidate>
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
            <label className="form-label fw-bold text-slate-900 dark:text-white fs-7 transition-colors">Password</label>
            <div className="position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`form-control py-2 px-3 border ${errors.password ? 'is-invalid border-danger' : 'border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors pe-5`}
                placeholder="••••••••"
                disabled={loading}
                {...register("password", { required: "Password is required" })}
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

          {/* Remember Me */}
          <div className="mb-4 d-flex align-items-center justify-content-between">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="rememberMe" {...register("rememberMe")} />
              <label className="form-check-label text-slate-600 dark:text-slate-400 fs-7 transition-colors" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <Link to="/forgot-password" className="text-orange-500 dark:text-orange-400 fw-bold text-decoration-none hover:text-orange-600 dark:hover:text-orange-300 transition-colors fs-7">
              Forgot password?
            </Link>
          </div>

          <button
            className="btn btn-primary w-100 py-3 rounded-pill fw-bold text-uppercase tracking-wider d-flex justify-content-center align-items-center mb-3 shadow-sm hover-lift"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="d-flex align-items-center my-4">
          <hr className="grow border-slate-300 dark:border-slate-700 m-0" />
          <span className="px-3 text-slate-500 dark:text-slate-400 small fw-bold uppercase">Or continue with</span>
          <hr className="grow border-slate-300 dark:border-slate-700 m-0" />
        </div>

        <div className="d-flex flex-column gap-3 mb-4">
          <button
            className="btn btn-outline-dark d-flex align-items-center justify-content-center py-2 rounded-3 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            onClick={() => {
              const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
              if (!clientId) { toast.error("GitHub Login is not configured"); return; }
              const state = crypto.randomUUID();
              sessionStorage.setItem("oauth_state", state);
              const redirectUri = `${window.location.origin}/oauth/callback/github`;
              window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;
            }}
            disabled={loading}
          >
            <i className="bi bi-github fs-5 me-2"></i>
            <span className="fw-bold">Sign in with GitHub</span>
          </button>

          <button
            className="btn btn-primary d-flex align-items-center justify-content-center py-2 rounded-3 border-0 bg-blue-600 hover:bg-blue-700 transition-colors"
            onClick={() => {
              const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
              if (!appId) { toast.error("Facebook Login is not configured"); return; }
              const state = crypto.randomUUID();
              sessionStorage.setItem("oauth_state", state);
              const redirectUri = `${window.location.origin}/oauth/callback/facebook`;
              window.location.href = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile&response_type=token&state=${state}`;
            }}
            disabled={loading}
          >
            <i className="bi bi-facebook fs-5 me-2"></i>
            <span className="fw-bold">Sign in with Facebook</span>
          </button>
        </div>

        <div className="text-center mt-3">
          <p className="text-slate-500 dark:text-slate-400 fs-7 mb-0 transition-colors">
            Don't have an account?{" "}
            <Link to="/register" className="text-orange-500 dark:text-orange-400 fw-bold text-decoration-none hover:text-orange-600 dark:hover:text-orange-300 transition-colors">
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
