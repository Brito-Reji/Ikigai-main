import axios from "axios";

const instructorApi = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api",
  withCredentials: true,
});

// attach instructor token
instructorApi.interceptors.request.use(config => {
  let accessToken = localStorage.getItem("instructorAccessToken");

  if (accessToken) {
    try {
      const parsed = JSON.parse(accessToken);
      if (parsed.accessToken) {
        accessToken = parsed.accessToken;
        localStorage.setItem("instructorAccessToken", accessToken);
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

instructorApi.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/instructor/refresh") || originalRequest.url?.includes("/auth/instructor/signin")) {
      isRefreshing = false;
      processQueue(error, null);
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (sessionStorage.getItem("instructorRefreshFailed")) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return instructorApi(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await instructorApi.post("/auth/instructor/refresh");
        if (response.data.success && response.data.accessToken) {
          const { accessToken } = response.data;
          localStorage.setItem("instructorAccessToken", accessToken);
          sessionStorage.removeItem("instructorRefreshFailed");
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          isRefreshing = false;
          processQueue(null, accessToken);
          return instructorApi(originalRequest);
        } else {
          throw new Error("Refresh failed");
        }
      } catch (err) {
        isRefreshing = false;
        processQueue(err, null);
        localStorage.removeItem("instructorAccessToken");
        sessionStorage.setItem("instructorRefreshFailed", "true");
        return Promise.reject(err);
      }
    }

    if (error.response?.data?.isBlocked) {
      localStorage.removeItem("instructorAccessToken");
    }

    return Promise.reject(error);
  }
);

export default instructorApi;
