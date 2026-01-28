import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/adminApi.js";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await adminApi.getDashboard();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminOrders = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const response = await adminApi.getOrders(params);
      return {
        orders: response.data.data,
        pagination: response.data.pagination,
      };
    },
  });
};
