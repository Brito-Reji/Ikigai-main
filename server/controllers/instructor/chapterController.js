import asyncHandler from "express-async-handler";
import {
  verifyCourseOwnership,
  getCourseChaptersService,
  createChapterService,
  updateChapterService,
  deleteChapterService,
  addLessonService,
  updateLessonService,
  deleteLessonService
} from "../../services/instructor/chapterService.js";

// GET ALL CHAPTERS
export const getCourseChapters = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user._id;

  await verifyCourseOwnership(courseId, instructorId);

  const chapters = await getCourseChaptersService(courseId);

  res.status(200).json({
    success: true,
    message: "CHAPTERS FETCHED SUCCESSFULLY",
    data: chapters,
  });
});

// CREATE NEW CHAPTER
export const createChapter = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const instructorId = req.user._id;

  await verifyCourseOwnership(courseId, instructorId);

  const chapter = await createChapterService(courseId, req.body);

  res.status(201).json({
    success: true,
    message: "CHAPTER CREATED SUCCESSFULLY",
    data: chapter,
  });
});

// UPDATE CHAPTER
export const updateChapter = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const instructorId = req.user._id;

  await verifyCourseOwnership(courseId, instructorId);

  const chapter = await updateChapterService(courseId, chapterId, req.body);

  res.status(200).json({
    success: true,
    message: "CHAPTER UPDATED SUCCESSFULLY",
    data: chapter,
  });
});

// DELETE CHAPTER
export const deleteChapter = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const instructorId = req.user._id;

  await verifyCourseOwnership(courseId, instructorId);

  await deleteChapterService(courseId, chapterId);

  res.status(200).json({
    success: true,
    message: "CHAPTER DELETED SUCCESSFULLY",
  });
});

// ADD LESSON
export const addLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId } = req.params;
  const instructorId = req.user._id;

  await verifyCourseOwnership(courseId, instructorId);

  const chapter = await addLessonService(courseId, chapterId, req.body);

  res.status(201).json({
    success: true,
    message: "LESSON ADDED SUCCESSFULLY",
    data: chapter,
  });
});

// UPDATE LESSON
export const updateLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId, lessonId } = req.params;
  const instructorId = req.user._id;

  await verifyCourseOwnership(courseId, instructorId);

  const chapter = await updateLessonService(courseId, chapterId, lessonId, req.body);

  res.status(200).json({
    success: true,
    message: "LESSON UPDATED SUCCESSFULLY",
    data: chapter,
  });
});

// DELETE LESSON
export const deleteLesson = asyncHandler(async (req, res) => {
  const { courseId, chapterId, lessonId } = req.params;
  const instructorId = req.user._id;

  await verifyCourseOwnership(courseId, instructorId);

  const chapter = await deleteLessonService(courseId, chapterId, lessonId);

  res.status(200).json({
    success: true,
    message: "LESSON DELETED SUCCESSFULLY",
    data: chapter,
  });
});
