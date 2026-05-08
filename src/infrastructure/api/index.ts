

import axios from "axios";

export const ApiIntance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Replace with your API endpoint
  headers: {
    "Content-Type": "application/json",
  },

});

// Add a request interceptor to inject the token
ApiIntance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access_token"); // obtiene token actual de Zustand
    if (token) {
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