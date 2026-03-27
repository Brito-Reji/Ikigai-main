import { Course } from "../../models/Course.js";
import { Chapter } from "../../models/Chapter.js";
import { Lesson } from "../../models/Lesson.js";
import { Enrollment } from "../../models/Enrollment.js";
import { Payment } from "../../models/Payment.js";
import { Wallet } from "../../models/Wallet.js";
import { Notification } from "../../models/Notification.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Get all courses
export const getAllCoursesService = async (filters) => {
    const { page = 1, limit = 20, search, category, status } = filters;

    // Base query: Admin should see published courses AND courses awaiting verification
    let query = {
        deleted: { $ne: true }
    };

    // all courses admin should see
    const visibilityFilter = {
        $or: [
            { published: true },
            { verificationStatus: "inprocess" },
            { verificationStatus: "rejected" }
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
    // update coures price paise to inr
    courses.forEach((course) => {
        course.price = course.price / 100;
    });

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
        .populate("instructor", "firstName lastName email profileImageUrl headline description social").lean()

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    }

   // update coures price paise to inr
   course.price = course.price / 100;

    return course;
};

// Toggle course block
export const toggleCourseBlockService = async (courseId, reason) => {
    const course = await Course.findById(courseId)
        .populate("instructor", "_id firstName lastName");

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = HTTP_STATUS.NOT_FOUND;
        throw error;
    }

    const isBlocking = !course.blocked;

    if (isBlocking && !reason?.trim()) {
        const error = new Error("Block reason is required");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    course.blocked = isBlocking;
    course.blockReason = isBlocking ? reason.trim() : null;
    await course.save();

    // notify the instructor
    if (course.instructor?._id) {
        await Notification.create({
            userId: course.instructor._id,
            userType: "instructor",
            type: isBlocking ? "course_blocked" : "course_unblocked",
            title: isBlocking ? "Your course has been blocked" : "Your course has been unblocked",
            message: isBlocking
                ? `Your course "${course.title}" has been blocked. Reason: ${reason.trim()}`
                : `Your course "${course.title}" has been unblocked and is now accessible again.`,
            courseId: course._id,
        });
    }

    // notify enrolled students (no reason shown)
    if (isBlocking) {
        const enrollments = await Enrollment.find({ course: courseId, status: "active" }).select("user");
        const studentNotifications = enrollments.map((e) => ({
            userId: e.user,
            userType: "student",
            type: "course_blocked",
            title: "Course temporarily unavailable",
            message: `The course "${course.title}" has been temporarily blocked by the admin. You still have access to your content.`,
            courseId: course._id,
        }));
        if (studentNotifications.length > 0) {
            await Notification.insertMany(studentNotifications);
        }
    }

    const updatedCourse = await Course.findById(courseId)
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl headline");

    return {
        course: updatedCourse,
        action: isBlocking ? "blocked" : "unblocked",
    };
};

// Delete course with wallet refund for enrolled students
export const deleteCourseService = async (courseId, reason) => {
    if (!reason?.trim()) {
        const error = new Error("Deletion reason is required");
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
    }

    const course = await Course.findById(courseId)
        .populate("instructor", "_id firstName lastName");

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

    // get all active enrollments
    const enrollments = await Enrollment.find({ course: courseId, status: "active" })
        .populate("payment");

    const studentNotifications = [];

    for (const enrollment of enrollments) {
        const payment = enrollment.payment;
        let refundAmount = 0;

        if (payment && payment.status === "PAID") {
            refundAmount = payment.amount;

            // credit to wallet (amount is in paise, store as paise)
            await Wallet.findOneAndUpdate(
                { userId: enrollment.user },
                { $inc: { balance: refundAmount } },
                { upsert: true, new: true }
            );

            payment.status = "REFUNDED";
            payment.releaseStatus = "REFUNDED";
            payment.refundedAt = new Date();
            payment.refundAmount = refundAmount;
            payment.refundMethod = "wallet";
            await payment.save();
        }

        enrollment.status = "refunded";
        await enrollment.save();

        const refundMsg = refundAmount > 0
            ? ` A refund of ₹${(refundAmount / 100).toFixed(2)} has been credited to your wallet.`
            : "";

        studentNotifications.push({
            userId: enrollment.user,
            userType: "student",
            type: "course_deleted",
            title: "Course has been removed",
            message: `The course "${course.title}" has been removed by the admin. Reason: ${reason.trim()}.${refundMsg}`,
            courseId: course._id,
        });
    }

    if (studentNotifications.length > 0) {
        await Notification.insertMany(studentNotifications);
    }

    // notify instructor
    if (course.instructor?._id) {
        await Notification.create({
            userId: course.instructor._id,
            userType: "instructor",
            type: "course_deleted",
            title: "Your course has been deleted",
            message: `Your course "${course.title}" has been permanently deleted. Reason: ${reason.trim()}`,
            courseId: course._id,
        });
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
    const pendingCourses = await Course.countDocuments({ deleted: { $ne: true }, verificationStatus: "inprocess" });
    const approvedCourses = await Course.countDocuments({ ...baseQuery, verificationStatus: "verified" });
    const rejectedCourses = await Course.countDocuments({ deleted: { $ne: true }, verificationStatus: "rejected" });
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
        pendingCourses,
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
        course.verificationStatus = status
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
