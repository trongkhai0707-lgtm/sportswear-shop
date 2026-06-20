import axios from "axios";
import { getAccessToken, logout } from "./AuthService";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request interceptor: tự động đính kèm JWT ──────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: bắt 401 → logout + redirect ──────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 || status === 403) {
      const isLoginPage = window.location.pathname === "/dang-nhap";
      if (!isLoginPage) {
        logout();
        const returnUrl = window.location.pathname + window.location.search;
        window.location.href = `/dang-nhap?returnUrl=${encodeURIComponent(returnUrl)}`;
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
