import asyncHandler from "express-async-handler";
import { Course } from "../../models/Course.js";
import { Chapter } from "../../models/Chapter.js";

// CHECK IF COURSE BELONGS TO INSTRUCTOR
export const verifyCourseOwnership = asyncHandler(async (courseId, instructorId) => {
    const course = await Course.findOne({ _id: courseId, instructor: instructorId });
    if (!course) {
        throw new Error("Course not found or you don't have permission");
    }
    return course;
});

// GET ALL CHAPTERS
export const getCourseChaptersService = asyncHandler(async (courseId) => {
    const chapters = await Chapter.find({ course: courseId }).sort({ order: 1 });
    return chapters;
});

// CREATE CHAPTER
export const createChapterService = asyncHandler(async (courseId, { title, description, order }) => {
    let chapterOrder = order;

    if (chapterOrder === undefined) {
        const last = await Chapter.findOne({ course: courseId }).sort({ order: -1 });
        chapterOrder = last ? last.order + 1 : 0;
    }

    const chapter = await Chapter.create({
        course: courseId,
        title,
        description,
        order: chapterOrder,
        lessons: [],
    });

    return chapter;
});

// UPDATE CHAPTER
export const updateChapterService = asyncHandler(async (courseId, chapterId, updateData) => {
    const chapter = await Chapter.findOneAndUpdate(
        { _id: chapterId, course: courseId },
        updateData,
        { new: true, runValidators: true }
    );

    if (!chapter) {
        throw new Error("Chapter not found");
    }

    return chapter;
});

// DELETE CHAPTER
export const deleteChapterService = asyncHandler(async (courseId, chapterId) => {
    const chapter = await Chapter.findOneAndDelete({ _id: chapterId, course: courseId });
    if (!chapter) {
        throw new Error("Chapter not found");
    }
    return chapter;
});

// ADD LESSON
export const addLessonService = asyncHandler(async (courseId, chapterId, lessonData) => {
    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    let order = lessonData.order;
    if (order === undefined) {
        order = chapter.lessons.length;
    }

    const lesson = {
        title: lessonData.title,
        description: lessonData.description,
        videoUrl: lessonData.videoUrl,
        duration: lessonData.duration || 0,
        order,
        isFree: lessonData.isFree || false,
        resources: lessonData.resources || [],
    };

    chapter.lessons.push(lesson);
    await chapter.save();

    return chapter;
});

// UPDATE LESSON
export const updateLessonService = asyncHandler(async (courseId, chapterId, lessonId, newData) => {
    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    const lesson = chapter.lessons.id(lessonId);
    if (!lesson) {
        throw new Error("Lesson not found");
    }

    Object.keys(newData).forEach((field) => {
        if (newData[field] !== undefined) lesson[field] = newData[field];
    });

    await chapter.save();
    return chapter;
});

// DELETE LESSON
export const deleteLessonService = asyncHandler(async (courseId, chapterId, lessonId) => {
    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    chapter.lessons.pull(lessonId);
    await chapter.save();

    return chapter;
});
