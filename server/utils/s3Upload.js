import fs from "fs";
import path from "path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client.js";

// Upload a single file to S3
export const uploadVideoToS3 = async (filePath, s3Key) => {
    const stream = fs.createReadStream(filePath);

    let contentType = "video/mp4";
    if (filePath.endsWith(".m3u8")) contentType = "application/x-mpegURL";
    else if (filePath.endsWith(".ts")) contentType = "video/MP2T";

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Body: stream,
        ContentType: contentType,
    };

    await s3.send(new PutObjectCommand(params));
};

// Upload an entire folder (used for HLS chunks)
export const uploadFolderToS3 = async (folderPath, baseS3Key) => {
    const files = fs.readdirSync(folderPath);
    
    const uploadPromises = files.map(file => {
        const filePath = path.join(folderPath, file);
        const s3Key = `${baseS3Key}/${file}`; // Example: courses/123/chapters/456/segment_000.ts
        return uploadVideoToS3(filePath, s3Key);
    });

    await Promise.all(uploadPromises);
};
