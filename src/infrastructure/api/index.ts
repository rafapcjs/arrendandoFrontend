

import axios from "axios";

export const ApiIntance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API endpoint
  headers: {
    "Content-Type": "application/json",
  },

});

ApiIntance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/login') || error.config?.url?.includes('/auth/register');
    if (!isAuthEndpoint && error.response?.status === 401) {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add a request interceptor to inject the token
ApiIntance.interceptors.request.use(
  (config) => {
    const isAuthEndpoint = config.url?.includes("/auth/login") || config.url?.includes("/auth/register");
    const token = sessionStorage.getItem("access_token");
    if (token && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Si el payload es FormData, dejar que Axios establezca automáticamente el Content-Type
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);