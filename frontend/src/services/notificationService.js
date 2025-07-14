import axiosInstance from '../utils/axiosConfig';

export const createNotification = async (notificationData) => {
  try {
    const response = await axiosInstance.post('/notifications/create/', notificationData);
    return response.data;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

export const getNotifications = async () => {
  try {
    // Remove the /api/ prefix since axiosInstance already has baseURL set to http://localhost:8000
    const response = await axiosInstance.get('/notifications/unread/');
    return response.data;
  } catch (error) {
    // Handle 401 Unauthorized errors gracefully
    if (error.response && error.response.status === 401) {
      console.warn('User not authenticated for notifications');
      return { results: [], count: 0 }; // Return empty notifications array
    }
    console.error('Error fetching notifications:', error);
    return { results: [], count: 0 }; // Return empty notifications array instead of throwing
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axiosInstance.post(`/notifications/${notificationId}/mark-read/`, {
      is_read: true
    });
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId) => {
  try {
    await axiosInstance.delete(`/notifications/${notificationId}/`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};
