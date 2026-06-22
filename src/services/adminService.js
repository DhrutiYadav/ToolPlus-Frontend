import * as adminApi from "../api/adminApi";
import { mapDealResponse } from "./dealService";

export const getDashboardStats = async () => {
  const data = await adminApi.getDashboardStats();
  if (data && data.topDeals) {
    data.topDeals = data.topDeals.map(mapDealResponse);
  }
  return data;
};

export const changeUserRole = async (userId, role) => {
  return await adminApi.changeUserRole(userId, role);
};

export const banUser = async (userId) => {
  return await adminApi.banUser(userId);
};

export const unbanUser = async (userId) => {
  return await adminApi.unbanUser(userId);
};

export const getAdminOrders = async () => {
  return await adminApi.getAdminOrders();
};

export const getAdminOrderById = async (orderId) => {
  return await adminApi.getAdminOrderById(orderId);
};

export const updateOrderStatus = async (orderId, status) => {
  return await adminApi.updateOrderStatus(orderId, status);
};

export const deleteAdminOrder = async (orderId) => {
  return await adminApi.deleteAdminOrder(orderId);
};

export const getAdminReviews = async (searchTerm = "", pageNumber = 1, pageSize = 10) => {
  return await adminApi.getAdminReviews(searchTerm, pageNumber, pageSize);
};

export const deleteAdminReview = async (reviewId) => {
  return await adminApi.deleteAdminReview(reviewId);
};
