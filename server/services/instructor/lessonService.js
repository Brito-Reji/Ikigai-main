import { Lesson } from "../../models/Lesson.js";
import { Chapter } from "../../models/Chapter.js";
import { Course } from "../../models/Course.js";

/**
 * If the course was already admin-approved, changing curriculum/video means it is no longer
 * in that verified state — but we do NOT auto-submit to the admin queue ("inprocess").
 * The instructor must click "Apply for verification" again when ready.
 */
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
    const error = new Error("Lesson not found");
    error.statusCode = 404;
    throw error;
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
    const error = new Error("Lesson not found");
    error.statusCode = 404;
    throw error;
  }

  return lesson;
};
