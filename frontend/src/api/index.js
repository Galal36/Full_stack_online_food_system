import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const res = await axios.post('/api/auth/token/refresh/', { refresh });
          localStorage.setItem('access_token', res.data.access);
          original.headers.Authorization = `Bearer ${res.data.access}`;
          return api(original);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  profile: () => api.get('/auth/profile/'),
};

// Menu
export const menuAPI = {
  getCategories: () => api.get('/menu/categories/'),
  getItems: (params) => api.get('/menu/items/', { params }),
  createItem: (data) => api.post('/menu/items/', data),
  updateItem: (id, data) => api.patch(`/menu/items/${id}/`, data),
  deleteItem: (id) => api.delete(`/menu/items/${id}/`),
  createCategory: (data) => api.post('/menu/categories/', data),
};

// Orders
export const ordersAPI = {
  getOrders: () => api.get('/orders/'),
  createOrder: (data) => api.post('/orders/', data),
  getOrder: (id) => api.get(`/orders/${id}/`),
  updateStatus: (id, data) => api.patch(`/orders/${id}/update_status/`, data),
  getStats: () => api.get('/orders/stats/'),
};
