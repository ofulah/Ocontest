import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import axiosInstance from '../utils/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(authService.getToken());

  useEffect(() => {
    // Check if user is logged in on initial load
    const currentUser = authService.getCurrentUser();
    const currentToken = authService.getToken();
    setUser(currentUser);
    setToken(currentToken);
    setLoading(false);

    // Set up axios interceptor for token refresh
    const interceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const newToken = await authService.refreshToken();
          if (newToken) {
            setToken(newToken);
            // Retry the original request with new token
            const config = error.config;
            config.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(config);
          } else {
            // If refresh fails, log out
            logout();
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setToken(authService.getToken()); // Update token state after successful login
      return { success: true };
    } catch (error) {
      // Check if this is an unverified email error
      const requireVerification = error.response?.data?.require_verification === true;
      
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred during login',
        requireVerification: requireVerification
      };
    }
  };

  const register = async (email, password, confirmPassword) => {
    try {
      const response = await authService.register(email, password, confirmPassword);
      // Check if registration requires email verification
      const requireVerification = response?.require_verification === true;
      
      return { 
        success: true,
        requireVerification: requireVerification,
        message: response?.message || 'Registration successful!'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'An error occurred during registration'
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null); // Clear token state on logout
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: 'An error occurred during logout'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    token,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
