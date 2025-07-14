import axiosInstance from '../utils/axiosConfig';
import authService from './authService';

/**
 * Fetches the current user's profile data including shipping information
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUserProfile = async () => {
  // First check if user is logged in
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  try {
    const response = await axiosInstance.get('/accounts/me/');
    return response.data;
  } catch (error) {
    console.error('Error fetching current user profile:', error);
    throw error;
  }
};

export default {
  getCurrentUserProfile
};
