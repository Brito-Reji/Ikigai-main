import asyncHandler from "express-async-handler";
import { Course } from "../../models/Course.js";


// Get all courses for admin (published and unpublished)
export const getAllCourses = asyncHandler(async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;

    // Build query - exclude deleted courses
    let query = { deleted: { $ne: true } };

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Status filter
    if (status === "published") {
      query.published = true;
    } else if (status === "draft") {
      query.published = false;
    } else if (status === "blocked") {
      query.blocked = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(query)
      .populate("category", "name")
      .populate(
        "instructor",
        "firstName lastName email profileImageUrl headline"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    console.log(
      `Admin fetched ${courses.length} courses (page ${page}/${totalPages})`
    );

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      data: courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCourses,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching courses for admin:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
});

// Get single course details for admin
export const getCourseDetails = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("category", "name description")
      .populate(
        "instructor",
        "firstName lastName email profileImageUrl headline description social"
      );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    console.log(`Admin viewing course details: ${course.title}`);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching course details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
      error: error.message,
    });
  }
});

// Block/Unblock course
export const toggleCourseBlock = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    course.blocked = !course.blocked;
    await course.save();

    const updatedCourse = await Course.findById(courseId)
      .populate("category", "name")
      .populate(
        "instructor",
        "firstName lastName email profileImageUrl headline"
      );

    console.log(
      `Admin ${course.blocked ? "blocked" : "unblocked"} course: ${course.title}`
    );

    return res.status(200).json({
      success: true,
      message: `Course ${course.blocked ? "blocked" : "unblocked"} successfully`,
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error toggling course block status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating course status",
      error: error.message,
    });
  }
});

// Soft delete course (admin only)
export const deleteCourse = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (course.deleted) {
      return res.status(400).json({
        success: false,
        message: "Course is already deleted",
      });
    }

    course.deleted = true;
    await course.save();

    console.log(`Admin soft deleted course: ${course.title}`);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting course:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
});

// Get course statistics for admin dashboard
export const getCourseStatistics = asyncHandler(async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({
      deleted: { $ne: true },
    });
    const publishedCourses = await Course.countDocuments({
      published: true,
      deleted: { $ne: true },
    });
    const draftCourses = await Course.countDocuments({
      published: false,
      deleted: { $ne: true },
    });
    const blockedCourses = await Course.countDocuments({
      blocked: true,
      deleted: { $ne: true },
    });

    // Get courses by category (exclude deleted)
    const coursesByCategory = await Course.aggregate([
      {
        $match: { deleted: { $ne: true } },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      {
        $unwind: "$categoryInfo",
      },
      {
        $group: {
          _id: "$categoryInfo.name",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const statistics = {
      totalCourses,
      publishedCourses,
      draftCourses,
      blockedCourses,
      coursesByCategory,
    };

    return res.status(200).json({
      success: true,
      message: "Course statistics fetched successfully",
      data: statistics,
    });
  } catch (error) {
    console.error("Error fetching course statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
});
