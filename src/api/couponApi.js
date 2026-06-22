import api from "./axiosInstance";

export const getAllCoupons = async () => {
  const response = await api.get("/coupon");
  return response.data;
};

export const getCouponById = async (id) => {
  const response = await api.get(`/coupon/${id}`);
  return response.data;
};

export const createCoupon = async (data) => {
  const response = await api.post("/coupon", data);
  return response.data;
};

export const updateCoupon = async (id, data) => {
  const response = await api.put(`/coupon/${id}`, data);
  return response.data;
};

export const deleteCoupon = async (id) => {
  const response = await api.delete(`/coupon/${id}`);
  return response.data;
};

export const activateCoupon = async (id) => {
  const response = await api.put(`/coupon/${id}/activate`);
  return response.data;
};

export const deactivateCoupon = async (id) => {
  const response = await api.put(`/coupon/${id}/deactivate`);
  return response.data;
};

export const validateCoupon = async (code, amount) => {
  const response = await api.get("/coupon/validate", {
    params: { code, amount }
  });
  return response.data;
};
