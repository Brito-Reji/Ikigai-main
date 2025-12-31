import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../config/s3Client.js";
import asyncHandler from "express-async-handler";

export const getSecureStreamUrl = asyncHandler(async (req, res) => {
  const { videoPath } = req.query;

  if (!videoPath) {
    return res.status(400).json({ 
        success: false, 
        message: "Video path is required", 
        data: {} 
    });
  }

  // Clean the path to use as an S3 Key
  const s3Key = videoPath.startsWith("/") ? videoPath.substring(1) : videoPath;

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
    });

    // Create a URL that expires in 60 seconds
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 5 });

    res.status(200).json({
      success: true,
      message: "Secure video access granted",
      data: { url: signedUrl }
    });
  } catch (error) {
    res.status(500).json({ 
        success: false, 
        message: "Failed to generate access link", 
        data: {error} 
    });
  }
});