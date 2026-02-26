import api from "./axiosConfig";
import { reviewEndpoints } from "./endpoints/reviewEndpoints";

export const reviewApi = {
  // submit or update
  submitReview: async ({ courseId, rating, reviewText }) => {
    const { data } = await api.post(reviewEndpoints.submit(), {
      courseId,
      rating,
      reviewText,
    });
    return data;
  },

  // get all reviews for a course
  getCourseReviews: async courseId => {
    const { data } = await api.get(reviewEndpoints.courseReviews(courseId));
    return data;
  },

  // get current user's review
  getMyReview: async courseId => {
    const { data } = await api.get(reviewEndpoints.myReview(courseId));
    return data;
  },
};
