import { uploadVideoToS3 } from "../../utils/s3Upload.js";
import { generateSignedUrl } from "../../utils/cloudfrontSignedUrl.js";
import fs from "fs";
import path from "path";

// Upload video
export const uploadVideoService = async (file, courseId, chapterId) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const cleanName = path.basename(file.originalname, ext)
        .replace(/[^a-zA-Z0-9]/g, '-')
        .replace(/-+/g, '-')
        .toLowerCase();

    const s3Key = `courses/${courseId}/chapters/${chapterId}/${timestamp}-${cleanName}${ext}`;

    await uploadVideoToS3(file.path, s3Key);

    fs.unlinkSync(file.path);

    return {
        s3Key,
        videoPath: `/${s3Key}`,
    };
};

// Generate signed URL
export const getSignedVideoUrlService = (videoPath) => {
    return generateSignedUrl(videoPath, 3600);
};
