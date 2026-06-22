import * as categoryApi from "../api/categoryApi";

export const getCategories = async () => {
  return await categoryApi.getCategories();
};

export const getCategoryById = async (id) => {
  return await categoryApi.getCategoryById(id);
};

export const createCategory = async (categoryData) => {
  return await categoryApi.createCategory(categoryData);
};

export const updateCategory = async (id, categoryData) => {
  return await categoryApi.updateCategory(id, categoryData);
};

export const deleteCategory = async (id) => {
  return await categoryApi.deleteCategory(id);
};

export const searchCategories = async (searchTerm) => {
  return await categoryApi.searchCategories(searchTerm);
};
