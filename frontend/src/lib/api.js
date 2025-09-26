import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // backend URL
  withCredentials: true,            // if cookies are used
});

// Add request interceptor to include JWT token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;