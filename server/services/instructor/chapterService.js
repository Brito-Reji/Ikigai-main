import { Chapter } from "../../models/Chapter.js";
import { Lesson } from "../../models/Lesson.js";
import { Course } from "../../models/Course.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { AppError } from "../../errors/AppError.js";

// Verify course ownership
export const verifyCourseOwnership = async (courseId, instructorId) => {


    const courseWithInstructor = await Course.findOne({
        _id: courseId,
        instructor: instructorId,
    });

    if (!courseWithInstructor) {
        throw new AppError("Course not found or you don't have permission",HTTP_STATUS.NOT_FOUND)
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
        throw new AppError("Chapter not found",HTTP_STATUS.NOT_FOUND)
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
        throw new AppError("Chapter not found",HTTP_STATUS.NOT_FOUND)
    }

    await Lesson.deleteMany({ chapter: chapterId });

    return chapter;
};
