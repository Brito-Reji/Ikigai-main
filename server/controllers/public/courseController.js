import asyncHandler from "express-async-handler";
import {
  getPublishedCoursesService,
  getFeaturedCoursesService,
  getPublicCourseDetailsService,
  getCourseStatsService,
  getPublicCourseLessonsService,
} from "../../services/public/publicCourseService.js";
import { getPublicCourseChaptersService } from "../../services/public/publicChapterService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// GET ALL PUBLISHED COURSES
export const getPublishedCourses = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await getPublishedCoursesService(req.query, userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "PUBLISHED COURSES FETCHED SUCCESSFULLY",
    data: result.courses,
    pagination: result.pagination,
  });
});

// GET FEATURED COURSES
export const getFeaturedCourses = asyncHandler(async (req, res) => {
  const { limit = 4 } = req.query;

  const courses = await getFeaturedCoursesService(limit);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "FEATURED COURSES FETCHED SUCCESSFULLY",
    data: courses,
    count: courses.length,
  });
});

// GET PUBLIC COURSE DETAILS
export const getPublicCourseDetails = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { courseId } = req.params;

  const course = await getPublicCourseDetailsService(courseId, userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "COURSE DETAILS FETCHED SUCCESSFULLY",
    data: course,
  });
});

// GET COURSE STATISTICS FOR LANDING PAGE
export const getCourseStats = asyncHandler(async (req, res) => {
  const stats = await getCourseStatsService();

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "COURSE STATISTICS FETCHED SUCCESSFULLY",
    data: stats,
  });
});

// get chapters
export const getPublicCourseChapters = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { courseId } = req.params;

  const chapters = await getPublicCourseChaptersService(courseId, userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "CHAPTERS FETCHED SUCCESSFULLY",
    data: chapters,
    count: chapters.length,
  });
});

// get lessons
export const getPublicCourseLessons = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { chapterId } = req.params;

  const lessons = await getPublicCourseLessonsService(chapterId, userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "LESSONS FETCHED SUCCESSFULLY",
    data: lessons,
    count: lessons.length,
  });
});

// get public reviews for a course
export const getPublicCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const { Review } = await import("../../models/Review.js");

  const reviews = await Review.find({ course: courseId })
    .populate({ path: "user", select: "firstName lastName avatar username" })
    .sort({ createdAt: -1 })
    .lean();

  // compute stats
  const totalReviews = reviews.length;
  let averageRating = 0;
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  if (totalReviews > 0) {
    let sum = 0;
    reviews.forEach(r => {
      sum += r.rating;
      distribution[r.rating]++;
    });
    averageRating = parseFloat((sum / totalReviews).toFixed(1));
  }

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: distribution[stars],
    percentage:
      totalReviews > 0
        ? Math.round((distribution[stars] / totalReviews) * 100)
        : 0,
  }));

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: {
      reviews,
      averageRating,
      totalReviews,
      ratingDistribution,
    },
  });
});
