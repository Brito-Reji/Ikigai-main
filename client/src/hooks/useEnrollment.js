import { courseApi } from '@/api/courseApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetEnrolledCourses = () => {
  return useQuery({
    queryKey: ['enrolled-courses'],
    queryFn: () => courseApi.student.getEnrolledCourses(),
  });
};

export const useGetEnrolledCourseById = courseId => {
  return useQuery({
    queryKey: ['enrolled-courses', courseId],
    queryFn: () => courseApi.student.getEnrolledCourseById(courseId),
    enabled: !!courseId,
  });
};

export const useGetLessonById = (courseId, lessonId) => {
  return useQuery({
    queryKey: ['enrolled-courses', 'lesson-id'],
    queryFn: () => courseApi.student.getLessonById(courseId, lessonId),
  });
};

export const useMarkLessonComplete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: courseApi.student.markLessonComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['enrolled-courses', 'lesson-progress'],
      });
    },
  });
};
