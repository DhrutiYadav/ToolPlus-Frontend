import api from "./axiosInstance";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");
  return response.data;
};

export const changeUserRole = async (userId, role) => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const banUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/ban`);
  return response.data;
};

export const unbanUser = async (userId) => {
  const response = await api.put(`/admin/users/${userId}/unban`);
  return response.data;
};

export const getAdminOrders = async () => {
  const response = await api.get("/admin/orders");
  return response.data;
};

export const getAdminOrderById = async (orderId) => {
  const response = await api.get(`/admin/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/admin/orders/${orderId}/status`, { status });
  return response.data;
};

export const deleteAdminOrder = async (orderId) => {
  const response = await api.delete(`/admin/orders/${orderId}`);
  return response.data;
};

export const getAdminReviews = async (searchTerm = "", pageNumber = 1, pageSize = 10) => {
  const response = await api.get("/admin/reviews", {
    params: { searchTerm, pageNumber, pageSize },
  });
  return response.data;
};

export const deleteAdminReview = async (reviewId) => {
  const response = await api.delete(`/admin/reviews/${reviewId}`);
  return response.data;
};
