import axios from 'axios';
import { ENDPOINTS } from '../config/endpoints';
import { redirectToLogin } from './auth';

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
    console.log('API Interceptor: Request details:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      headers: error.config?.headers,
      data: error.config?.data
    });

    console.log('API Interceptor: Error response:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      headers: error.response?.headers
    });

    const originalRequest = error.config;

    // Don't try to refresh if this is already a refresh request
    if (error.response?.status === 401 && !originalRequest._retry && 
        !originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH)) {
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
          redirectToLogin();
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
        redirectToLogin();
        return Promise.reject(new Error('Session expired. Please log in again.'));
      }
    }

    // If both the original request and refresh failed with 401, 
    // or if refresh endpoint itself returns 401, redirect to login
    if (error.response?.status === 401 && 
        (originalRequest._retry || originalRequest.url?.includes(ENDPOINTS.AUTH.REFRESH))) {
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);