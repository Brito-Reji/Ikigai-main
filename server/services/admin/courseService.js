import { Course } from "../../models/Course.js";
import { Chapter } from "../../models/Chapter.js";
import { Lesson } from "../../models/Lesson.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Get all courses
export const getAllCoursesService = async (filters) => {
    const { page = 1, limit = 20, search, category, status } = filters;

    // Base query: Admin should see published courses AND courses awaiting verification
    let query = {
        deleted: { $ne: true }
    };

    // Add visibility filter (published OR awaiting verification)
    const visibilityFilter = {
        $or: [
            { published: true },
            { verificationStatus: "inprocess" }
        ]
    };

    if (search) {
        // Combine visibility filter with search filter using $and
        query.$and = [
            visibilityFilter,
            {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ]
            }
        ];
    } else {
        // Just apply visibility filter
        Object.assign(query, visibilityFilter);
    }

    if (category) {
        query.category = category;
    }

    // Status filters for admin - these override the visibility filter
    if (status === "inprocess") {
        delete query.$or;
        delete query.$and;
        query.verificationStatus = "inprocess"; // Awaiting approval
    } else if (status === "published") {
        delete query.$or;
        delete query.$and;
        query.verificationStatus = "inprocess"; // Published but not yet approved (legacy support)
    } else if (status === "approved") {
        delete query.$or;
        delete query.$and;
        query.verificationStatus = "verified"; // Approved courses
        query.published = true; // Only show published verified courses
    } else if (status === "rejected") {
        delete query.$or;
        delete query.$and;
        query.verificationStatus = "rejected";
    } else if (status === "blocked") {
        delete query.$or;
        delete query.$and;
        query.blocked = true;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find(query)
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl headline")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    return {
        courses,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCourses,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1,
        },
    };
};

// Get course details
export const getCourseDetailsService = async (courseId) => {
    const course = await Course.findById(courseId)
        .populate("category", "name description")
        .populate("instructor", "firstName lastName email profileImageUrl headline description social");

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    }

    return course;
};

// Toggle course block
export const toggleCourseBlockService = async (courseId) => {
    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    }

    course.blocked = !course.blocked;
    await course.save();

    const updatedCourse = await Course.findById(courseId)
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl headline");

    return {
        course: updatedCourse,
        action: course.blocked ? "blocked" : "unblocked"
    };
};

// Delete course
export const deleteCourseService = async (courseId) => {
    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    }

    if (course.deleted) {
        const error = new Error("Course is already deleted");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    course.deleted = true;
    await course.save();

    return course;
};

// Get course statistics
export const getCourseStatisticsService = async () => {
    // Only count published courses (exclude drafts)
    const baseQuery = { deleted: { $ne: true }, published: true };

    const totalCourses = await Course.countDocuments(baseQuery);
    const publishedCourses = await Course.countDocuments({ ...baseQuery, verificationStatus: "inprocess" });
    const approvedCourses = await Course.countDocuments({ ...baseQuery, verificationStatus: "verified" });
    const rejectedCourses = await Course.countDocuments({ ...baseQuery, verificationStatus: "rejected" });
    const blockedCourses = await Course.countDocuments({ ...baseQuery, blocked: true });

    const coursesByCategory = await Course.aggregate([
        { $match: baseQuery },
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryInfo",
            },
        },
        { $unwind: "$categoryInfo" },
        {
            $group: {
                _id: "$categoryInfo.name",
                count: { $sum: 1 },
            },
        },
        { $sort: { count: -1 } },
    ]);

    return {
        totalCourses,
        publishedCourses, // Awaiting approval
        approvedCourses,
        rejectedCourses,
        blockedCourses,
        coursesByCategory,
    };
};

// Update verification status
export const updateVerificationStatusService = async (courseId, status, rejectionReason) => {
    if (!["verified", "rejected"].includes(status)) {
        const error = new Error("Invalid verification status. Must be 'verified' or 'rejected'");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    const course = await Course.findById(courseId);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    }

    if (course.verificationStatus !== "inprocess") {
        const error = new Error("Course is not in verification process");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    if (status === "verified") {
        course.published = true;
        course.verificationStatus = status;
    }

    if (status === "rejected") {
        if (!rejectionReason || rejectionReason.trim() === "") {
            const error = new Error("Rejection reason is required when rejecting a course");
            error.statusCode = HTTP_STATUS.BAD_REQUEST;
            throw error;
        }
        course.rejectionReason = rejectionReason;
    } else {
        course.rejectionReason = null;
    }

    await course.save();

    const updatedCourse = await Course.findById(courseId)
        .populate("category", "name")
        .populate("instructor", "firstName lastName email");

    return updatedCourse;
};

// Get pending verifications
export const getPendingVerificationsService = async (page = 1, limit = 20) => {
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const courses = await Course.find({
        verificationStatus: "inprocess",
        deleted: { $ne: true },
    })
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

    const totalCourses = await Course.countDocuments({
        verificationStatus: "inprocess",
        deleted: { $ne: true },
    });
    const totalPages = Math.ceil(totalCourses / parseInt(limit));

    return {
        courses,
        pagination: {
            currentPage: parseInt(page),
            totalPages,
            totalCourses,
            hasNext: parseInt(page) < totalPages,
            hasPrev: parseInt(page) > 1,
        },
    };
};

// Get verification statistics
export const getVerificationStatisticsService = async () => {
    const pendingCount = await Course.countDocuments({
        verificationStatus: "inprocess",
        deleted: { $ne: true },
    });
    const verifiedCount = await Course.countDocuments({
        verificationStatus: "verified",
        deleted: { $ne: true },
    });
    const rejectedCount = await Course.countDocuments({
        verificationStatus: "rejected",
        deleted: { $ne: true },
    });

    return {
        pending: pendingCount,
        verified: verifiedCount,
        rejected: rejectedCount,
    };
};

// Get course chapters
export const getAdminCourseChaptersService = async (courseId) => {
    const chapters = await Chapter.find({ course: courseId }).sort({ order: 1 });

    const chaptersWithLessons = await Promise.all(
        chapters.map(async (chapter) => {
            const lessons = await Lesson.find({ chapter: chapter._id }).sort({ order: 1 });
            return {
                _id: chapter._id,
                course: chapter.course,
                title: chapter.title,
                description: chapter.description,
                order: chapter.order,
                createdAt: chapter.createdAt,
                updatedAt: chapter.updatedAt,
                lessons: lessons.map(lesson => ({
                    _id: lesson._id,
                    chapter: lesson.chapter,
                    title: lesson.title,
                    description: lesson.description,
                    videoUrl: lesson.videoUrl,
                    duration: lesson.duration,
                    order: lesson.order,
                    isFree: lesson.isFree,
                    resources: lesson.resources,
                    createdAt: lesson.createdAt,
                    updatedAt: lesson.updatedAt,
                }))
            };
        })
    );

    return chaptersWithLessons;
};
