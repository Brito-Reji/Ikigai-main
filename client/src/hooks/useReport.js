import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axiosConfig";
import toast from "react-hot-toast";

// Submit a course report
export const useSubmitReport = () => {
    return useMutation({
        mutationFn: async (data) => {
            const res = await api.post("/student/reports", data);
            return res.data;
        },
        onSuccess: () => {
            toast.success("Report submitted. Our team will review it.");
        },
        onError: (err) => {
            const msg = err.response?.data?.message || "Failed to submit report";
            toast.error(msg);
        },
    });
};

// Get notifications
export const useGetNotifications = () => {
    return useQuery({
        queryKey: ["notifications"],
        queryFn: async () => {
            const res = await api.get("/student/notifications");
            return res.data;
        },
        refetchInterval: 30000,
    });
};

// Mark one notification as read
export const useMarkNotificationRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id) => {
            const res = await api.patch(`/student/notifications/${id}/read`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });
};

// Mark all read
export const useMarkAllRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const res = await api.patch("/student/notifications/read-all");
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });
};
