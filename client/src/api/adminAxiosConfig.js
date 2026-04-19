import axios from "axios";


const adminApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api",
  withCredentials: true,
});

// attach admin token
adminApi.interceptors.request.use(config => {
  let accessToken = localStorage.getItem("adminAccessToken");

  if (accessToken) {
    try {
      const parsed = JSON.parse(accessToken);
      if (parsed.accessToken) {
        accessToken = parsed.accessToken;
        localStorage.setItem("adminAccessToken", accessToken);
      }
    } catch (e) {
      // not JSON, use as is
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// refresh handling
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

adminApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/admin/refresh") || originalRequest.url?.includes("/auth/admin/login")) {
      isRefreshing = false;
      processQueue(error, null);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (sessionStorage.getItem("adminRefreshFailed")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return adminApi(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await adminApi.post("/auth/admin/refresh");
        if (response.data.success && response.data.accessToken) {
          const { accessToken } = response.data;
          localStorage.setItem("adminAccessToken", accessToken);
          sessionStorage.removeItem("adminRefreshFailed");
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;
          processQueue(null, accessToken);
          return adminApi(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        localStorage.removeItem("adminAccessToken");
        sessionStorage.setItem("adminRefreshFailed", "true");
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
