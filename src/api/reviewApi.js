import api from "./axiosInstance";

export const getReviewsByDealId = async (dealId) => {
  const response = await api.get(`/review/deal/${dealId}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post("/review", reviewData);
  return response.data;
};

export const approveReview = async (id) => {
  const response = await api.put(`/review/approve/${id}`);
  return response.data;
};

export const rejectReview = async (id) => {
  const response = await api.put(`/review/reject/${id}`);
  return response.data;
};

export const updateReview = async (id, data) => {
  const response = await api.put(`/review/${id}`, data);
  return response.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/review/${id}`);
  return response.data;
};
