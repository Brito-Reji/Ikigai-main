import asyncHandler from "express-async-handler";
import {
  getAllCoursesService,
  getCourseDetailsService,
  toggleCourseBlockService,
  deleteCourseService,
  getCourseStatisticsService,
  updateVerificationStatusService,
  getPendingVerificationsService,
  getVerificationStatisticsService,
  getAdminCourseChaptersService,
} from "../../services/admin/courseService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Get all courses
export const getAllCourses = asyncHandler(async (req, res) => {
  const result = await getAllCoursesService(req.query);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Courses fetched successfully",
    data: result.courses,
    pagination: result.pagination,
  });
});

// Get course details
export const getCourseDetails = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const course = await getCourseDetailsService(courseId);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Course details fetched successfully",
    data: course,
  });
});

// Toggle course block
export const toggleCourseBlock = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { reason } = req.body;
  const result = await toggleCourseBlockService(courseId, reason);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Course ${result.action} successfully`,
    data: result.course,
  });
});

// Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  console.log("reqqes", req);
  const { reason } = req.body;
  await deleteCourseService(courseId, reason);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Course deleted successfully",
  });
});

// Get course statistics
export const getCourseStatistics = asyncHandler(async (req, res) => {
  const statistics = await getCourseStatisticsService();

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Course statistics fetched successfully",
    data: statistics,
  });
});

// Update verification status
export const updateVerificationStatus = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { status, rejectionReason } = req.body;

  const updatedCourse = await updateVerificationStatusService(
    courseId,
    status,
    rejectionReason
  );

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Course ${status === "verified" ? "verified" : "rejected"} successfully`,
    data: updatedCourse,
  });
});

// Get pending verifications
export const getPendingVerifications = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await getPendingVerificationsService(page, limit);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Pending verifications fetched successfully",
    data: result.courses,
    pagination: result.pagination,
  });
});

// Get verification statistics
export const getVerificationStatistics = asyncHandler(async (req, res) => {
  const statistics = await getVerificationStatisticsService();

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Verification statistics fetched successfully",
    data: statistics,
  });
});

// Get course chapters
export const getAdminCourseChapters = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const chapters = await getAdminCourseChaptersService(courseId);

  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Chapters fetched successfully",
    data: chapters,
  });
});
