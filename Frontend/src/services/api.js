import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================

export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// ==================== CAMPAIGN API ====================

export const campaignAPI = {
  // Get all campaigns with filters
  getCampaigns: async (params = {}) => {
    const response = await api.get('/campaigns', { params });
    return response.data;
  },

  // Get single campaign by ID
  getCampaignById: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  // Get campaigns by category
  getCampaignsByCategory: async (category, params = {}) => {
    const response = await api.get(`/campaigns/category/${category}`, { params });
    return response.data;
  },

  // Get campaigns by type (donation/investment)
  getCampaignsByType: async (type, params = {}) => {
    const response = await api.get(`/campaigns/type/${type}`, { params });
    return response.data;
  },

  // Get trending campaigns
  getTrendingCampaigns: async (limit = 6) => {
    const response = await api.get('/campaigns/trending', { params: { limit } });
    return response.data;
  },

  // Create campaign with file uploads
  createCampaign: async (formData) => {
    const response = await api.post('/campaigns', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update campaign
  updateCampaign: async (id, data) => {
    const response = await api.put(`/campaigns/${id}`, data);
    return response.data;
  },

  // Delete campaign
  deleteCampaign: async (id) => {
    const response = await api.delete(`/campaigns/${id}`);
    return response.data;
  },

  // Like/Unlike campaign
  toggleLike: async (id, userId) => {
    const response = await api.post(`/campaigns/${id}/like`, { userId });
    return response.data;
  },

  // Get campaign comments
  getComments: async (id, params = {}) => {
    const response = await api.get(`/campaigns/${id}/comments`, { params });
    return response.data;
  },

  // Add comment
  addComment: async (id, userId, comment) => {
    const response = await api.post(`/campaigns/${id}/comments`, { userId, comment });
    return response.data;
  },

  // Add investment
  addInvestment: async (id, userId, amount) => {
    const response = await api.post(`/campaigns/${id}/invest`, { userId, amount });
    return response.data;
  },
};

export default api;

