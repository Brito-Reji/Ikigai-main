import { uploadVideoToS3 } from "../../utils/s3Upload.js";
import { generateSignedUrl } from "../../utils/cloudfrontSignedUrl.js";
import fs from "fs";

// Upload video
export const uploadVideoService = async (file, courseId, chapterId) => {
    const timestamp = Date.now();
    const s3Key = `courses/${courseId}/chapters/${chapterId}/${timestamp}-${file.originalname}`;

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
