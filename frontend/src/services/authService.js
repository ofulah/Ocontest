import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const register = async (email, password, confirmPassword, role = 'creator', companyDetails = null) => {
  const endpoint = role === 'brand' ? '/accounts/auth/register/brand/' : '/accounts/auth/register/';
  const data = role === 'brand' 
    ? {
        email,
        password,
        confirm_password: confirmPassword,
        company_name: companyDetails.companyName,
        industry: companyDetails.industry,
        phone_number: companyDetails.phoneNumber
      }
    : {
        email,
        password,
        confirm_password: confirmPassword
      };
  
  const response = await axios.post(`${BASE_URL}${endpoint}`, data);
  return response.data;
};

const transformUserData = (user) => {
  if (!user) return null;
  
  // Transform the profile data into a flattened structure with consistent field names
  const transformedUser = {
    id: user.id, // Ensure ID is always included
    ...user,
    name: user.role === 'creator' ?
      // For creators, try to get name from user first, then fallback to email
      `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email :
      // For brands, show company name
      user.brand_profile?.company_name || user.email,
    profilePicture: user.role === 'creator' ?
      user.creator_profile?.profile_picture :
      user.brand_profile?.company_logo || '',
    bio: user.creator_profile?.bio || '',
    country: user.creator_profile?.country || '',
    experienceLevel: user.creator_profile?.experience_level || null,
    address: user.creator_profile?.address || '',
    portfolio_url: user.creator_profile?.portfolio_url || '',
    social_media_links: user.creator_profile?.social_media_links || {},
    // Remove the nested profile objects to avoid React rendering issues
    creator_profile: undefined,
    brand_profile: undefined
  };
  
  return transformedUser;
};

const login = async (email, password) => {
  const response = await axios.post(`${BASE_URL}/accounts/auth/login/`, {
    email,
    password
  });
  if (response.data) {
    const { tokens, user } = response.data;
    console.log('Login response:', { user, tokens });
    const transformedUser = transformUserData(user);
    console.log('Transformed user:', transformedUser);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('user', JSON.stringify(transformedUser));
    localStorage.setItem('userId', transformedUser.id.toString()); // Use transformed user ID
    return transformedUser;
  }
  return null;
};

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('userId');
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  const token = localStorage.getItem('access_token');
  if (!token) return null;
  const user = userStr ? JSON.parse(userStr) : null;
  return user ? transformUserData(user) : null;
};

const getToken = () => {
  return localStorage.getItem('access_token');
};

const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return null;
  
  try {
    const response = await axios.post(`${BASE_URL}/token/refresh/`, {
      refresh
    });
    const { access } = response.data;
    localStorage.setItem('access_token', access);
    return access;
  } catch (error) {
    logout();
    return null;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
  refreshToken
};

export default authService;
