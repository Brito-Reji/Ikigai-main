import { Review } from "../../models/Review.js";
import { Enrollment } from "../../models/Enrollment.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// add or update a review
export const addOrUpdateReviewService = async (
  userId,
  courseId,
  rating,
  reviewText
) => {
  // check enrollment
  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
    status: "active",
  });
  if (!enrollment) {
    throw new AppError("You must be enrolled in this course to review it",HTTP_STATUS.BAD_REQUEST);
  }

  const review = await Review.findOneAndUpdate(
    { user: userId, course: courseId },
    { rating, reviewText },
    { upsert: true, new: true, runValidators: true }
  );

  return review;
};

// get all reviews for a course
export const getReviewsService = async courseId => {
  const reviews = await Review.find({ course: courseId })
    .populate({ path: "user", select: "firstName lastName avatar username" })
    .sort({ createdAt: -1 })
    .lean();

  return reviews;
};

// get current user's review
export const getUserReviewService = async (userId, courseId) => {
  const review = await Review.findOne({
    user: userId,
    course: courseId,
  }).lean();
  return review;
};
