import api from "./axiosInstance";

export const getCategories = async () => {
  const response = await api.get("/category");
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/category/${id}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post("/category", categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/category/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/category/${id}`);
  return response.data;
};

export const searchCategories = async (searchTerm) => {
  const response = await api.get(`/category/search?searchTerm=${encodeURIComponent(searchTerm)}`);
  return response.data;
};
