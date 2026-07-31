import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../api/authApi";
import { Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleForgotPassword = async (data) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmailSent(true);
      toast.success(
        "If an account exists, a password reset email has been sent.",
      );
    } catch (error) {
      console.error("Forgot password failure:", error);
      toast.success(
        "If an account exists, a password reset email has been sent.",
      );
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

      <div
        className="
          w-full
          max-w-lg
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
        {/* Back to Login */}
        <div className="mb-4">
          <Link
            to="/login"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-500
              dark:text-slate-400
              hover:text-orange-500
              transition-colors
            "
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>

        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img
            src="/logo/logo-horizontal-removebg.png"
            alt="ToolPlus"
            className="block h-16 md:h-24 w-auto dark:hidden"
          />

          <img
            src="/logo/dark-horizontal-logo-removebg.png"
            alt="ToolPlus"
            className="hidden h-16 md:h-24 w-auto dark:block"
          />
        </div>

        {/* Lock icon illustration */}
        <div className="text-center mb-6">
          <div className="bg-orange-100 dark:bg-orange-500/15 text-orange-500 dark:text-orange-400 rounded-full inline-flex items-center justify-center mb-6 transition-colors auth-icon-circle-72 w-16 h-16">
            <Lock size={26} />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="leading-7">
            Forgot Password
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-base text-slate-500 dark:text-slate-400">
            Enter your email to receive a secure password reset link.
          </p>
        </div>

        {emailSent ? (
          <div className="text-center">
            <div className="relative px-4 border border-transparent bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-2xl py-6 mb-6">
              <CheckCircle2 className="mx-auto mb-3 text-green-500" size={40} />
              Check your email for the reset link!
            </div>
            <Link
              to="/login"
              className="
              mt-6
              flex
              w-full
              justify-center
              rounded-xl
              border
              border-orange-500
              px-5
              py-3.5
              font-semibold
              text-orange-500
              transition-all
              hover:bg-orange-500
              hover:text-white
            "
            >
              Return to Log In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(handleForgotPassword)} noValidate>
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
                disabled={loading}
                placeholder="name@example.com"
                className={`
                  w-full
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-600
                  bg-white
                  dark:bg-slate-800
                  px-4
                  py-3.5
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  outline-none
                  transition-all
                  focus:border-orange-500
                  focus:ring-2
                  focus:ring-orange-500/30
                  ${errors.email ? "border-red-500" : ""}
                `}
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors.email && (
                <p className="mt-2 text-sm font-semibold text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                !rounded-full
                bg-gradient-to-r
                from-orange-500
                to-orange-600
                py-3.5
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-orange-500/30
                hover:shadow-xl
                active:scale-[0.98]
                "
            >
              {loading ? (
                <>
                  <span
                    className="inline-block w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin mr-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
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
              <Link
                to="/login"
                className="text-orange-500 dark:text-orange-400 font-bold no-underline hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
              >
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
