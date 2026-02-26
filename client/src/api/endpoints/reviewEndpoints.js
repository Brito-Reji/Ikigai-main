export const reviewEndpoints = {
  submit: () => "/student/reviews",
  courseReviews: courseId => `/student/reviews/course/${courseId}`,
  myReview: courseId => `/student/reviews/my/${courseId}`,
};
