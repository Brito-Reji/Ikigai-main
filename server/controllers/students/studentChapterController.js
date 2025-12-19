import asyncHandler from "express-async-handler";
import logger from "../../utils/logger.js";
import { getPublicCourseChaptersService } from "../../services/students/studentChapterService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const getPublicCourseChapters = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    logger.info(`Fetching public chapters for course: ${courseId}`);

    const chapters = await getPublicCourseChaptersService(courseId);

    logger.info(`Retrieved ${chapters.length} chapters for course: ${courseId}`);
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Chapters fetched successfully",
        data: chapters,
    });
});

