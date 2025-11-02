import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if error.response exists to avoid crashes
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         await api.get("/auth/refresh"); // server sets new access token in cookie
//         return api(originalRequest); // retry the original request
//       } catch (err) {
//         console.log("Refresh failed, user must login again");
//         // Optional: redirect to login or dispatch logout action
//         // window.location.href = '/login';
//         return Promise.reject(err);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
