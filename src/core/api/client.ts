import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ApiResponse } from '@shared/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Instance Axios configurée avec interceptors
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor : ajoute le token ---
apiClient.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('mediconnect_auth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.user?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // Token invalide, on continue sans
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor : gère les erreurs globales ---
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mediconnect_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Helper typé pour les requêtes GET
 */
export async function apiGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return response.data.data as T;
}

/**
 * Helper typé pour les requêtes POST
 */
export async function apiPost<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.post<ApiResponse<T>>(url, data, config);
  return response.data.data as T;
}

/**
 * Helper typé pour les requêtes PUT
 */
export async function apiPut<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.put<ApiResponse<T>>(url, data, config);
  return response.data.data as T;
}

/**
 * Helper typé pour les requêtes DELETE
 */
export async function apiDelete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.delete<ApiResponse<T>>(url, config);
  return response.data.data as T;
}

export default apiClient;
