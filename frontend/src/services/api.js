import axios from 'axios';
import { apiConfig, endpoints, getAuthHeader } from '../config/api';

const api = axios.create(apiConfig);

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(
          `${apiConfig.baseURL}${endpoints.refreshToken}`,
          { refresh: refreshToken },
          { ...apiConfig, skipAuthRefresh: true }
        );
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (error) {
        // Refresh token failed, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post(endpoints.login, credentials),
  register: (userData) => api.post(endpoints.register, userData),
  logout: () => api.post(endpoints.logout),
  refreshToken: (refreshToken) => 
    api.post(endpoints.refreshToken, { refresh: refreshToken }),
};

// User API
export const userAPI = {
  getProfile: () => api.get(endpoints.userProfile),
  updateProfile: (userData) => api.patch(endpoints.updateProfile, userData),
};

// Contest API
export const contestAPI = {
  getAll: (params = {}) => api.get(endpoints.contests, { params }),
  getById: (id) => api.get(endpoints.contestDetail(id)),
  create: (contestData) => api.post(endpoints.contests, contestData),
  update: (id, contestData) => api.patch(endpoints.contestDetail(id), contestData),
  delete: (id) => api.delete(endpoints.contestDetail(id)),
  getSubmissions: (contestId) => api.get(endpoints.contestSubmissions(contestId)),
};

// Video API
export const videoAPI = {
  getAll: (params = {}) => api.get(endpoints.videos, { params }),
  getById: (id) => api.get(endpoints.videoDetail(id)),
  upload: (videoData, onUploadProgress) => {
    const formData = new FormData();
    Object.entries(videoData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    return api.post(endpoints.uploadVideo, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },
  update: (id, videoData) => api.patch(endpoints.videoDetail(id), videoData),
  delete: (id) => api.delete(endpoints.videoDetail(id)),
};

// Notification API
export const notificationAPI = {
  getAll: () => api.get(endpoints.notifications),
  markAsRead: (id) => api.post(endpoints.markNotificationAsRead(id)),
};

export default api;
