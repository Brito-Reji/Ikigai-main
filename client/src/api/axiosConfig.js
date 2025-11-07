import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
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
    }

    config.headers.Authorization = `Bearer ${accessToken}`;
    console.log("Adding token to request:", accessToken);
  } else {
    console.log("No token found in localStorage");
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log("Response error:", error.response?.status, error.config?.url);

    // Check if error.response exists to avoid crashes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log("Attempting to refresh token");

      try {
        const response = await api.post("/auth/refresh");
        const { accessToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        console.log("Token refreshed successfully:", accessToken);
        return api(originalRequest); // retry the original request
      } catch (err) {
        console.log("Refresh failed, user must login again");
        console.log('this was tiggered')
        // localStorage.removeItem("accessToken");
        // Optional: redirect to login or dispatch logout action
        // window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
