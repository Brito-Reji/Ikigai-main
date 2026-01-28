import api from "./axiosConfig.js";

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getOrders: params => api.get("/admin/orders", { params }),
};
