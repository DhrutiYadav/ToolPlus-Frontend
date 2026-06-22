import api from "./axiosInstance";

export const getDeals = async () => {
  const response = await api.get("/deal");
  return response.data;
};

export const getDealById = async (id) => {
  const response = await api.get(`/deal/${id}`);
  return response.data;
};

export const createDeal = async (dealData) => {
  const response = await api.post("/deal", dealData);
  return response.data;
};

export const updateDeal = async (id, dealData) => {
  const response = await api.put(`/deal/${id}`, dealData);
  return response.data;
};

export const deleteDeal = async (id) => {
  const response = await api.delete(`/deal/${id}`);
  return response.data;
};

export const searchDeals = async (searchTerm = "", pageNumber = 1, pageSize = 10) => {
  const params = {
    searchTerm,
    pageNumber,
    pageSize
  };
  const response = await api.get("/deal/search", { params });
  return response.data;
};

export const getDealsByCategoryId = async (categoryId) => {
  const response = await api.get(`/deal/category/${categoryId}`);
  return response.data;
};

export const uploadDealImage = async (id, file) => {
  const formData = new FormData();
  formData.append("image", file);
  
  const response = await api.post(`/deal/${id}/upload-image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
