import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { oauthLogin } from "../api/authApi";
import { toast } from "react-toastify";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [error, setError] = useState(null);

  // Prevent duplicate API calls in React Strict Mode
  const processed = useRef(false);

  useEffect(() => {
    const processCallback = async () => {
      if (processed.current) return;

      const searchParams = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.substring(1));

      const provider = location.pathname.split("/").pop();

      let token = null;
      let returnedState = null;

      if (provider.toLowerCase() === "github") {
        token = searchParams.get("code");
        returnedState = searchParams.get("state");
      } else if (provider.toLowerCase() === "facebook") {
        token =
          hashParams.get("access_token") || searchParams.get("code");
        returnedState =
          hashParams.get("state") || searchParams.get("state");
      }

      const savedState = sessionStorage.getItem("oauth_state");
      sessionStorage.removeItem("oauth_state");

      if (savedState && returnedState !== savedState) {
        setError("Security error: CSRF state mismatch. Request rejected.");
        processed.current = true;
        return;
      }

      if (!token) {
        setError("No authorization token found in the callback URL.");
        processed.current = true;
        return;
      }

      processed.current = true;

      try {
        const response = await oauthLogin(
          provider.charAt(0).toUpperCase() +
            provider.slice(1).toLowerCase(),
          token
        );

        login(response.accessToken, response.refreshToken);

        toast.success(`Successfully logged in via ${provider}!`);

        navigate("/");
      } catch (err) {
        console.error("OAuth login failed:", err);

        setError(
          err.response?.data?.message || "OAuth login failed"
        );

        toast.error("OAuth login failed. Please try again.");
      }
    };

    processCallback();
  }, [location, login, navigate]);

  if (error) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-lg dark:border-red-800 dark:bg-gray-900">
          <h2 className="mb-4 text-3xl font-bold text-red-600 dark:text-red-400">
            Authentication Failed
          </h2>

          <p className="mb-8 text-gray-600 dark:text-gray-300">
            {error}
          </p>

          <button
            onClick={() => navigate("/login")}
            className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-r-transparent"></div>

        <h4 className="text-xl font-semibold text-gray-800 dark:text-white">
          Authenticating...
        </h4>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Please wait while we complete your login.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;