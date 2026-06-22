import api from "./axiosInstance";

export const getAllUsers = async () => {
  const response = await api.get("/user");
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/user/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};
