import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseApi } from '@/api/courseApi'

// Fetch instructor courses
export const useInstructorCourses = () => {
    return useQuery({
        queryKey: ['instructor-courses'],
        queryFn: courseApi.getCourses,
    })
}

// Fetch single course
export const useCourse = (courseId) => {
    return useQuery({
        queryKey: ['courses', courseId],
        queryFn: () => courseApi.getCourseById(courseId),
        enabled: !!courseId,
    })
}

// Create course
export const useCreateCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
        },
    })
}

// Update course
export const useUpdateCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.updateCourse,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
            queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] })
        },
    })
}

// Apply for verification
export const useApplyVerification = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.applyForVerification,
        onSuccess: (data, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
        },
    })
}

// Toggle publish status
export const useTogglePublish = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.togglePublish,
        onSuccess: (data, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['courses', courseId] })
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
        },
    })
}

// Fetch published courses (public)
export const usePublishedCourses = (params) => {
    return useQuery({
        queryKey: ['published-courses', params],
        queryFn: () => courseApi.getPublishedCourses(params),
    })
}

// Fetch featured courses
export const useFeaturedCourses = (params) => {
    return useQuery({
        queryKey: ['featured-courses', params],
        queryFn: () => courseApi.getFeaturedCourses(params),
    })
}

// Fetch public course details
export const usePublicCourse = (courseId) => {
    return useQuery({
        queryKey: ['public-course', courseId],
        queryFn: () => courseApi.getPublicCourseDetails(courseId),
        enabled: !!courseId,
    })
}
