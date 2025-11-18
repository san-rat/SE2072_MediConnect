import axios from "axios";

const FALLBACK_API_BASE_URL = "https://se2072mediconnect-production.up.railway.app";

const apiBaseUrl =
  (import.meta?.env?.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL.trim()) ||
  FALLBACK_API_BASE_URL;

const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mc_token');
    const tokenType = localStorage.getItem('mc_token_type') || 'Bearer';
    
    if (token) {
      config.headers.Authorization = `${tokenType} ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('mc_token');
      localStorage.removeItem('mc_token_type');
      localStorage.removeItem('mc_role');
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export { api };
export default api;
