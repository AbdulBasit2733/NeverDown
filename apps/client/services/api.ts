import { BACKEND_URL } from "@/lib/utils";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// Extended config to track if a request has already been retried
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const api = axios.create({
  baseURL: BACKEND_URL, 
  withCredentials: true,
});
  
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 1. If we got rate limited by Render, stop immediately and redirect
    if (error.response?.status === 429) {
      if (typeof window !== "undefined") {
        window.location.href = "/signin?error=rate_limited";
      }
      return Promise.reject(error);
    }

    // 2. IMPORTANT FIX: Do NOT run interceptor logic if the request that failed WAS the refresh endpoint
    if (
      error.response?.status === 401 && 
      originalRequest && 
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh") // <--- THIS BREAKS THE INFINITE LOOP
    ) {
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/auth/refresh");
        processQueue(null);
        
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        if (typeof window !== "undefined") {
          window.location.href = "/signin";
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);