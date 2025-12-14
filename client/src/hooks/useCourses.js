import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { courseApi } from '@/api/courseApi'

// Instructor hooks
export const useInstructorCourses = () => {
    return useQuery({
        queryKey: ['instructor-courses'],
        queryFn: courseApi.instructor.getCourses,
    })
}

export const useInstructorCourse = (courseId) => {
    return useQuery({
        queryKey: ['instructor-course', courseId],
        queryFn: () => courseApi.instructor.getCourseById(courseId),
        enabled: !!courseId,
    })
}

export const useCreateCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.instructor.createCourse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
        },
    })
}

export const useUpdateCourse = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.instructor.updateCourse,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
            queryClient.invalidateQueries({ queryKey: ['instructor-course', variables.courseId] })
        },
    })
}

export const useApplyVerification = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.instructor.applyForVerification,
        onSuccess: (data, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-course', courseId] })
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
        },
    })
}

export const useTogglePublish = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: courseApi.instructor.togglePublish,
        onSuccess: (data, courseId) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-course', courseId] })
            queryClient.invalidateQueries({ queryKey: ['instructor-courses'] })
        },
    })
}

// Student hooks
export const useStudentCourses = (params) => {
    return useQuery({
        queryKey: ['student-courses', params],
        queryFn: () => courseApi.student.getCourses(params),
    })
}

export const useStudentCourse = (courseId) => {
    return useQuery({
        queryKey: ['student-course', courseId],
        queryFn: () => courseApi.student.getCourseById(courseId),
        enabled: !!courseId,
    })
}

// Public hooks
export const usePublicCourses = (params) => {
    return useQuery({
        queryKey: ['public-courses', params],
        queryFn: () => courseApi.public.getCourses(params),
    })
}

export const useFeaturedCourses = (params) => {
    return useQuery({
        queryKey: ['featured-courses', params],
        queryFn: () => courseApi.public.getFeaturedCourses(params),
    })
}

export const usePublicCourse = (courseId) => {
    return useQuery({
        queryKey: ['public-course', courseId],
        queryFn: () => courseApi.public.getCourseDetails(courseId),
        enabled: !!courseId,
    })
}
