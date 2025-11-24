import asyncHandler from "express-async-handler";
import { Course } from "../../models/Course.js";

// Get all published courses for public display
export const getPublishedCourses = asyncHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sort = "newest",
    } = req.query;

    // Build query for published courses only (exclude deleted)
    let query = { published: true, blocked: false, deleted: { $ne: true } };

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    // Add search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add price range filter if provided
    const { priceRange } = req.query;
    if (priceRange) {
      const ranges = priceRange.split(",");
      const priceConditions = [];

      ranges.forEach(range => {
        if (range === "free") {
          priceConditions.push({ price: 0 });
        } else if (range === "0-500") {
          priceConditions.push({ price: { $gt: 0, $lte: 500 } });
        } else if (range === "500-1000") {
          priceConditions.push({ price: { $gt: 500, $lte: 1000 } });
        } else if (range === "1000-2000") {
          priceConditions.push({ price: { $gt: 1000, $lte: 2000 } });
        } else if (range === "2000+") {
          priceConditions.push({ price: { $gt: 2000 } });
        }
      });

      if (priceConditions.length > 0) {
        query.$and = query.$and || [];
        query.$and.push({ $or: priceConditions });
      }
    }

    // Determine sort order
    let sortOption = { createdAt: -1 };
    switch (sort) {
      case "price-low":
        sortOption = { price: 1 };
        break;
      case "price-high":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1 };
        break;
      case "title-asc":
        sortOption = { title: 1 };
        break;
      case "title-desc":
        sortOption = { title: -1 };
        break;
      case "newest":
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let courses = await Course.find(query)
      .populate("category", "name")
      .populate(
        "instructor",
        "firstName lastName email profileImageUrl headline description"
      )
      .populate("category")
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    courses = courses.filter(course => course.category.isBlocked === false);

    console.log("cat->", courses);

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    console.log(
      `Found ${courses.length} published courses (page ${page}/${totalPages})`
    );

    return res.status(200).json({
      success: true,
      message: "Published courses fetched successfully",
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
    console.error("Error fetching published courses:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching courses",
      error: error.message,
    });
  }
});

// Get featured courses (top rated or most enrolled)
export const getFeaturedCourses = asyncHandler(async (req, res) => {
  try {
    const { limit = 4 } = req.query;

    const courses = await Course.find({
      published: true,
      blocked: false,
      deleted: { $ne: true },
    })
      .populate("category", "name")
      .populate(
        "instructor",
        "firstName lastName email profileImageUrl headline description"
      )
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    console.log(
      `Found ${courses.length} published courses for featured section`
    );

    return res.status(200).json({
      success: true,
      message: "Featured courses fetched successfully",
      data: courses,
      count: courses.length,
    });
  } catch (error) {
    console.error("Error fetching featured courses:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching featured courses",
      error: error.message,
    });
  }
});

// Get single course details for public view
export const getPublicCourseDetails = asyncHandler(async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findOne({
      _id: courseId,
      published: true,
      blocked: false,
      deleted: { $ne: true },
    })
      .populate("category", "name description")
      .populate(
        "instructor",
        "firstName lastName email profileImageUrl headline description social"
      );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or not available",
      });
    }

    console.log(`Public course details viewed: ${course.title}`);

    return res.status(200).json({
      success: true,
      message: "Course details fetched successfully",
      data: course,
    });
  } catch (error) {
    console.error("Error fetching public course details:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching course details",
      error: error.message,
    });
  }
});

// Get course statistics for landing page
export const getCourseStats = asyncHandler(async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments({
      published: true,
      blocked: false,
      deleted: { $ne: true },
    });
    const totalInstructors = await Course.distinct("instructor", {
      published: true,
      blocked: false,
      deleted: { $ne: true },
    });

    const stats = {
      totalCourses,
      totalInstructors: totalInstructors.length,
      totalStudents: 0,
      totalCategories: 0,
    };

    return res.status(200).json({
      success: true,
      message: "Course statistics fetched successfully",
      data: stats,
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
