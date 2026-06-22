import api from "./axiosInstance";

export const createPaymentOrder = async (couponCode, items) => {
  const response = await api.post("/payment/create-order", {
    couponCode,
    items
  });
  return response.data;
};

export const verifyPayment = async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const response = await api.post("/payment/verify", {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  });
  return response.data;
};
