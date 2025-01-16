import axios from 'axios';
import { ENDPOINTS } from '../config/endpoints';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('API Interceptor: Handling error response:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method
    });

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('API Interceptor: Handling 401 error, attempting refresh');
      originalRequest._retry = true;

      if (isRefreshing) {
        console.log('API Interceptor: Token refresh already in progress');
        try {
          // Wait for the other refresh request
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          console.log('API Interceptor: Retrying original request after refresh');
          // Retry original request
          return api(originalRequest);
        } catch (err) {
          console.error('API Interceptor: Error during refresh wait:', err);
          return Promise.reject(err);
        }
      }

      isRefreshing = true;

      try {
        const refreshResponse = await api.post(ENDPOINTS.AUTH.REFRESH);
        if (refreshResponse.data?.success) {
          processQueue(null);
          isRefreshing = false;
          return api(originalRequest);
        }
        throw new Error('Token refresh failed');
      } catch (refreshError) {
        processQueue(refreshError);
        isRefreshing = false;
        localStorage.removeItem('userName');
        window.location.href = '/';
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }

    return Promise.reject(error);
  }
);