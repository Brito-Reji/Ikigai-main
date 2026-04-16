import {  uploadFolderToS3 } from "../../utils/s3Upload.js";
import { generateSignedUrl } from "../../utils/cloudfrontSignedUrl.js";
import { convertVideoToHls } from "../../utils/videoTranscoder.js";
import fs from "fs";
import path from "path";

// Upload video
export const uploadVideoService = async (file, courseId, chapterId) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase();

    const baseS3Key = `courses/${courseId}/chapters/${chapterId}/${timestamp}-${cleanName}`;
    const outputDir = path.join("uploads", `${timestamp}-${cleanName}`);

    await convertVideoToHls(file.path, outputDir);
    await uploadFolderToS3(outputDir, baseS3Key);

    fs.unlinkSync(file.path);
    fs.rmSync(outputDir, { recursive: true, force: true });

    const m3u8Key = `${baseS3Key}/playlist.m3u8`;

    return {
        s3Key: m3u8Key,
        videoPath: `/${m3u8Key}`,
    };
};

// Generate signed URL
export const getSignedVideoUrlService = (videoPath) => {
    return generateSignedUrl(videoPath, 3600);
};
