import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend URL
  withCredentials: true,            // if cookies are used
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