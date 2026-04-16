import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { generateHlsSignedParams } from "../../utils/cloudfrontSignedUrl.js";

export const getSecureStreamUrl = asyncHandler(async (req, res) => {
    const { videoPath } = req.query;

    if (!videoPath) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Video path is required",
            data: {},
        });
    }

    const s3Key = videoPath.startsWith("/") ? videoPath.substring(1) : videoPath;

    if (!s3Key.endsWith(".m3u8")) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            success: false,
            message: "Only HLS (.m3u8) videos are supported",
            data: {},
        });
    }

    const basePath = s3Key.substring(0, s3Key.lastIndexOf("/"));
    const { url, signingParams } = generateHlsSignedParams(basePath, s3Key, 3600);

    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "HLS access granted",
        data: { url, signingParams },
    });
});
