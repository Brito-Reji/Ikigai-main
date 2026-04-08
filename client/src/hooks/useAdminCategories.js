import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApiService } from "@/api/adminApi.js";

// Fetch all categories
export const useAdminCategories = (params = {}) => {
  return useQuery({
    queryKey: ["admin", "categories", params],
    queryFn: async () => {
      const response = await adminApiService.getCategories(params);
      return response.data;
    },
  });
};

// Create category
export const useAdminCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async data => {
      return await adminApiService.createCategory(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

// Update category
export const useAdminUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      return await adminApiService.updateCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};

// Toggle block
export const useAdminToggleCategoryBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async id => {
      return await adminApiService.toggleCategoryBlock(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
};
