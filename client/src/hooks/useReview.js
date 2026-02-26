import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/api/reviewApi";

// submit or update a review
export const useAddReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reviewApi.submitReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["course-reviews", variables.courseId],
      });
      queryClient.invalidateQueries({
        queryKey: ["my-review", variables.courseId],
      });
    },
  });
};

// get all reviews for a course
export const useCourseReviews = courseId => {
  return useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: () => reviewApi.getCourseReviews(courseId),
    enabled: !!courseId,
  });
};

// get current user's review for a course
export const useMyReview = courseId => {
  return useQuery({
    queryKey: ["my-review", courseId],
    queryFn: () => reviewApi.getMyReview(courseId),
    enabled: !!courseId,
  });
};
