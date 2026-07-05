import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "https://finvistaca-backend-ebon.vercel.app",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("finvista_admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // We purposefully do not clear localStorage on 401 here anymore, 
    // to prevent the session from being destroyed if a specific endpoint fails.
    return Promise.reject(error);
  }
);
