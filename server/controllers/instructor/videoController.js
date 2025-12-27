import asyncHandler from "express-async-handler";
import logger from "../../utils/logger.js";
import {
  uploadVideoService,
  getSignedVideoUrlService,
} from "../../services/instructor/videoService.js";
import { Course } from "../../models/Course.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Upload video
export const uploadVideo = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.body;
  const instructorId = req.user._id;
  logger.info(
    `Video upload initiated for course: ${courseId}, chapter: ${chapterId}`
  );

  if (!req.file) {
    logger.warn(`Video upload failed: No file provided`);
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "No video file provided",
    });
  }

  const course = await Course.findOne({
    _id: courseId,
    instructor: instructorId,
  });

  if (!course) {
    logger.warn(
      `Video upload failed: Course ${courseId} not found or unauthorized`
    );
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: "Course not found or you don't have permission",
    });
  }

  const result = await uploadVideoService(req.file, courseId, chapterId);
  logger.info(`Video uploaded successfully: ${result.s3Key}`);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Video uploaded successfully",
    data: result,
  });
});

// Get signed video URL
export const getVideoUrl = asyncHandler(async (req, res) => {
  const { videoPath } = req.query;

  if (!videoPath) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Video path is required",
    });
  }

  const signedUrl = getSignedVideoUrlService(videoPath);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Signed URL generated",
    data: { url: signedUrl },
  });
});
