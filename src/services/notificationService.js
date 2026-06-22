import api from '../api/axiosInstance';

const notificationService = {
  getUserNotifications: async () => {
    const response = await api.get('/Notification');
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/Notification/unread-count');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.put(`/Notification/read/${id}`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/Notification/read-all');
    return response.data;
  },

  deleteNotification: async (id) => {
    const response = await api.delete(`/Notification/${id}`);
    return response.data;
  },

  clearAll: async () => {
    const response = await api.delete('/Notification/clear');
    return response.data;
  }
};

export default notificationService;
