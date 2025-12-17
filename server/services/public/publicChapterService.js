import { Chapter } from "../../models/Chapter.js";

// GET PUBLIC COURSE CHAPTERS
export const getPublicCourseChaptersService = async (courseId) => {
    const chapters = await Chapter.find({
        course: courseId,
        deleted: { $ne: true },
    })
        .sort({ order: 1 });

    return chapters;
};