import { Chapter } from "../../models/Chapter.js";
import { Lesson } from "../../models/Lesson.js";
import { Course } from "../../models/Course.js";

// Verify course ownership
export const verifyCourseOwnership = async (courseId, instructorId) => {

    const course = await Course.findOne({ _id: courseId });

    const courseWithInstructor = await Course.findOne({
        _id: courseId,
        instructor: instructorId,
    });

    if (!courseWithInstructor) {
        const error = new Error("Course not found or you don't have permission");
        error.statusCode = 404;
        throw error;
    }

    return courseWithInstructor;
};

// Get chapters
export const getChaptersService = async (courseId) => {
    return await Chapter.find({ course: courseId }).sort({ order: 1 });
};

// Create chapter
export const createChapterService = async (courseId, chapterData) => {
    let order = chapterData.order;

    if (order === undefined) {
        const lastChapter = await Chapter.findOne({ course: courseId }).sort({ order: -1 });
        order = lastChapter ? lastChapter.order + 1 : 0;
    }

    return await Chapter.create({
        course: courseId,
        title: chapterData.title,
        description: chapterData.description,
        order,
    });
};

// Update chapter
export const updateChapterService = async (chapterId, courseId, updateData) => {
    const chapter = await Chapter.findOneAndUpdate(
        { _id: chapterId, course: courseId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!chapter) {
        const error = new Error("Chapter not found");
        error.statusCode = 404;
        throw error;
    }

    return chapter;
};

// Delete chapter
export const deleteChapterService = async (chapterId, courseId) => {
    const chapter = await Chapter.findOneAndDelete({
        _id: chapterId,
        course: courseId,
    });

    if (!chapter) {
        const error = new Error("Chapter not found");
        error.statusCode = 404;
        throw error;
    }

    await Lesson.deleteMany({ chapter: chapterId });

    return chapter;
};
