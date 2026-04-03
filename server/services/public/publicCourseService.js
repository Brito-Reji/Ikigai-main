import { Course } from "../../models/Course.js";
import { Lesson } from "../../models/Lesson.js";
import { Enrollment } from "../../models/Enrollment.js";
import { Review } from "../../models/Review.js";
import { checkEnrollment } from "../student/enrollmentService.js";
import { Chapter } from "../../models/Chapter.js";
import { AppError } from "../../errors/AppError.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// compute rating and enrollment stats for courses
const attachCourseStats = async courses => {
  const courseIds = courses.map(c => c._id || c.id);

  const [ratingStats, enrollmentStats] = await Promise.all([
    Review.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: "$course",
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]),
    Enrollment.aggregate([
      { $match: { course: { $in: courseIds }, status: "active" } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
    ]),
  ]);

  const ratingMap = {};
  ratingStats.forEach(r => {
    ratingMap[r._id.toString()] = {
      averageRating: parseFloat(r.avg.toFixed(1)),
      totalReviews: r.count,
    };
  });

  const enrollmentMap = {};
  enrollmentStats.forEach(e => {
    enrollmentMap[e._id.toString()] = e.count;
  });

  return courses.map(course => {
    const id = (course._id || course.id).toString();
    const stats = ratingMap[id] || { averageRating: 0, totalReviews: 0 };
    return {
      ...course,
      averageRating: stats.averageRating,
      totalReviews: stats.totalReviews,
      enrollmentCount: enrollmentMap[id] || 0,
    };
  });
};

// BUILD FILTER QUERY FOR PUBLIC COURSES
export const buildPublicCourseQuery = async queryParams => {
  const { category, search, priceRange } = queryParams;

  const query = { published: true, blocked: false, deleted: { $ne: true } };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (priceRange) {
    const ranges = priceRange.split(",");
    const priceConditions = [];

    ranges.forEach(range => {
      if (range === "free") priceConditions.push({ price: 0 });
      else if (range === "0-500")
        priceConditions.push({ price: { $gt: 0, $lte: 500 * 100 } });
      else if (range === "500-1000")
        priceConditions.push({ price: { $gt: 500 * 100, $lte: 1000 * 100 } });
      else if (range === "1000-2000")
        priceConditions.push({ price: { $gt: 1000 * 100, $lte: 2000 * 100 } });
      else if (range === "2000+")
        priceConditions.push({ price: { $gt: 2000 * 100 } });
    });

    if (priceConditions.length > 0) {
      query.$and = query.$and || [];
      query.$and.push({ $or: priceConditions });
    }
  }

  return query;
};

// GET SORT OPTIONS FOR PUBLIC COURSES
export const getSortOption = async sort => {
  switch (sort) {
    case "price-low":
      return { price: 1 };
    case "price-high":
      return { price: -1 };
    case "rating":
      return { rating: -1 };
    case "title-asc":
      return { title: 1 };
    case "title-desc":
      return { title: -1 };
    case "newest":
    default:
      return { createdAt: -1 };
  }
};

// GET PUBLISHED COURSES
export const getPublishedCoursesService = async (queryParams, userId) => {
  const page = parseInt(queryParams.page || 1);
  const limit = parseInt(queryParams.limit || 12);

  const query = await buildPublicCourseQuery(queryParams);
  const sortOption = await getSortOption(queryParams.sort);

  const skip = (page - 1) * limit;

  let enrolledCourseIds = [];
  if (userId) {
    const enrollments = await Enrollment.find({
      user: userId,
      status: "active",
    });
    enrolledCourseIds = enrollments.map(e => e.course.toString());
  }

  let courses = await Course.find(query)
    .populate("category", "name isBlocked")
    .populate(
      "instructor",
      "firstName lastName email profileImageUrl headline description"
    )
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  courses = courses.filter(course => {
    if (!course.category) return false;
    return (
      course.category.isBlocked === false &&
      !enrolledCourseIds.includes(course._id.toString())
    );
  });

  const totalCourses = await Course.countDocuments(query);
  const totalPages = Math.ceil(totalCourses / limit);

  const coursesPlain = courses.map(course => ({
    ...course.toObject(),
    price: (course.price / 100).toFixed(2),
  }));

  const coursesWithStats = await attachCourseStats(coursesPlain);

  // rating post-filter
  const minRating = queryParams.rating ? parseInt(queryParams.rating) : null;
  const finalCourses = minRating
    ? coursesWithStats.filter(c => c.averageRating >= minRating)
    : coursesWithStats;

  return {
    courses: finalCourses,
    pagination: {
      currentPage: page,
      totalPages,
      totalCourses,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

// GET FEATURED COURSES
export const getFeaturedCoursesService = async (limit = 4) => {
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

  const coursesPlain = courses.map(course => ({
    ...course.toObject(),
    price: (course.price / 100).toFixed(2),
  }));

  return attachCourseStats(coursesPlain);
};

// GET PUBLIC COURSE DETAILS
export const getPublicCourseDetailsService = async (courseId, userId) => {
  const isEnrolled = userId ? await checkEnrollment(userId, courseId) : false;
  const courseExists = await Course.findOne({
    _id: courseId,
    deleted: { $ne: true },
  });

  if (!courseExists) {
    throw new AppError("Course not found",HTTP_STATUS.NOT_FOUND);
  }

  // Check if course is blocked
  if (courseExists.blocked) {
    throw new AppError(
      "This course has been temporarily blocked by the administrator",HTTP_STATUS.BAD_REQUEST
    );
  }

  // Check if course is published
  if (!courseExists.published) {
    throw new AppError("This course is not yet published",HTTP_STATUS.BAD_REQUEST);
  }

  let course = await Course.findOne({
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
  let chapters = await Chapter.find({ course: courseId }).select("_id");
  const chapterIds = chapters.map(ch => ch._id);
  const lessons = await Lesson.find({ chapter: { $in: chapterIds } });
  const totalDuration =
    (lessons || [])
      .map(data => data?.duration || 0) 
      .reduce((acc, curr) => acc + curr, 0) / 60; 
  console.log(totalDuration);
  // calculate instructor-level stats for dynamic display
  let instructorCourseCount = 0;
  let instructorStudentCount = 0;
  let instructorReviewCount = 0;
  let instructorRating = 0;

  const instructorId = course.instructor?._id;
  if (instructorId) {
    const instructorCourses = await Course.find({
      instructor: instructorId,
      published: true,
      blocked: false,
      deleted: { $ne: true },
    }).select("_id");

    const instructorCourseIds = instructorCourses.map(c => c._id);
    instructorCourseCount = instructorCourses.length;

    instructorStudentCount = await Enrollment.countDocuments({
      course: { $in: instructorCourseIds },
      status: "active",
    });

    const instructorReviewStats = await Review.aggregate([
      { $match: { course: { $in: instructorCourseIds } } },
      {
        $group: {
          _id: null,
          avg: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    if (instructorReviewStats.length > 0) {
      instructorReviewCount = instructorReviewStats[0].count;
      instructorRating = parseFloat(instructorReviewStats[0].avg.toFixed(1));
    }
  }

  const coursePlain = {
    ...course.toObject(),
    price: (course.price / 100).toFixed(2),
    isEnrolled,
    chapterCount: chapters.length,
    lessonCount: lessons.length,
    totalDuration,
    instructor: {
      ...course.toObject().instructor,
      courseCount: instructorCourseCount,
      totalStudents: instructorStudentCount,
      totalReviews: instructorReviewCount,
      averageRating: instructorRating,
    },
  };

  const [withStats] = await attachCourseStats([coursePlain]);
  return withStats;
};

// GET PUBLIC COURSE STATISTICS
export const getCourseStatsService = async () => {
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

  return {
    totalCourses,
    totalInstructors: totalInstructors.length,
    totalStudents: 0,
    totalCategories: 0,
  };
};

// GET PUBLIC COURSE LESSONS
export const getPublicCourseLessonsService = async chapterId => {
  const lessons = await Lesson.find({
    chapter: chapterId,
    deleted: { $ne: true },
  }).sort({ order: 1 });

  return lessons;
};
