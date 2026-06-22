import api from "./axiosInstance";

export const purchaseDeal = async (dealId, quantity = 1, couponCode = null) => {
  const response = await api.post("/orders", { dealId, quantity, couponCode });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/orders/my-orders");
  return response.data;
};

export const getOrdersByStatus = async (status) => {
  const response = await api.get(`/orders/status/${status}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/update-status/${id}`, { status });
  return response.data;
};

export const requestRefund = async (id, reason) => {
  const response = await api.put(`/orders/request-refund/${id}`, { reason });
  return response.data;
};

export const approveRefund = async (id) => {
  const response = await api.put(`/orders/approve-refund/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/cancel/${id}`);
  return response.data;
};

export const completeOrder = async (id) => {
  const response = await api.put(`/orders/complete/${id}`);
  return response.data;
};
