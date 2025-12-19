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
  try {
    const result = await getAllCoursesService(req.query);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Courses fetched successfully",
      data: result.courses,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching courses for admin:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching courses",
    });
  }
});

// Get course details
export const getCourseDetails = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await getCourseDetailsService(courseId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Course details fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching course details",
    });
  }
});

// Toggle course block
export const toggleCourseBlock = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await toggleCourseBlockService(courseId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `Course ${result.action} successfully`,
      data: result.course,
    });
  } catch (error) {
    console.error("Error toggling course block status:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error updating course status",
    });
  }
});

// Delete course
export const deleteCourse = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    await deleteCourseService(courseId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error deleting course",
    });
  }
});

// Get course statistics
export const getCourseStatistics = asyncHandler(async (req, res) => {
  try {
    const statistics = await getCourseStatisticsService();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Course statistics fetched successfully",
      data: statistics,
    });
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching statistics",
    });
  }
});

// Update verification status
export const updateVerificationStatus = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    console.error("Error updating verification status:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error updating verification status",
    });
  }
});

// Get pending verifications
export const getPendingVerifications = asyncHandler(async (req, res) => {
  try {
    const { page, limit } = req.query;
    const result = await getPendingVerificationsService(page, limit);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Pending verifications fetched successfully",
      data: result.courses,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching pending verifications",
    });
  }
});

// Get verification statistics
export const getVerificationStatistics = asyncHandler(async (req, res) => {
  try {
    const statistics = await getVerificationStatisticsService();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Verification statistics fetched successfully",
      data: statistics,
    });
  } catch (error) {
    console.error("Error fetching verification statistics:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching verification statistics",
    });
  }
});

// Get course chapters
export const getAdminCourseChapters = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const chapters = await getAdminCourseChaptersService(courseId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Chapters fetched successfully",
      data: chapters,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Error fetching chapters",
    });
  }
});
