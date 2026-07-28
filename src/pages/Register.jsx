import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api/authApi";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import "../styles/Login.css";
import { Eye, EyeOff } from "lucide-react";

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
  // const [watchedPassword, setWatchedPassword] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

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
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please check your credentials.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper auth-page-wrapper-register flex items-center justify-center py-12">
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
          border-slate-200
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
        <div className="login-header text-center mb-6">
          <div className="mb-6 flex justify-center">
            <img
              src="/logo/logo-horizontal-removebg.png"
              alt="ToolPlus Logo"
              className="block h-16 md:h-20 w-auto dark:hidden"
            />
            <img
              src="/logo/dark-horizontal-logo-removebg.png"
              alt="ToolPlus Logo"
              className="hidden h-16 md:h-20 w-auto dark:block"
            />
          </div>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-1 transition-colors">
            Create Account
          </h2>
          <p className="mx-auto max-w-sm text-base text-slate-500 dark:text-slate-400">
            Create your free account and unlock exclusive lifetime software
            deals.
          </p>
        </div>

        <form onSubmit={handleSubmit(handleRegister)} noValidate>
          <div className="mb-6">
            <label
              className="mb-2
                block
                text-sm
                font-semibold
                tracking-wide
                text-slate-800
                dark:text-slate-200 
                transition-colors"
            >
              Full Name
            </label>
            <input
              type="text"
              className={`
                w-full
                rounded-xl
                border
                px-4
                py-3.5
                text-sm
                outline-none
                transition-all
                placeholder:text-slate-500
                bg-white
                dark:bg-slate-800
                text-slate-900
                dark:text-white

                ${
                  errors.name
                    ? "border-red-500 focus:ring-2 focus:ring-red-200"
                    : "border-slate-300 dark:border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/30"
                }
                `}
              placeholder="John Doe"
              disabled={loading}
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="mb-2
                block
                text-sm
                font-semibold
                tracking-wide
                text-slate-800
                dark:text-slate-200 
                font-semibold tracking-wide 
                text-slate-900 
                dark:text-white 
                text-sm 
                transition-colors"
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

          <div className="mb-1">
            <label
              className="mb-2
                block
                text-sm
                font-semibold
                tracking-wide
                text-slate-800
                dark:text-slate-200 
                transition-colors"
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
                  `}
                placeholder="At least 6 characters"
                disabled={loading}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
              />
              <button
                type="button"
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                  flex
                  items-center
                  justify-center
                  text-slate-400
                  hover:text-orange-500
                  transition-colors
                  "
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
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

          {/* Password Strength Indicator */}
          {password && (
            <div className="mb-6 mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Password strength
                </span>
                <span
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: passwordStrength.color }}
                >
                  {passwordStrength.label}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  role="progressbar"
                  style={{
                    width: `${passwordStrength.strength}%`,
                    background: passwordStrength.color,
                    borderRadius: "999px",
                  }}
                  aria-valuenow={passwordStrength.strength}
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              className="mb-2
                        block
                        text-sm
                        font-semibold
                        tracking-wide
                        text-slate-800
                        dark:text-slate-200
                        transition-colors"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
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
                  `}
                placeholder="Repeat password"
                disabled={loading}
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
              />
              <button
                type="button"
                className="
                  absolute
                  right-3
                  top-[52%]
                  -translate-y-1/2
                  p-1
                  text-slate-400
                  hover:text-orange-500
                  transition
                  "
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm font-semibold text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-0 transition-colors">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-orange-500 dark:text-orange-400 font-bold no-underline hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
