import { api } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const login = async (email, password) => {
  try {
    console.log('Attempting login with API URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('Login endpoint:', ENDPOINTS.AUTH.LOGIN);
    
    let response;
    
    try {
      // Try the standard login endpoint first
      response = await api.post(ENDPOINTS.AUTH.LOGIN, { 
        email, 
        password 
      });
    } catch (loginError) {
      // If standard login fails with 404, try direct-login endpoint
      if (loginError.response?.status === 404) {
        console.log('Standard login failed with 404, trying direct-login endpoint');
        
        const directLoginUrl = `${import.meta.env.VITE_BACKEND_URL}/api/auth/direct-login`;
        console.log('Direct login endpoint:', directLoginUrl);
        
        response = await api.post(directLoginUrl, {
          email,
          password
        });
      } else {
        // If it's not a 404 error, rethrow the original error
        throw loginError;
      }
    }
    
    console.log('Login response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    if (response.data?.success) {
      localStorage.setItem('userName', response.data.name);
      localStorage.setItem('lastLoginTime', Date.now().toString());
      return {
        success: true,
        name: response.data.name
      };
    }
    
    throw new Error(response.data?.message || 'Login failed');
  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
      headers: error.config?.headers
    });
    
    // If both login attempts failed and the error is a 404 (Not Found)
    if (error.response?.status === 404) {
      throw new Error('Login service not available. Please check if the backend is running.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
};

export const logout = async () => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.LOGOUT);
    if (!response.data?.success) {
      throw new Error('Logout failed');
    }
    localStorage.removeItem('userName');
    localStorage.removeItem('lastLoginTime');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage and redirect on error
    localStorage.removeItem('userName');
    localStorage.removeItem('lastLoginTime');
    window.location.href = '/login';
  }
};

export const checkAuth = () => {
  const userName = localStorage.getItem('userName');
  const lastLoginTime = localStorage.getItem('lastLoginTime');
  
  if (!userName) return false;
  
  // Optional: Add session expiration check (e.g., 24 hours)
  if (lastLoginTime) {
    const loginTime = parseInt(lastLoginTime, 10);
    const now = Date.now();
    const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
    
    // If more than 24 hours since last login, consider session expired
    if (hoursSinceLogin > 24) {
      localStorage.removeItem('userName');
      localStorage.removeItem('lastLoginTime');
      return false;
    }
  }
  
  return true;
};

// Add a function to force redirect to login page
export const redirectToLogin = () => {
  localStorage.removeItem('userName');
  localStorage.removeItem('lastLoginTime');
  window.location.href = '/login';
};