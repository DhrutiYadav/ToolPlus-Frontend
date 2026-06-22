import api from "./axiosInstance";

export const changePassword = async (passwordData) => {
  const response = await api.post("/profile/change-password", passwordData);
  return response.data;
};
