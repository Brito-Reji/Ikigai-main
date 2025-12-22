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
  const userId = req.user.id;

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
