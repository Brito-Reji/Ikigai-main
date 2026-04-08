import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApiService } from "@/api/adminApi.js";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await adminApiService.getDashboard();
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5,
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

export const useAdminGetInstrucors = () => {
  return useQuery({
    queryKey: ["admin", "instructors"],
    queryFn: async () => {
      const response = await adminApiService.getInstructors();
      return response;
    },
  });
};

export const useAdminGetInstructorById = id => {
  return useQuery({
    queryKey: ["admin", "instructors", id],
    queryFn: async () => {
      const response = await adminApiService.getInstructorById(id);
      return response;
    },
    enabled: !!id,
  });
};

export const useToggleBlockInstructor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async id => {
      return await adminApiService.toggleInstructorBlock(id);
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "instructors"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "instructors", id] });
    },
  });
};

// Students
export const useAdminGetStudents = () => {
  return useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () => {
      const response = await adminApiService.getStudents();
      return response;
    },
  });
};

export const useAdminGetStudentById = id => {
  return useQuery({
    queryKey: ["admin", "students", id],
    queryFn: async () => {
      const response = await adminApiService.getStudentById(id);
      return response;
    },
    enabled: !!id,
  });
};

// Toggle block student
export const useToggleBlockStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async id => {
      return await adminApiService.toggleStudentBlock(id);
    },
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "students", id] });
    },
  });
};