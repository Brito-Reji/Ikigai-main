import asyncHandler from "express-async-handler";
import { uploadVideoService, getSignedVideoUrlService } from "../../services/instructor/videoService.js";
import { Course } from "../../models/Course.js";

// Upload video
export const uploadVideo = asyncHandler(async (req, res) => {
    const { courseId, chapterId } = req.body;
    const instructorId = req.user.id;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "No video file provided",
        });
    }

    const course = await Course.findOne({
        _id: courseId,
        instructor: instructorId,
    });

    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found or you don't have permission",
        });
    }

    const result = await uploadVideoService(req.file, courseId, chapterId);

    res.status(200).json({
        success: true,
        message: "Video uploaded successfully",
        data: result,
    });
});

// Get signed video URL
export const getVideoUrl = asyncHandler(async (req, res) => {
    const { videoPath } = req.query;

    if (!videoPath) {
        return res.status(400).json({
            success: false,
            message: "Video path is required",
        });
    }

    const signedUrl = getSignedVideoUrlService(videoPath);

    res.status(200).json({
        success: true,
        message: "Signed URL generated",
        data: { url: signedUrl },
    });
});
