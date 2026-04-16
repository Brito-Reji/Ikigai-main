import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/s3Client.js";
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

  try {
    // HLS — generate signed URL + params for the whole directory
    if (s3Key.endsWith(".m3u8")) {
      const basePath = s3Key.substring(0, s3Key.lastIndexOf("/"));
      const { url, signingParams } = generateHlsSignedParams(basePath, s3Key, 3600);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "HLS access granted",
        data: { url, signingParams },
      });
    }

    // MP4 fallback — S3 presigned URL
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Secure video access granted",
      data: { url: signedUrl },
    });
  } catch (error) {
    console.error("Stream error:", {
      name: error.name,
      message: error.message,
      code: error.code,
      key: s3Key,
    });

    let userMessage = "Failed to generate access link";
    if (error.name === "NoSuchKey" || error.code === "NoSuchKey") {
      userMessage = "Video file not found in storage";
    } else if (error.code === "ENOTFOUND" || error.message?.includes("getaddrinfo")) {
      userMessage = "Cannot connect to cloud storage.";
    } else if (error.name === "CredentialsError" || error.message?.includes("credentials")) {
      userMessage = "Invalid AWS credentials";
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: userMessage,
      data: { error: error.message, code: error.code },
    });
  }
});

