import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let refreshPromise = null;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 403) {
      toast.error("You do not have permission to perform this action.");
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          const refreshToken = localStorage.getItem("refreshToken");

          refreshPromise = axios
            .post(
              `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
              {
                refreshToken,
              },
            )
            .then((response) => {
              const newAccessToken = response.data.accessToken;
              const newRefreshToken = response.data.refreshToken;

              localStorage.setItem("token", newAccessToken);
              localStorage.setItem("refreshToken", newRefreshToken);

              return newAccessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const newAccessToken = await refreshPromise;

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;