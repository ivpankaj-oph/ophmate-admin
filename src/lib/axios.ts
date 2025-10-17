import axios, { AxiosInstance } from "axios";
import { store } from "../store"; // import your Redux store

const BASE_URL = import.meta.env.VITE_PUBLIC_API_URL;



const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}`, 
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;
    const role = state.auth?.user.role; 


    if (config.url && !config.url.startsWith("/auth") && !config.url.includes("/login")) {
      const prefix = role === "vendor" ? "/vendor" : "/admin";
      if (!config.url.startsWith(prefix)) {
        config.url = `${prefix}${config.url}`;
      }
    }

    // 🔐 Attach token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🚦 Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized — maybe token expired");
      // Optionally trigger logout here
    }
    return Promise.reject(error);
  }
);

export default api;
