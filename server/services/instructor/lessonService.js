import { Lesson } from "../../models/Lesson.js";
import { Chapter } from "../../models/Chapter.js";
import { Course } from "../../models/Course.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// verified course reverify by admin when update
const markVerifiedCourseNeedsNewApplication = async (chapterId) => {
  const chapter = await Chapter.findById(chapterId);
  if (!chapter) return;
  const course = await Course.findById(chapter.course);
  if (!course || course.verificationStatus !== "verified") return;
  await Course.findByIdAndUpdate(chapter.course, {
    verificationStatus: "pending",
    published: false,
    rejectionReason: null,
  });
};

// Verify chapter exists
const verifyChapter = async (chapterId, courseId) => {
  const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });

  if (!chapter) {
    throw new AppError("Chapter not found",HTTP_STATUS.NOT_FOUND);
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

  const lesson = await Lesson.create({
    chapter: chapterId,
    title: lessonData.title,
    description: lessonData.description,
    videoUrl: lessonData.videoUrl,
    duration: lessonData.duration || 0,
    order,
    isFree: lessonData.isFree || false,
    resources: lessonData.resources || [],
  });

  // New video after the course was verified — must re-apply manually; do not auto-queue admin review.
  if (lessonData.videoUrl) {
    await markVerifiedCourseNeedsNewApplication(chapterId);
  }

  return lesson;
};

// Update lesson
export const updateLessonService = async (lessonId, chapterId, courseId, updateData) => {
  await verifyChapter(chapterId, courseId);
  const course = await Course.findById(courseId);

  const existing = await Lesson.findOne({ _id: lessonId, chapter: chapterId });

  if (!existing) {
    throw new AppError("Lesson not found",HTTP_STATUS.NOT_FOUND);
  }

  const videoChanged =
    updateData.videoUrl &&
    updateData.videoUrl !== existing.videoUrl;

  const lesson = await Lesson.findOneAndUpdate(
    { _id: lessonId, chapter: chapterId },
    updateData,
    { new: true, runValidators: true }
  );

  if (videoChanged && course?.verificationStatus === "verified") {
    await markVerifiedCourseNeedsNewApplication(chapterId);
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
    throw new AppError("Lesson not found",HTTP_STATUS.NOT_FOUND);
  }

  return lesson;
};
