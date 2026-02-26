import { useQuery } from "@tanstack/react-query";
import { adminApiService } from "@/api/adminApi.js";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await adminApiService.getDashboard();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useAdminOrders = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: async () => {
      const response = await adminApiService.getOrders(params);
      return {
        orders: response.data.data,
        pagination: response.data.pagination,
      };
    },
  });
};
