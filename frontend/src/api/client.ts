import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import { tokenStore } from "./tokenStore";

const baseURL = import.meta.env.VITE_API_URL;

// withCredentials lets the browser send/receive the HttpOnly refresh cookie.
export const api = axios.create({ baseURL, withCredentials: true });

// Refresh uses its own instance so it never goes through the interceptors below.
const bare = axios.create({ baseURL, withCredentials: true });

let refreshPromise: Promise<string> | null = null;

/**
 * Exchange the refresh cookie for a new access token.
 * Concurrent callers share ONE request: refresh tokens rotate, so a second
 * simultaneous call would replay a blacklisted token and log the user out.
 */
export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = bare
      .post<{ access: string }>("/auth/refresh/")
      .then((res) => {
        tokenStore.set(res.data.access);
        return res.data.access;
      })
      .catch((err) => {
        tokenStore.set(null);
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// Called when a refresh fails mid-session, so the UI can drop to "logged out".
let onAuthFailure: (() => void) | null = null;
export function setAuthFailureHandler(handler: (() => void) | null) {
  onAuthFailure = handler;
}

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const isAuthEndpoint = original?.url?.startsWith("/auth/") ?? false;

    // Expired access token: refresh once, then replay the original request.
    if (error.response?.status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      try {
        const token = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        onAuthFailure?.();
      }
    }
    return Promise.reject(error);
  },
);