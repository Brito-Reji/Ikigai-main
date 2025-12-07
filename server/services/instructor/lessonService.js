import { Lesson } from "../../models/Lesson.js";
import { Chapter } from "../../models/Chapter.js";

// Verify chapter exists
const verifyChapter = async (chapterId, courseId) => {
    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });

    if (!chapter) {
        const error = new Error("Chapter not found");
        error.statusCode = 404;
        throw error;
    }

    return chapter;
};

// Get lessons
export const getLessonsService = async (chapterId) => {
    return await Lesson.find({ chapter: chapterId }).sort({ order: 1 });
};

// Create lesson
export const createLessonService = async (chapterId, courseId, lessonData) => {
    await verifyChapter(chapterId, courseId);

    let order = lessonData.order;

    if (order === undefined) {
        const lastLesson = await Lesson.findOne({ chapter: chapterId }).sort({ order: -1 });
        order = lastLesson ? lastLesson.order + 1 : 0;
    }

    return await Lesson.create({
        chapter: chapterId,
        title: lessonData.title,
        description: lessonData.description,
        videoUrl: lessonData.videoUrl,
        duration: lessonData.duration || 0,
        order,
        isFree: lessonData.isFree || false,
        resources: lessonData.resources || [],
    });
};

// Update lesson
export const updateLessonService = async (lessonId, chapterId, courseId, updateData) => {
    await verifyChapter(chapterId, courseId);

    const lesson = await Lesson.findOneAndUpdate(
        { _id: lessonId, chapter: chapterId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!lesson) {
        const error = new Error("Lesson not found");
        error.statusCode = 404;
        throw error;
    }

    return lesson;
};

// Delete lesson
export const deleteLessonService = async (lessonId, chapterId, courseId) => {
    await verifyChapter(chapterId, courseId);

    const lesson = await Lesson.findOneAndDelete({
        _id: lessonId,
        chapter: chapterId,
    });

    if (!lesson) {
        const error = new Error("Lesson not found");
        error.statusCode = 404;
        throw error;
    }

    return lesson;
};
