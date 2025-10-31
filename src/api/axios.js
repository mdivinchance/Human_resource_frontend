import axios from "axios";

const api = axios.create({
  baseURL: "https://40e8bf775df3.ngrok-free.app/api",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // read the token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
