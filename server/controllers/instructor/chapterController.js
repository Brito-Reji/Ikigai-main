import asyncHandler from "express-async-handler";
import { Chapter } from "../../models/Chapter.js";
import { Course } from "../../models/Course.js";

// Get all chapters for a course
export const getCourseChapters = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = req.user._id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    const chapters = await Chapter.find({ course: courseId }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Chapters fetched successfully",
      data: chapters,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching chapters",
      error: error.message,
    });
  }
});

// Create a new chapter
export const createChapter = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order } = req.body;
    const instructorId = req.user._id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    // Get the next order number if not provided
    let chapterOrder = order;
    if (chapterOrder === undefined) {
      const lastChapter = await Chapter.findOne({ course: courseId }).sort({
        order: -1,
      });
      chapterOrder = lastChapter ? lastChapter.order + 1 : 0;
    }

    const chapter = await Chapter.create({
      course: courseId,
      title,
      description,
      order: chapterOrder,
      lessons: [],
    });

    console.log(
      `Chapter created: ${chapter.title} for course: ${course.title}`
    );

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Error creating chapter:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating chapter",
      error: error.message,
    });
  }
});

// Update a chapter
export const updateChapter = asyncHandler(async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { title, description, order } = req.body;
    const instructorId = req.user._id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    const chapter = await Chapter.findOneAndUpdate(
      { _id: chapterId, course: courseId },
      { title, description, order },
      { new: true, runValidators: true }
    );

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    console.log(`Chapter updated: ${chapter.title}`);

    return res.status(200).json({
      success: true,
      message: "Chapter updated successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Error updating chapter:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating chapter",
      error: error.message,
    });
  }
});

// Delete a chapter
export const deleteChapter = asyncHandler(async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const instructorId = req.user._id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    const chapter = await Chapter.findOneAndDelete({
      _id: chapterId,
      course: courseId,
    });

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    console.log(`Chapter deleted: ${chapter.title}`);

    return res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting chapter",
      error: error.message,
    });
  }
});

// Add a lesson to a chapter
export const addLesson = asyncHandler(async (req, res) => {
  try {
    const { courseId, chapterId } = req.params;
    const { title, description, videoUrl, duration, order, isFree, resources } =
      req.body;
    const instructorId = req.user._id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    // Get the next order number if not provided
    let lessonOrder = order;
    if (lessonOrder === undefined) {
      lessonOrder = chapter.lessons.length;
    }

    const lesson = {
      title,
      description,
      videoUrl,
      duration: duration || 0,
      order: lessonOrder,
      isFree: isFree || false,
      resources: resources || [],
    };

    chapter.lessons.push(lesson);
    await chapter.save();

    console.log(`Lesson added: ${lesson.title} to chapter: ${chapter.title}`);

    return res.status(201).json({
      success: true,
      message: "Lesson added successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Error adding lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Error adding lesson",
      error: error.message,
    });
  }
});

// Update a lesson
export const updateLesson = asyncHandler(async (req, res) => {
  try {
    const { courseId, chapterId, lessonId } = req.params;
    const { title, description, videoUrl, duration, order, isFree, resources } =
      req.body;
    const instructorId = req.user._id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    const lesson = chapter.lessons.id(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Update lesson fields
    if (title !== undefined) lesson.title = title;
    if (description !== undefined) lesson.description = description;
    if (videoUrl !== undefined) lesson.videoUrl = videoUrl;
    if (duration !== undefined) lesson.duration = duration;
    if (order !== undefined) lesson.order = order;
    if (isFree !== undefined) lesson.isFree = isFree;
    if (resources !== undefined) lesson.resources = resources;

    await chapter.save();

    console.log(`Lesson updated: ${lesson.title}`);

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating lesson",
      error: error.message,
    });
  }
});

// Delete a lesson
export const deleteLesson = asyncHandler(async (req, res) => {
  try {
    const { courseId, chapterId, lessonId } = req.params;
    const instructorId = req.user._id;

    // Verify course belongs to instructor
    const course = await Course.findOne({
      _id: courseId,
      instructor: instructorId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you don't have permission",
      });
    }

    const chapter = await Chapter.findOne({ _id: chapterId, course: courseId });
    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    chapter.lessons.pull(lessonId);
    await chapter.save();

    console.log(`Lesson deleted from chapter: ${chapter.title}`);

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
      data: chapter,
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting lesson",
      error: error.message,
    });
  }
});
