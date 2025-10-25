import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials:true
})


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/refresh"); // server sets new access token in cookie
        return api(originalRequest); // retry the original request
      } catch (err) {
        console.log("Refresh failed, user must login again");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;