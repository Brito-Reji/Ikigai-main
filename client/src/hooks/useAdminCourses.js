import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axiosConfig.js";

// Admin Course Queries
export const useAdminCourses = (filters = {}) => {
    return useQuery({
        queryKey: ["admin-courses", filters],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.page) params.append("page", filters.page);
            if (filters.limit) params.append("limit", filters.limit);
            if (filters.search) params.append("search", filters.search);
            if (filters.category) params.append("category", filters.category);
            if (filters.status) params.append("status", filters.status);

            const response = await api.get(`/admin/courses?${params.toString()}`);
            return response.data;
        },
        staleTime: 30000, // 30 seconds
    });
};

export const useAdminCourseDetails = (courseId) => {
    return useQuery({
        queryKey: ["admin-course", courseId],
        queryFn: async () => {
            const response = await api.get(`/admin/courses/${courseId}`);
            return response.data;
        },
        enabled: !!courseId,
        staleTime: 30000,
    });
};

export const useAdminCourseStatistics = () => {
    return useQuery({
        queryKey: ["admin-course-statistics"],
        queryFn: async () => {
            const response = await api.get("/admin/courses/statistics");
            return response.data;
        },
        staleTime: 60000, // 1 minute
    });
};

export const useAdminCourseChapters = (courseId) => {
    return useQuery({
        queryKey: ["admin-course-chapters", courseId],
        queryFn: async () => {
            const response = await api.get(`/admin/courses/${courseId}/chapters`);
            return response.data;
        },
        enabled: !!courseId,
        staleTime: 30000,
    });
};

// Admin Course Mutations
export const useToggleCourseBlock = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseId) => {
            const response = await api.patch(`/admin/courses/${courseId}/toggle-block`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            queryClient.invalidateQueries({ queryKey: ["admin-course-statistics"] });
        },
    });
};

export const useDeleteAdminCourse = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (courseId) => {
            const response = await api.delete(`/admin/courses/${courseId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            queryClient.invalidateQueries({ queryKey: ["admin-course-statistics"] });
        },
    });
};

export const useUpdateVerificationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, status, rejectionReason }) => {
            const response = await api.patch(`/admin/courses/${courseId}/verification`, {
                status,
                rejectionReason,
            });
            return response.data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin-courses"] });
            queryClient.invalidateQueries({ queryKey: ["admin-course", variables.courseId] });
            queryClient.invalidateQueries({ queryKey: ["admin-course-statistics"] });
        },
    });
};

export const usePendingVerifications = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ["pending-verifications", page, limit],
        queryFn: async () => {
            const response = await api.get(`/admin/verifications/pending?page=${page}&limit=${limit}`);
            return response.data;
        },
        staleTime: 30000,
    });
};

export const useVerificationStatistics = () => {
    return useQuery({
        queryKey: ["verification-statistics"],
        queryFn: async () => {
            const response = await api.get("/admin/verifications/statistics");
            return response.data;
        },
        staleTime: 60000,
    });
};
