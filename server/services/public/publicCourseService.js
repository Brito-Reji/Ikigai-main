
import { Course } from "../../models/Course.js";
import { Lesson } from "../../models/Lesson.js";
import { Payment } from "../../models/Payment.js";

// BUILD FILTER QUERY FOR PUBLIC COURSES
export const buildPublicCourseQuery = async (queryParams) => {
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

        ranges.forEach((range) => {
            if (range === "free") priceConditions.push({ price: 0 });
            else if (range === "0-500") priceConditions.push({ price: { $gt: 0, $lte: 500 } });
            else if (range === "500-1000") priceConditions.push({ price: { $gt: 500, $lte: 1000 } });
            else if (range === "1000-2000") priceConditions.push({ price: { $gt: 1000, $lte: 2000 } });
            else if (range === "2000+") priceConditions.push({ price: { $gt: 2000 } });
        });

        if (priceConditions.length > 0) {
            query.$and = query.$and || [];
            query.$and.push({ $or: priceConditions });
        }
    }

    return query;
};

// GET SORT OPTIONS FOR PUBLIC COURSES
export const getSortOption = async (sort) => {
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
export const getPublishedCoursesService = async (queryParams,userId) => {
    const page = parseInt(queryParams.page || 1);
    const limit = parseInt(queryParams.limit || 12);

    const query = await buildPublicCourseQuery(queryParams);
    const sortOption = await getSortOption(queryParams.sort);

    const skip = (page - 1) * limit;
    
    let enrolledCourseIds = [];
    console.log(userId);
    if (userId) {
        const enrolledCourses = await Payment.find({
            userId,
            status: "PAID",
        });
        enrolledCourseIds = enrolledCourses.map(payment => payment.courseId.toString());
    }
    
    let courses = await Course.find(query)
        .populate("category", "name isBlocked")
        .populate("instructor", "firstName lastName email profileImageUrl headline description")
        .sort(sortOption)
        .skip(skip)
        .limit(limit);

        console.log(enrolledCourseIds);

    courses = courses.filter(course => {
        if (!course.category) return false;
        return course.category.isBlocked === false && !enrolledCourseIds.includes(course._id.toString());
    });

    const totalCourses = await Course.countDocuments(query);
    const totalPages = Math.ceil(totalCourses / limit);

    return {
        courses:courses.map((course) => ({
            ...course.toObject(),
            price: (course.price / 100).toFixed(2),
        })),
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
        .populate("instructor", "firstName lastName email profileImageUrl headline description")
        .sort({ createdAt: -1 })
        .limit(parseInt(limit));

    return courses.map((course) => ({
        ...course.toObject(),
        price: (course.price / 100).toFixed(2),
    }));
};

// GET PUBLIC COURSE DETAILS
export const getPublicCourseDetailsService = async (courseId,userId) => {
    let isEnrolled = false;
    if(userId){
        const enrolledCourses = await Payment.find({
            userId,
            status: "PAID",
        });
        console.log(enrolledCourses);
        isEnrolled = enrolledCourses.some(payment => payment.courseId.toString() === courseId);
    }
    const courseExists = await Course.findOne({
        _id: courseId,
        deleted: { $ne: true },
    });

    if (!courseExists) {
        throw new Error("Course not found");
    }

    // Check if course is blocked
    if (courseExists.blocked) {
        throw new Error("This course has been temporarily blocked by the administrator");
    }

    // Check if course is published
    if (!courseExists.published) {
        throw new Error("This course is not yet published");
    }

    let  course = await Course.findOne({
        _id: courseId,
        published: true,
        blocked: false,
        deleted: { $ne: true },
    })
        .populate("category", "name description")
        .populate("instructor", "firstName lastName email profileImageUrl headline description social");

    return {
        ...course.toObject(),
        price: (course.price / 100).toFixed(2),
        isEnrolled,
    };
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
export const getPublicCourseLessonsService = async (chapterId) => {
    const lessons = await Lesson.find({
        chapter: chapterId,
        deleted: { $ne: true },
    }).sort({ order: 1 });

    return lessons;
};
