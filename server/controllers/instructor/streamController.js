import asyncHandler from "express-async-handler";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3Client.js";
import { Course } from "../../models/Course.js";
import jwt from "jsonwebtoken";

// Stream video
export const streamVideo = asyncHandler(async (req, res) => {
    const { courseId, videoPath, token } = req.query;

    let instructorId;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            instructorId = decoded.id;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
    } else if (req.user) {
        instructorId = req.user.id;
    } else {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
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

    const s3Key = videoPath.startsWith('/') ? videoPath.substring(1) : videoPath;

    try {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: s3Key,
        });

        const s3Response = await s3.send(command);

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Length', s3Response.ContentLength);
        res.setHeader('Accept-Ranges', 'bytes');

        s3Response.Body.pipe(res);
    } catch (error) {
        console.error('Error streaming video:', error);
        res.status(500).json({
            success: false,
            message: "Failed to stream video",
        });
    }
});
