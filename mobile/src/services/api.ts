import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || 'https://dummyjson.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach stored JWT to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('mk_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password, expiresInMins: 30 }),
};

// Products
export const productsApi = {
  getAll: (limit = 20, skip = 0, search?: string) => {
    if (search) {
      return api.get(
        `/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
      );
    }
    return api.get(`/products?limit=${limit}&skip=${skip}`);
  },
  getById: (id: number) => api.get(`/products/${id}`),
  getByCategory: (category: string, limit = 100) =>
    api.get(`/products/category/${encodeURIComponent(category)}?limit=${limit}`),
};

export default api;
