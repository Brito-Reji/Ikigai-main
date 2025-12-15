import { Chapter } from "../../models/Chapter.js";
import { Lesson } from "../../models/Lesson.js";
import { Course } from "../../models/Course.js";

export const getPublicCourseChaptersService = async (courseId) => {
    const course = await Course.findOne({
        _id: courseId,
        isPublished: true,
        isBlocked: false,
    });

    if (!course) {
        const error = new Error("Course not found or not available");
        error.statusCode = 404;
        throw error;
    }

    const chapters = await Chapter.find({ course: courseId })
        .sort({ order: 1 })
        .lean();

    const chaptersWithLessons = await Promise.all(
        chapters.map(async (chapter) => {
            const lessons = await Lesson.find({ chapter: chapter._id })
                .sort({ order: 1 })
                .select('title description duration order isFree resources')
                .lean();

            return {
                ...chapter,
                lessons,
            };
        })
    );

    return chaptersWithLessons;
};
