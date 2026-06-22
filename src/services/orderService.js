import * as orderApi from "../api/orderApi";

export const purchaseDeal = async (dealId, quantity = 1, couponCode = null) => {
  return await orderApi.purchaseDeal(dealId, quantity, couponCode);
};

export const getMyOrders = async () => {
  return await orderApi.getMyOrders();
};

export const getOrdersByStatus = async (status) => {
  return await orderApi.getOrdersByStatus(status);
};

export const updateOrderStatus = async (id, status) => {
  return await orderApi.updateOrderStatus(id, status);
};

export const requestRefund = async (id, reason) => {
  return await orderApi.requestRefund(id, reason);
};

export const approveRefund = async (id) => {
  return await orderApi.approveRefund(id);
};

export const cancelOrder = async (id) => {
  return await orderApi.cancelOrder(id);
};

export const completeOrder = async (id) => {
  return await orderApi.completeOrder(id);
};
