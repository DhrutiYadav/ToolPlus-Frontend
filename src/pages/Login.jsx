import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin } from "../api/authApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
      const errorMessage =
        error.response?.data?.message || "Invalid Email or Password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper auth-page-wrapper-login flex items-center justify-center min-h-screen px-6">
      {/* Animated background blobs */}
      <div className="auth-bg-blobs" aria-hidden="true">
        <div className="auth-blob auth-blob-1"></div>
        <div className="auth-blob auth-blob-2"></div>
        <div className="auth-blob auth-blob-3"></div>
      </div>

      <div
        className="
          w-full
          max-w-xl
          rounded-3xl
          border
          border-slate-200/20
          dark:border-slate-600
          bg-white/95
          dark:bg-slate-900/95
          backdrop-blur-xl
          shadow-[0_40px_80px_rgba(0,0,0,0.55)]
          p-10
          sm:p-12
          transition-all
        "
      >
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/logo/logo-horizontal-removebg.png"
            alt="ToolPlus Logo"
            className="block h-16 md:h-24 w-auto dark:hidden"
          />

          <img
            src="/logo/dark-horizontal-logo-removebg.png"
            alt="ToolPlus Logo"
            className="hidden h-16 md:h-24 w-auto dark:block"
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-1 transition-colors">
            Welcome Back
          </h2>

          <p className="mx-auto max-w-sm text-base text-slate-500 dark:text-slate-400">
            Sign in to discover exclusive lifetime software deals.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleLogin)} noValidate>
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
              className={`
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
                ${errors.email ? "border-red-500" : ""}
              `}
              placeholder="name@example.com"
              disabled={loading}
              {...register("email", { required: "Email is required" })}
            />

            {errors.email && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {errors.email.message}
              </p>
            )}
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
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`
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
                  ${errors.password ? "border-red-500" : ""}
                `}
                placeholder="••••••••"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <button
                type="button"
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  text-slate-400
                  hover:text-orange-500
                  transition-colors
                "
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                className="
                  h-4
                  w-4
                  rounded
                  border-slate-300
                  text-orange-500
                  focus:ring-orange-500
                "
                type="checkbox"
                id="rememberMe"
                {...register("rememberMe")}
              />
              <label
                className="text-sm text-slate-600 dark:text-slate-400 transition-colors"
                htmlFor="rememberMe"
              >
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-orange-500 dark:text-orange-400 font-bold no-underline hover:text-orange-600 dark:hover:text-orange-300 transition-colors text-sm"
            >
              Forgot password?
            </Link>
          </div>

          <button
            className="
              mt-2
              flex
              w-full
              items-center
              justify-center
              rounded-xl
              bg-gradient-to-r
              from-orange-500
              to-orange-600
              px-5
              py-3.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-xl
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
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
                Logging In...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="grow border-slate-300 dark:border-slate-700 m-0" />
          <span className="px-6 text-slate-500 dark:text-slate-400 text-xs tracking-[0.2em] font-bold uppercase">
            Or continue with
          </span>
          <hr className="grow border-slate-300 dark:border-slate-700 m-0" />
        </div>

        <div className="flex flex-col gap-3 mb-6">
          <button
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
            border
            border-slate-300
            dark:border-slate-600
            bg-white
            dark:bg-slate-800
            text-slate-900
            dark:text-white
            hover:bg-slate-100
            dark:hover:bg-slate-700
            transition-all
              py-3
              font-semibold
              "
            onClick={() => {
              const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
              if (!clientId) {
                toast.error("GitHub Login is not configured");
                return;
              }
              const state = crypto.randomUUID();
              sessionStorage.setItem("oauth_state", state);
              const redirectUri = `${window.location.origin}/oauth/callback/github`;
              window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`;
            }}
            disabled={loading}
          >
            <span className="font-bold">Sign in with GitHub</span>
          </button>

          <button
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
            hover:bg-blue-700
              py-3
              font-semibold
              text-white
              transition
              hover:bg-[#166FE5]
              "
            onClick={() => {
              const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
              if (!appId) {
                toast.error("Facebook Login is not configured");
                return;
              }
              const state = crypto.randomUUID();
              sessionStorage.setItem("oauth_state", state);
              const redirectUri = `${window.location.origin}/oauth/callback/facebook`;
              window.location.href = `https://www.facebook.com/v16.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email,public_profile&response_type=token&state=${state}`;
            }}
            disabled={loading}
          >
            <span className="font-bold">Sign in with Facebook</span>
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-slate-400 dark:text-slate-400 text-sm mb-0 transition-colors">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-orange-500 dark:text-orange-400 font-bold no-underline hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
            >
              Sign Up Free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
