import axios from "axios";



const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api",
  withCredentials: true,
});
console.log("api", import.meta.env.VITE_API_URL);
api.interceptors.request.use(config => {
  let accessToken = localStorage.getItem("studentAccessToken");

  if (accessToken) {
    try {
      const parsed = JSON.parse(accessToken);
      if (parsed.accessToken) {
        accessToken = parsed.accessToken;
        localStorage.setItem("studentAccessToken", accessToken);
      }
    } catch {
      // not JSON, use as is
    }

    if (!config.url.includes("/auth/refresh")) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  return config;
});

// Track ongoing refresh to prevent race conditions
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

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    console.log("Response error:", error.response?.status, error.config?.url);

    // Don't try to refresh if it's the refresh endpoint itself that failed
    if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/student/refresh") || originalRequest.url?.includes("/auth/student/login")) {
      console.log("Refresh or login endpoint failed, not retrying");
      isRefreshing = false;
      processQueue(error, null);
      return Promise.reject(error);
    }

    // Don't try to refresh on auth pages
    const authPages = [
      "/login",
      "/signup",
      "/verify-otp",
      "/forget-password",
      "/reset-password",
    ];
    const isAuthPage = authPages.some(page =>
      window.location.pathname.includes(page)
    );

    if (isAuthPage && originalRequest.url?.includes("/auth/")) {
      console.log("Auth page - not attempting token refresh");
      return Promise.reject(error);
    }

    // Check if error.response exists to avoid crashes
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (sessionStorage.getItem("studentRefreshFailed")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      console.log("Attempting to refresh token");

      try {
        let refreshData = {};
        if (isDev) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            refreshData.refreshToken = refreshToken;
          }
        }
        const response = await api.post("/auth/student/refresh", refreshData);
        if (response.data.success && response.data.accessToken) {
          const { accessToken } = response.data;
          localStorage.setItem("studentAccessToken", accessToken);
          sessionStorage.removeItem("studentRefreshFailed");
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;
          processQueue(null, accessToken);
          return api(originalRequest);
        } else {
          // refresh didn't return token
          throw new Error("Refresh failed - no token returned");
        }
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        localStorage.removeItem("studentAccessToken");
        sessionStorage.setItem("studentRefreshFailed", "true");
        return Promise.reject(err);
      }
    }

    // If user is blocked, clear token
    if (error.response?.data?.isBlocked) {
      localStorage.removeItem("studentAccessToken");
    }

    return Promise.reject(error);
  }
);

export default api;
