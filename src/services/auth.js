import { api } from './api';
import { ENDPOINTS } from '../config/endpoints';

export const login = async (email, password) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { 
      email, 
      password 
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
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
};

export const logout = async () => {
  try {
    await api.post(ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('userName');
    window.location.href = '/';
  }
};

export const checkAuth = () => {
  return !!localStorage.getItem('userName');
};