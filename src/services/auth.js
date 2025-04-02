import { api } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const login = async (email, password) => {
  try {
    console.log('Attempting login with API URL:', import.meta.env.VITE_BACKEND_URL);
    console.log('Login endpoint:', ENDPOINTS.AUTH.LOGIN);
    
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { 
      email, 
      password 
    });
    
    console.log('Login response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data
    });
    
    if (response.data?.success) {
      localStorage.setItem('userName', response.data.name);
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
    
    // If the error is a 404 (Not Found), it could be a backend URL issue
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
    window.location.href = '/';
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear local storage and redirect on error
    localStorage.removeItem('userName');
    window.location.href = '/';
  }
};

export const checkAuth = () => {
  return !!localStorage.getItem('userName');
};