import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/s3Client.js";
import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const getSecureStreamUrl = asyncHandler(async (req, res) => {
  const { videoPath } = req.query;

  if (!videoPath) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: "Video path is required",
      data: {},
    });
  }

  // Clean the path to use as an S3 Key
  const s3Key = videoPath.startsWith("/") ? videoPath.substring(1) : videoPath;

  // Log S3 config for debugging
  console.log("S3 Configuration:", {
    bucket: process.env.S3_BUCKET,
    region: process.env.AWS_REGION,
    key: s3Key,
    hasAccessKey: !!process.env.AWS_ACCESS_KEY,
    hasSecretKey: !!process.env.AWS_SECRET_KEY,
  });

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    });

    // Create a URL that expires in 1 hour (enough for long videos)
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

    console.log("✅ Signed URL generated successfully");

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: "Secure video access granted",
      data: { url: signedUrl },
    });
  } catch (error) {
    console.error("❌ S3 Error Details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      statusCode: error.$metadata?.httpStatusCode,
      bucket: process.env.S3_BUCKET,
      key: s3Key,
    });

    // Specific error messages
    let userMessage = "Failed to generate access link";
    if (error.name === "NoSuchKey" || error.code === "NoSuchKey") {
      userMessage = "Video file not found in storage";
    } else if (
      error.code === "ENOTFOUND" ||
      error.message?.includes("getaddrinfo")
    ) {
      userMessage =
        "Cannot connect to cloud storage. Please check AWS configuration.";
    } else if (
      error.name === "CredentialsError" ||
      error.message?.includes("credentials")
    ) {
      userMessage = "Invalid AWS credentials";
    }

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: userMessage,
      data: {
        error: error.message,
        code: error.code,
      },
    });
  }
});
