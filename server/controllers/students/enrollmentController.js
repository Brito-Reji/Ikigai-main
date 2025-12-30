import asyncHandler from "express-async-handler"
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { getUserEnrollments, updateProgress, getEnrolledCourseByIdService } from "../../services/student/enrollmentService.js";


export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await getUserEnrollments(req.user._id.toString());
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: enrollments,
  });
});

export const getEnrolledCourseById = asyncHandler(async (req, res) => {
  const enrollment = await getEnrolledCourseByIdService(req.user._id.toString(), req.params.courseId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: enrollment,
  });
});

export const markLessonComplete = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.body;
  
  const enrollment = await updateProgress(req.user._id, courseId, lessonId);
  
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: enrollment,
  });
});