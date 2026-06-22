import api from '../api/axiosInstance';

const cartService = {
  addToCart: async (dealId, quantity = 1) => {
    const response = await api.post('/cart', { dealId, quantity });
    return response.data;
  },

  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  getCartSummary: async () => {
    const response = await api.get('/cart/summary');
    return response.data;
  },

  updateQuantity: async (id, quantity) => {
    const response = await api.put(`/cart/${id}`, { quantity });
    return response.data;
  },

  removeItem: async (id) => {
    const response = await api.delete(`/cart/${id}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  }
};

export default cartService;
