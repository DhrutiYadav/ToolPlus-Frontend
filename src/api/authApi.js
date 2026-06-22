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
