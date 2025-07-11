const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.ocontest.xyz/api' 
  : 'http://localhost:8000/api';

export const apiConfig = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with cross-origin requests
};

export const endpoints = {
  // Auth endpoints
  login: '/auth/login/',
  register: '/auth/register/',
  logout: '/auth/logout/',
  refreshToken: '/auth/token/refresh/',
  
  // User endpoints
  userProfile: '/users/me/',
  updateProfile: '/users/me/update/',
  
  // Contest endpoints
  contests: '/contests/',
  contestDetail: (id) => `/contests/${id}/`,
  contestSubmissions: (id) => `/contests/${id}/submissions/`,
  
  // Video endpoints
  videos: '/videos/',
  videoDetail: (id) => `/videos/${id}/`,
  uploadVideo: '/videos/upload/',
  
  // Notification endpoints
  notifications: '/notifications/',
  markNotificationAsRead: (id) => `/notifications/${id}/mark_as_read/`,
};

export const getAuthHeader = (token) => ({
  headers: { 'Authorization': `Bearer ${token}` }
});
