import api from "./axiosInstance";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await api.post("/auth/register", { name, email, password });
  return response.data;
};

export const logoutUser = async (refreshToken) => {
  const response = await api.post("/auth/logout", { refreshToken });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await api.post("/auth/reset-password", { token, newPassword, confirmPassword });
  return response.data;
};

export const oauthLogin = async (provider, token) => {
  const response = await api.post("/auth/oauth-login", { provider, token });
  return response.data;
};
