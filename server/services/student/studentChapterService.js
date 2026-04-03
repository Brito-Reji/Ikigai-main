import { Chapter } from "../../models/Chapter.js";
import { Lesson } from "../../models/Lesson.js";
import { Course } from "../../models/Course.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const getPublicCourseChaptersService = async courseId => {
  const course = await Course.findOne({
    _id: courseId,
    isPublished: true,
    isBlocked: false,
  });

  if (!course) {
    throw new AppError("Course not found or not available",HTTP_STATUS.NOT_FOUND);
  }

  const chapters = await Chapter.find({ course: courseId })
    .sort({ order: 1 })
    .lean();

  const chaptersWithLessons = await Promise.all(
    chapters.map(async chapter => {
      const lessons = await Lesson.find({ chapter: chapter._id })
        .sort({ order: 1 })
        .select("title description duration order isFree resources videoUrl")
        .lean();

      // only expose videoUrl for free lessons
      const sanitizedLessons = lessons.map(lesson => {
        if (!lesson.isFree) {
          // eslint-disable-next-line no-unused-vars
          const { videoUrl, ...rest } = lesson;
          return rest;
        }
        return lesson;
      });

      return {
        ...chapter,
        lessons: sanitizedLessons,
      };
    })
  );

  return chaptersWithLessons;
};
