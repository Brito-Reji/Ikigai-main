import asyncHandler from "express-async-handler"
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { getUserEnrollments, updateProgress } from "../../services/student/enrollmentService.js";


export const getMyEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await getUserEnrollments("6937b0d342ef919cbacb281c");
  console.log(enrollments);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: enrollments,
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