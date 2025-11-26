import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'aura_access_token';
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY || 'aura_refresh_token';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management (using sessionStorage for persistence)
const getStoredToken = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};

const setStoredToken = (key: string, value: string): void => {
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.error('Error saving token', e);
  }
};

const removeStoredToken = (key: string): void => {
  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing token', e);
  }
};

let accessToken: string | null = getStoredToken(TOKEN_KEY);
let refreshToken: string | null = getStoredToken(REFRESH_TOKEN_KEY);

export const setTokens = (access: string, refresh?: string | null): void => {
  accessToken = access;
  setStoredToken(TOKEN_KEY, access);

  if (refresh) {
    refreshToken = refresh;
    setStoredToken(REFRESH_TOKEN_KEY, refresh);
  } else {
    refreshToken = null;
    removeStoredToken(REFRESH_TOKEN_KEY);
  }
};

export const getAccessToken = (): string | null => accessToken;
export const getRefreshToken = (): string | null => refreshToken;

export const clearTokens = (): void => {
  accessToken = null;
  refreshToken = null;
  removeStoredToken(TOKEN_KEY);
  removeStoredToken(REFRESH_TOKEN_KEY);
};

// Request Interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp for debugging
    (config as any).metadata = { startTime: new Date() };

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error: AxiosError) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle errors and refresh token
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const config = response.config as any;
    const endTime = new Date();
    const duration = endTime.getTime() - config.metadata.startTime.getTime();

    console.log(`[API Response] ${response.status} ${config.url} (${duration}ms)`, {
      data: response.data,
    });

    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    console.error('[API Error]', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = getRefreshToken();
      if (refresh) {
        try {
          const response = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken: refresh,
          });

          const { token, refreshToken: newRefresh } = response.data;
          setTokens(token, newRefresh);

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed - clear tokens and redirect to login
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token - redirect to login
        clearTokens();
        window.location.href = '/login';
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

// Request cancellation support
export const createCancelToken = () => axios.CancelToken.source();

export const isCancel = axios.isCancel;

// Type-safe API client methods
export class ApiClient {
  static async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  }

  static async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  }

  static async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  }

  static async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  }

  static async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  }
}

export default apiClient;
