import asyncHandler from "express-async-handler";
import logger from "../../utils/logger.js";
import { GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../config/s3Client.js";
import { Course } from "../../models/Course.js";
import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Stream video with range request support
export const streamVideo = asyncHandler(async (req, res) => {
    const { courseId, videoPath, token } = req.query;

    logger.info(`[StreamVideo] Request received:`, {
        courseId,
        videoPath,
        hasToken: !!token,
        hasAuthHeader: !!req.headers.authorization,
        hasUser: !!req.user,
        range: req.headers.range,
        fullUrl: req.originalUrl,
        queryParams: req.query
    });

    let instructorId;

    // Try to get instructor ID from multiple sources
    // 1. From middleware (if route is protected)
    if (req.user && req.user.id) {
        instructorId = req.user.id;
        logger.info(`[StreamVideo] Using middleware auth: ${instructorId}`);
    }
    // 2. From query parameter token (for video element src)
    else if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            instructorId = decoded.id;
            logger.info(`[StreamVideo] Using query token: ${instructorId}`);
        } catch (error) {
            logger.warn(`[StreamVideo] Invalid query token: ${error.message}`);
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or expired authentication token",
            });
        }
    }
    // 3. From Authorization header (for HEAD requests)
    else if (req.headers.authorization) {
        try {
            const headerToken = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(headerToken, process.env.JWT_ACCESS_SECRET);
            instructorId = decoded.id;
            logger.info(`[StreamVideo] Using Authorization header: ${instructorId}`);
        } catch (error) {
            logger.warn(`[StreamVideo] Invalid Authorization header: ${error.message}`);
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid or expired authentication token",
            });
        }
    }
    else {
        logger.warn(`[StreamVideo] No authentication provided`);
        return res.status(401).json({
            success: false,
            message: "Authentication required. Please login again.",
        });
    }

    if (!courseId || !videoPath) {
        logger.warn(`[StreamVideo] Missing parameters:`, { courseId, videoPath });
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Course ID and video path are required",
        });
    }

    const course = await Course.findOne({
        _id: courseId,
        instructor: instructorId,
    });

    if (!course) {
        logger.warn(`[StreamVideo] Course not found or unauthorized:`, {
            courseId,
            instructorId
        });
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            success: false,
            message: "Course not found or you don't have permission to access this video",
        });
    }

    logger.info(`[StreamVideo] Course verified: ${course.title}`);

    const s3Key = videoPath.startsWith("/") ? videoPath.substring(1) : videoPath;

    try {
        // Get video metadata first to know the file size
        const headCommand = new HeadObjectCommand({
            Bucket: process.env.S3_BUCKET,
            Key: s3Key,
        });

        const headResponse = await s3.send(headCommand);
        const videoSize = headResponse.ContentLength;

        // Determine content type from file extension if not set
        let contentType = headResponse.ContentType;
        if (!contentType || contentType === "application/octet-stream") {
            const ext = s3Key.split(".").pop().toLowerCase();
            const mimeTypes = {
                "mp4": "video/mp4",
                "webm": "video/webm",
                "ogg": "video/ogg",
                "mov": "video/quicktime",
                "m4v": "video/x-m4v",
            };
            contentType = mimeTypes[ext] || "video/mp4";
            logger.info(`[StreamVideo] Content type not set, using: ${contentType}`);
        }

        logger.info(`[StreamVideo] Video metadata:`, {
            key: s3Key,
            size: videoSize,
            contentType: contentType
        });

        // Handle range requests for seeking
        const range = req.headers.range;

        if (!range) {
            // If no range header, send a small initial chunk to test connectivity
            // This helps browsers determine if the video is streamable
            logger.info(`[StreamVideo] No range header, sending initial chunk`);

            const CHUNK_SIZE = 1024 * 1024; // 1MB initial chunk
            const end = Math.min(CHUNK_SIZE - 1, videoSize - 1);

            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
                Range: `bytes=0-${end}`,
            });

            const s3Response = await s3.send(command);

            // Set video headers
            res.setHeader("Content-Range", `bytes 0-${end}/${videoSize}`);
            res.setHeader("Accept-Ranges", "bytes");
            res.setHeader("Content-Length", end + 1);
            res.setHeader("Content-Type", contentType);
            res.setHeader("Cache-Control", "no-cache");

            res.status(206);
            s3Response.Body.pipe(res);
        } else {
            // Parse range header
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
            const chunkSize = end - start + 1;

            logger.info(`[StreamVideo] Range request:`, {
                start,
                end,
                chunkSize,
                totalSize: videoSize
            });

            // Validate range
            if (start >= videoSize || end >= videoSize) {
                logger.warn(`[StreamVideo] Invalid range:`, { start, end, videoSize });
                res.setHeader("Content-Range", `bytes */${videoSize}`);
                return res.status(416).json({
                    success: false,
                    message: "Requested range not satisfiable",
                });
            }

            // Get the video chunk from S3
            const command = new GetObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: s3Key,
                Range: `bytes=${start}-${end}`,
            });

            const s3Response = await s3.send(command);

            // Set video headers for partial content (CORS handled by middleware)
            res.setHeader("Content-Range", `bytes ${start}-${end}/${videoSize}`);
            res.setHeader("Accept-Ranges", "bytes");
            res.setHeader("Content-Length", chunkSize);
            res.setHeader("Content-Type", contentType);
            res.setHeader("Cache-Control", "no-cache");

            logger.info(`[StreamVideo] Streaming chunk successfully:`, {
                key: s3Key,
                range: `${start}-${end}/${videoSize}`
            });

            // Send 206 Partial Content status
            res.status(206);
            s3Response.Body.pipe(res);
        }
    } catch (error) {
        logger.error(`[StreamVideo] S3 streaming error:`, {
            message: error.message,
            name: error.name,
            key: s3Key,
            bucket: process.env.S3_BUCKET,
            stack: error.stack
        });

        if (error.name === "NoSuchKey") {
            return res.status(HTTP_STATUS.NOT_FOUND).json({
                success: false,
                message: "Video file not found in storage. The file may have been deleted or moved.",
                videoPath: s3Key
            });
        }

        if (error.name === "AccessDenied") {
            return res.status(HTTP_STATUS.FORBIDDEN).json({
                success: false,
                message: "Access denied to video file. Please contact support.",
            });
        }

        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed to stream video. Please try again later.",
            error: process.env.NODE_ENV === "development" ? error.message : undefined,
        });
    }
});

// Handle OPTIONS preflight requests
export const streamVideoOptions = asyncHandler(async (req, res) => {
    // CORS is handled by middleware, just respond to OPTIONS
    res.status(204).send();
});