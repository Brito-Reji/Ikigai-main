import asyncHandler from "express-async-handler";
import {
  getPublishedCoursesService,
  getFeaturedCoursesService,
  getPublicCourseDetailsService,
  getCourseStatsService
} from "../../services/public/publicCourseService.js";

// GET ALL PUBLISHED COURSES
export const getPublishedCourses = asyncHandler(async (req, res) => {
  const result = await getPublishedCoursesService(req.query);

  res.status(200).json({
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

  res.status(200).json({
    success: true,
    message: "FEATURED COURSES FETCHED SUCCESSFULLY",
    data: courses,
    count: courses.length,
  });
});

// GET PUBLIC COURSE DETAILS
export const getPublicCourseDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await getPublicCourseDetailsService(courseId);

  res.status(200).json({
    success: true,
    message: "COURSE DETAILS FETCHED SUCCESSFULLY",
    data: course,
  });
});

// GET COURSE STATISTICS FOR LANDING PAGE
export const getCourseStats = asyncHandler(async (req, res) => {
  const stats = await getCourseStatsService();

  res.status(200).json({
    success: true,
    message: "COURSE STATISTICS FETCHED SUCCESSFULLY",
    data: stats,
  });
});
