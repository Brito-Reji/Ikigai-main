import { Lesson } from "../../models/Lesson.js";

// GET PUBLIC LESSONS
export const getPublicLessonsService = async (chapterId) => {
    return await Lesson.find({ chapter: chapterId }).sort({ order: 1 });
};