import axios from "axios";

const APIURL = "http://127.0.0.1:8000/messenger/";

const axiosInstance = axios.create({
  baseURL: APIURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json"
  }
});

// request interceptor

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(APIURL + "api/token/refresh/", {
          refresh: localStorage.getItem("refresh")
        });
        if (res.status === 200) {
          localStorage.setItem("access", res.data.access);
          axiosInstance.defaults.headers["Authorization"] = `Bearer ${res.data.access}`;
          originalRequest.headers["Authorization"] = `Bearer ${res.data.access}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
