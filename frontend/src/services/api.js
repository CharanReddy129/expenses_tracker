import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(process.env.REACT_APP_TOKEN_KEY || 'expense_tracker_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const auth = {
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  register: (userData) => axiosInstance.post('/auth/register', userData),
  logout: () => axiosInstance.post('/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/auth/me'),
};

const expenses = {
  getAll: () => axiosInstance.get('/expenses'),
  getByCategory: (category) => axiosInstance.get(`/expenses/category/${category}`),
  getByDateRange: (startDate, endDate) => 
    axiosInstance.get(`/expenses/date-range?startDate=${startDate}&endDate=${endDate}`),
  create: (data) => axiosInstance.post('/expenses', data),
  update: (id, data) => axiosInstance.put(`/expenses/${id}`, data),
  delete: (id) => axiosInstance.delete(`/expenses/${id}`),
  getSummary: () => axiosInstance.get('/expenses/summary')
};

export { expenses, auth };

export const users = {
  updateProfile: (userData) => axiosInstance.patch('/users/profile', userData),
  deleteAccount: () => axiosInstance.delete('/users/profile'),
};

export default axiosInstance; 