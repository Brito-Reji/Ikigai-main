import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use(config => {
  let accessToken = localStorage.getItem("accessToken");

  // Handle case where token might be stored as JSON object
  if (accessToken) {
    try {
      // Try to parse as JSON in case it was stored incorrectly
      const parsed = JSON.parse(accessToken);
      if (parsed.accessToken) {
        // If it's an object with accessToken property, extract it
        accessToken = parsed.accessToken;
        // Fix the storage
        localStorage.setItem("accessToken", accessToken);
      }
    } catch (e) {
      // Not JSON, use as is (this is the correct case)
      // console.log(e)
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("Adding token to request:", accessToken);
  } else {
    console.log("No token found in localStorage");
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
    if (originalRequest.url?.includes("/auth/refresh")) {
      console.log("Refresh endpoint failed, not retrying");
      isRefreshing = false;
      processQueue(error, null);
      return Promise.reject(error);
    }

    // Don't try to refresh on login/signup/auth pages - let the actual error show
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
      // Don't retry if we already failed to refresh
      if (sessionStorage.getItem("refreshFailed")) {
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
        const response = await api.post("/auth/refresh");
        if (response.data.success && response.data.accessToken) {
          const { accessToken } = response.data;
          localStorage.setItem("accessToken", accessToken);
          sessionStorage.removeItem("refreshFailed");
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          console.log("Token refreshed successfully");
          isRefreshing = false;
          processQueue(null, accessToken);
          return api(originalRequest);
        } else {
          // refresh didn't return token
          throw new Error("Refresh failed - no token returned");
        }
      } catch (err) {
        console.log("Refresh failed:", err.message);
        isRefreshing = false;
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        sessionStorage.setItem("refreshFailed", "true");
        return Promise.reject(err);
      }
    }

    // If user is blocked, clear token
    if (error.response?.data?.isBlocked) {
      console.log("User is blocked, clearing token");
      localStorage.removeItem("accessToken");
    }

    return Promise.reject(error);
  }
);

export default api;
