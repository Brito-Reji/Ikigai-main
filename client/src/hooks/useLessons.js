import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axiosConfig';

// Get lessons
export const useLessons = (courseId, chapterId) => {
    return useQuery({
        queryKey: ['lessons', courseId, chapterId],
        queryFn: async () => {
            const { data } = await api.get(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons`);
            return data;
        },
        enabled: !!courseId && !!chapterId,
    });
};

// Create lesson
export const useCreateLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, chapterId, lessonData }) => {
            const { data } = await api.post(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons`, lessonData);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', variables.courseId, variables.chapterId] });
        },
    });
};

// Update lesson
export const useUpdateLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, chapterId, lessonId, lessonData }) => {
            const { data } = await api.put(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, lessonData);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', variables.courseId, variables.chapterId] });
        },
    });
};

// Delete lesson
export const useDeleteLesson = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, chapterId, lessonId }) => {
            const { data } = await api.delete(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['lessons', variables.courseId, variables.chapterId] });
        },
    });
};

// Upload video
export const useUploadVideo = () => {
    return useMutation({
        mutationFn: async ({ file, courseId, chapterId }) => {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('courseId', courseId);
            formData.append('chapterId', chapterId);

            const { data } = await api.post('/instructor/upload-video', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        },
    });
};
