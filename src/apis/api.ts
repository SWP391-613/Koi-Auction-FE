// api.ts or api.js
import axios from "axios";
import { getUserCookieToken } from "~/utils/auth.utils";
import { handleAxiosError } from "~/utils/errors.utils";

const API_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // For CORS with credentials
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getUserCookieToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    handleAxiosError(
      error,
      "An unexpected error occurred",
      false,
      error.response?.data?.message || "Error",
    );
    return Promise.reject(error);
  },
);
