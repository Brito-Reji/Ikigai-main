import fs from "fs";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client.js";

export const uploadVideoToS3 = async (filePath, s3Key) => {
    const stream = fs.createReadStream(filePath);

    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Body: stream,
        ContentType: "video/mp4",
    };

    await s3.send(new PutObjectCommand(params));
};
