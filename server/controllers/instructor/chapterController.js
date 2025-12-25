import asyncHandler from 'express-async-handler';
import logger from '../../utils/logger.js';
import {
  verifyCourseOwnership,
  getChaptersService,
  createChapterService,
  updateChapterService,
  deleteChapterService,
} from '../../services/instructor/chapterService.js';

// Get chapters
export const getCourseChapters = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  logger.info(`Fetching chapters for course: ${courseId}`);

  await verifyCourseOwnership(courseId, req.user._id);
  const chapters = await getChaptersService(courseId);

  logger.info(`Retrieved ${chapters.length} chapters for course: ${courseId}`);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Chapters fetched successfully',
    data: chapters,
  });
});

// Create chapter
export const createChapter = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, description, order } = req.body;
  logger.info(`Creating chapter "${title}" for course: ${courseId}`);

  await verifyCourseOwnership(courseId, req.user._id);
  const chapter = await createChapterService(courseId, {
    title,
    description,
    order,
  });

  logger.info(`Chapter created successfully: ${chapter._id}`);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Chapter created successfully',
    data: chapter,
  });
});

// Update chapter
export const updateChapter = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { title, description, order } = req.body;
  logger.info(`Updating chapter: ${chapterId} in course: ${courseId}`);

  await verifyCourseOwnership(courseId, req.user._id);
  const chapter = await updateChapterService(chapterId, courseId, {
    title,
    description,
    order,
  });

  logger.info(`Chapter updated successfully: ${chapterId}`);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Chapter updated successfully',
    data: chapter,
  });
});

// Delete chapter
export const deleteChapter = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  logger.info(`Deleting chapter: ${chapterId} from course: ${courseId}`);

  await verifyCourseOwnership(courseId, req.user._id);
  await deleteChapterService(chapterId, courseId);

  logger.info(`Chapter deleted successfully: ${chapterId}`);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Chapter deleted successfully',
  });
});

// Lesson endpoints
import {
  getLessonsService,
  createLessonService,
  updateLessonService,
  deleteLessonService,
} from '../../services/instructor/lessonService.js';
import { HTTP_STATUS } from '../../utils/httpStatus.js';

// Get lessons
export const getLessons = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  logger.info(`Fetching lessons for chapter: ${chapterId}`);

  await verifyCourseOwnership(courseId, req.user._id);
  const lessons = await getLessonsService(chapterId);

  logger.info(`Retrieved ${lessons.length} lessons for chapter: ${chapterId}`);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Lessons fetched successfully',
    data: lessons,
  });
});

// Add lesson
export const addLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const { title, description, videoUrl, duration, order, isFree, resources } =
    req.body;
  logger.info(`Adding lesson "${title}" to chapter: ${chapterId}`);

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

  logger.info(`Lesson created successfully: ${lesson._id}`);
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: 'Lesson added successfully',
    data: lesson,
  });
});

// Update lesson
export const updateLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId, lessonId } = req.params;
  const { title, description, videoUrl, duration, order, isFree, resources } =
    req.body;
  logger.info(`Updating lesson: ${lessonId} in chapter: ${chapterId}`);

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

  logger.info(`Lesson updated successfully: ${lessonId}`);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Lesson updated successfully',
    data: lesson,
  });
});

// Delete lesson
export const deleteLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId, lessonId } = req.params;
  logger.info(`Deleting lesson: ${lessonId} from chapter: ${chapterId}`);

  await verifyCourseOwnership(courseId, req.user._id);
  await deleteLessonService(lessonId, chapterId, courseId);

  logger.info(`Lesson deleted successfully: ${lessonId}`);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Lesson deleted successfully',
  });
});
