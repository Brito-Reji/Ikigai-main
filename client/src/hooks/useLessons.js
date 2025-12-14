import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { lessonApi } from '@/api/lessonApi'

// Instructor hooks
export const useInstructorLessons = (courseId, chapterId) => {
    return useQuery({
        queryKey: ['instructor-lessons', courseId, chapterId],
        queryFn: () => lessonApi.instructor.getLessons(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    })
}

export const useCreateLesson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: lessonApi.instructor.createLesson,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-lessons', variables.courseId, variables.chapterId] })
        },
    })
}

export const useUpdateLesson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: lessonApi.instructor.updateLesson,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-lessons', variables.courseId, variables.chapterId] })
        },
    })
}

export const useDeleteLesson = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: lessonApi.instructor.deleteLesson,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-lessons', variables.courseId, variables.chapterId] })
        },
    })
}

export const useUploadVideo = () => {
    return useMutation({
        mutationFn: lessonApi.instructor.uploadVideo,
    })
}

// Student hooks
export const useStudentLessons = (courseId, chapterId) => {
    return useQuery({
        queryKey: ['student-lessons', courseId, chapterId],
        queryFn: () => lessonApi.student.getLessons(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    })
}

export const useStudentLesson = (courseId, chapterId, lessonId) => {
    return useQuery({
        queryKey: ['student-lesson', courseId, chapterId, lessonId],
        queryFn: () => lessonApi.student.getLessonById(courseId, chapterId, lessonId),
        enabled: !!courseId && !!chapterId && !!lessonId,
    })
}
