import adminApi from "./adminAxiosConfig.js";

export const adminApiService = {
  getDashboard: () => adminApi.get("/admin/dashboard"),
  getOrders: params => adminApi.get("/admin/orders", { params }),
};
