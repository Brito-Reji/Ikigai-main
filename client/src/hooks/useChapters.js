import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/axiosConfig';

// Get chapters
export const useChapters = (courseId) => {
    return useQuery({
        queryKey: ['chapters', courseId],
        queryFn: async () => {
            const { data } = await api.get(`/instructor/courses/${courseId}/chapters`);
            return data;
        },
        enabled: !!courseId,
    });
};

// Create chapter
export const useCreateChapter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, chapterData }) => {
            const { data } = await api.post(`/instructor/courses/${courseId}/chapters`, chapterData);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chapters', variables.courseId] });
        },
    });
};

// Update chapter
export const useUpdateChapter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, chapterId, chapterData }) => {
            const { data } = await api.put(`/instructor/courses/${courseId}/chapters/${chapterId}`, chapterData);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chapters', variables.courseId] });
        },
    });
};

// Delete chapter
export const useDeleteChapter = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ courseId, chapterId }) => {
            const { data } = await api.delete(`/instructor/courses/${courseId}/chapters/${chapterId}`);
            return data;
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['chapters', variables.courseId] });
        },
    });
};
