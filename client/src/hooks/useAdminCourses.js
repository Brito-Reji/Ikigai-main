import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseApi } from '@/api/courseApi'

// Admin queries
export const useAdminCourses = (filters = {}) => {
    return useQuery({
        queryKey: ['admin-courses', filters],
        queryFn: () => courseApi.admin.getCourses(filters),
        staleTime: 30000,
    })
}

export const useAdminCourseDetails = (courseId) => {
    return useQuery({
        queryKey: ['admin-course', courseId],
        queryFn: () => courseApi.admin.getCourseById(courseId),
        enabled: !!courseId,
        staleTime: 30000,
    })
}

export const useAdminCourseStatistics = () => {
    return useQuery({
        queryKey: ['admin-course-statistics'],
        queryFn: courseApi.admin.getStatistics,
        staleTime: 60000,
    })
}

export const useAdminCourseChapters = (courseId) => {
    return useQuery({
        queryKey: ['admin-course-chapters', courseId],
        queryFn: () => courseApi.admin.getChapters(courseId),
        enabled: !!courseId,
        staleTime: 30000,
    })
}

export const usePendingVerifications = (page = 1, limit = 20) => {
    return useQuery({
        queryKey: ['pending-verifications', page, limit],
        queryFn: () => courseApi.admin.getPendingVerifications(page, limit),
        staleTime: 30000,
    })
}

export const useVerificationStatistics = () => {
    return useQuery({
        queryKey: ['verification-statistics'],
        queryFn: courseApi.admin.getVerificationStatistics,
        staleTime: 60000,
    })
}

// Admin mutations
export const useToggleCourseBlock = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.admin.toggleBlock,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
            queryClient.invalidateQueries({ queryKey: ['admin-course-statistics'] })
        },
    })
}

export const useDeleteAdminCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.admin.deleteCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
            queryClient.invalidateQueries({ queryKey: ['admin-course-statistics'] })
        },
    })
}

export const useUpdateVerificationStatus = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.admin.updateVerification,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-courses'] })
            queryClient.invalidateQueries({ queryKey: ['admin-course', variables.courseId] })
            queryClient.invalidateQueries({ queryKey: ['admin-course-statistics'] })
        },
    })
}
