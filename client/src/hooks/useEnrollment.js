import { courseApi } from "@/api/courseApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetEnrolledCourses = () => {
    return useQuery({
        queryKey: ['enrolled-courses'],
        queryFn: () => courseApi.student.getEnrolledCourses(),
    })
}


export const useMarkLessonComplete = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: courseApi.student.markLessonComplete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['enrolled-courses', 'lesson-progress'] })
        },
    })
}