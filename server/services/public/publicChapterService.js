import { Chapter } from "../../models/Chapter.js";
import { Lesson } from "../../models/Lesson.js";

// GET PUBLIC COURSE CHAPTERS
export const getPublicCourseChaptersService = async (courseId) => {
    const chapters = await Chapter.find({
        course: courseId,
        deleted: { $ne: true },
    })
        .sort({ order: 1 });

    const chapterIds = chapters.map(ch => ch._id);
    
    const lessons = await Lesson.find({
        chapter: { $in: chapterIds }
    }).sort({ order: 1 });

    const lessonsByChapter = lessons.reduce((acc, lesson) => {
        const chapterId = lesson.chapter.toString();
        if (!acc[chapterId]) {
            acc[chapterId] = [];
        }
        acc[chapterId].push(lesson);
        return acc;
    }, {});

    const chaptersWithLessons = chapters.map(chapter => {
        const chapterObj = chapter.toObject();
        chapterObj.lessons = lessonsByChapter[chapter._id.toString()] || [];
        return chapterObj;
    });

    return chaptersWithLessons;
};