import asyncHandler from "express-async-handler";
import {
  addOrUpdateReviewService,
  getReviewsService,
  getUserReviewService,
} from "../../services/student/reviewService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { MESSAGES } from "../../utils/messages.js";

// submit or update a review
export const addOrUpdateReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId, rating, reviewText } = req.body;

  if (!courseId || !rating) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error(MESSAGES.ERROR.FIELDS_REQUIRED);
  }

  const review = await addOrUpdateReviewService(
    userId,
    courseId,
    rating,
    reviewText
  );

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.REVIEW.SUBMITTED,
    data: review,
  });
});

// get all reviews for a course
export const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const reviews = await getReviewsService(courseId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.REVIEW.FETCHED,
    data: reviews,
  });
});

// get current user's review for a course
export const getUserReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  const review = await getUserReviewService(userId, courseId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: review,
  });
});
