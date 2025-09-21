import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081", // backend URL
  withCredentials: true,            // if cookies are used
});

export default api;