import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { chapterApi } from '@/api/chapterApi'

// Instructor hooks
export const useInstructorChapters = (courseId) => {
    return useQuery({
        queryKey: ['instructor-chapters', courseId],
        queryFn: () => chapterApi.instructor.getChapters(courseId),
        enabled: !!courseId,
    })
}

export const useCreateChapter = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: chapterApi.instructor.createChapter,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-chapters', variables.courseId] })
        },
    })
}

export const useUpdateChapter = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: chapterApi.instructor.updateChapter,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-chapters', variables.courseId] })
        },
    })
}

export const useDeleteChapter = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: chapterApi.instructor.deleteChapter,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['instructor-chapters', variables.courseId] })
        },
    })
}

// Student hooks
export const useStudentChapters = (courseId) => {
    return useQuery({
        queryKey: ['student-chapters', courseId],
        queryFn: () => chapterApi.student.getChapters(courseId),
        enabled: !!courseId,
    })
}

export const useStudentChapter = (courseId, chapterId) => {
    return useQuery({
        queryKey: ['student-chapter', courseId, chapterId],
        queryFn: () => chapterApi.student.getChapterById(courseId, chapterId),
        enabled: !!courseId && !!chapterId,
    })
}
