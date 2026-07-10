import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (email: string, password: string, fullName: string) =>
    api.post('/auth/register', { email, password, fullName }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),
};

export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data: any) => api.put('/users/me', data),
};

export const weightAPI = {
  getAll: (params?: any) => api.get('/weight', { params }),
  getById: (id: string) => api.get(`/weight/${id}`),
  create: (data: any) => api.post('/weight', data),
  update: (id: string, data: any) => api.put(`/weight/${id}`, data),
  delete: (id: string) => api.delete(`/weight/${id}`),
};

export const sleepAPI = {
  getAll: (params?: any) => api.get('/sleep', { params }),
  create: (data: any) => api.post('/sleep', data),
  update: (id: string, data: any) => api.put(`/sleep/${id}`, data),
  delete: (id: string) => api.delete(`/sleep/${id}`),
};

export const mealAPI = {
  getAll: (params?: any) => api.get('/meals', { params }),
  create: (data: any) => api.post('/meals', data),
  update: (id: string, data: any) => api.put(`/meals/${id}`, data),
  delete: (id: string) => api.delete(`/meals/${id}`),
};

export const workoutAPI = {
  getAll: (params?: any) => api.get('/workouts', { params }),
  create: (data: any) => api.post('/workouts', data),
  update: (id: string, data: any) => api.put(`/workouts/${id}`, data),
  delete: (id: string) => api.delete(`/workouts/${id}`),
};

export const waterAPI = {
  getAll: (params?: any) => api.get('/water', { params }),
  create: (data: any) => api.post('/water', data),
  delete: (id: string) => api.delete(`/water/${id}`),
};

export const journalAPI = {
  getAll: (params?: any) => api.get('/journal', { params }),
  getById: (id: string) => api.get(`/journal/${id}`),
  create: (data: any) => api.post('/journal', data),
  update: (id: string, data: any) => api.put(`/journal/${id}`, data),
  delete: (id: string) => api.delete(`/journal/${id}`),
};

export const moodAPI = {
  getAll: (params?: any) => api.get('/moods', { params }),
  create: (data: any) => api.post('/moods', data),
  update: (id: string, data: any) => api.put(`/moods/${id}`, data),
  delete: (id: string) => api.delete(`/moods/${id}`),
};

export const symptomAPI = {
  getAll: (params?: any) => api.get('/symptoms', { params }),
  create: (data: any) => api.post('/symptoms', data),
  update: (id: string, data: any) => api.put(`/symptoms/${id}`, data),
  delete: (id: string) => api.delete(`/symptoms/${id}`),
};

export const substanceUseAPI = {
  getAll: (params?: any) => api.get('/substance-use', { params }),
  create: (data: any) => api.post('/substance-use', data),
  update: (id: string, data: any) => api.put(`/substance-use/${id}`, data),
  delete: (id: string) => api.delete(`/substance-use/${id}`),
};

export const cravingAPI = {
  getAll: (params?: any) => api.get('/cravings', { params }),
  create: (data: any) => api.post('/cravings', data),
  update: (id: string, data: any) => api.put(`/cravings/${id}`, data),
  delete: (id: string) => api.delete(`/cravings/${id}`),
};

export const abstinenceAPI = {
  getAll: (params?: any) => api.get('/abstinence', { params }),
  create: (data: any) => api.post('/abstinence', data),
  update: (id: string, data: any) => api.put(`/abstinence/${id}`, data),
  delete: (id: string) => api.delete(`/abstinence/${id}`),
};

export const goalAPI = {
  getAll: (params?: any) => api.get('/goals', { params }),
  create: (data: any) => api.post('/goals', data),
  update: (id: string, data: any) => api.put(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
};

export const habitAPI = {
  getAll: (params?: any) => api.get('/habits', { params }),
  create: (data: any) => api.post('/habits', data),
  update: (id: string, data: any) => api.put(`/habits/${id}`, data),
  complete: (id: string, data?: any) => api.post(`/habits/${id}/complete`, data || {}),
  delete: (id: string) => api.delete(`/habits/${id}`),
};

export const dashboardAPI = {
  getToday: () => api.get('/dashboard/today'),
  getStats: (period: string) => api.get(`/dashboard/stats/${period}`),
};

export const analyticsAPI = {
  getWeightAnalytics: (period: string) => api.get(`/analytics/weight/${period}`),
  getNutritionAnalytics: (period: string) => api.get(`/analytics/nutrition/${period}`),
  getMoodAnalytics: (period: string) => api.get(`/analytics/mood/${period}`),
  getCravingAnalytics: (period: string) => api.get(`/analytics/cravings/${period}`),
  getSubstanceAnalytics: (period: string) => api.get(`/analytics/substance/${period}`),
};

export default api;
