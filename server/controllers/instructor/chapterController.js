import asyncHandler from "express-async-handler";
import {
  verifyCourseOwnership,
  getChaptersService,
  createChapterService,
  updateChapterService,
  deleteChapterService,
} from "../../services/instructor/chapterService.js";

// Get chapters
export const getCourseChapters = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  await verifyCourseOwnership(courseId, req.user._id);
  const chapters = await getChaptersService(courseId);

  res.status(200).json({
    success: true,
    message: "Chapters fetched successfully",
    data: chapters,
  });
});

// Create chapter
export const createChapter = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description, order } = req.body;

  await verifyCourseOwnership(courseId, req.user._id);
  const chapter = await createChapterService(courseId, { title, description, order });

  res.status(201).json({
    success: true,
    message: "Chapter created successfully",
    data: chapter,
  });
});

// Update chapter
export const updateChapter = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { title, description, order } = req.body;

  await verifyCourseOwnership(courseId, req.user._id);
  const chapter = await updateChapterService(chapterId, courseId, { title, description, order });

  res.status(200).json({
    success: true,
    message: "Chapter updated successfully",
    data: chapter,
  });
});

// Delete chapter
export const deleteChapter = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;

  await verifyCourseOwnership(courseId, req.user._id);
  await deleteChapterService(chapterId, courseId);

  res.status(200).json({
    success: true,
    message: "Chapter deleted successfully",
  });
});

// Lesson endpoints
import {
  getLessonsService,
  createLessonService,
  updateLessonService,
  deleteLessonService,
} from "../../services/instructor/lessonService.js";

// Get lessons
export const getLessons = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;

  await verifyCourseOwnership(courseId, req.user._id);
  const lessons = await getLessonsService(chapterId);

  res.status(200).json({
    success: true,
    message: "Lessons fetched successfully",
    data: lessons,
  });
});

// Add lesson
export const addLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { title, description, videoUrl, duration, order, isFree, resources } = req.body;

  await verifyCourseOwnership(courseId, req.user._id);
  const lesson = await createLessonService(chapterId, courseId, {
    title,
    description,
    videoUrl,
    duration,
    order,
    isFree,
    resources,
  });

  res.status(201).json({
    success: true,
    message: "Lesson added successfully",
    data: lesson,
  });
});

// Update lesson
export const updateLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId, lessonId } = req.params;
  const { title, description, videoUrl, duration, order, isFree, resources } = req.body;

  await verifyCourseOwnership(courseId, req.user._id);
  const lesson = await updateLessonService(lessonId, chapterId, courseId, {
    title,
    description,
    videoUrl,
    duration,
    order,
    isFree,
    resources,
  });

  res.status(200).json({
    success: true,
    message: "Lesson updated successfully",
    data: lesson,
  });
});

// Delete lesson
export const deleteLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId, lessonId } = req.params;

  await verifyCourseOwnership(courseId, req.user._id);
  await deleteLessonService(lessonId, chapterId, courseId);

  res.status(200).json({
    success: true,
    message: "Lesson deleted successfully",
  });
});
