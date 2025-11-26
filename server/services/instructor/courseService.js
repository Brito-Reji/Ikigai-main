import asyncHandler from "express-async-handler";
import { Course } from "../../models/Course.js";
import { Category } from "../../models/Category.js";

// GET ALL COURSES BY INSTRUCTOR
export const getAllCourseByInstructorService = asyncHandler(async (instructorId) => {
    const courses = await Course.find({
        instructor: instructorId,
        deleted: { $ne: true },
    })
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl headline")
        .sort({ createdAt: -1 });

    return courses;
});

// VALIDATE COURSE INPUT
export const validateCourseInput = asyncHandler(async (data) => {
    const {
        title,
        description,
        overview,
        category,
        actualPrice,
        discountType,
        discountValue,
    } = data;

    if (!title || !description || !overview || !category || !actualPrice) {
        throw new Error("All required fields must be provided");
    }

    if (title.trim().length === 0 || title.length > 200) {
        throw new Error("Title must be between 1 and 200 characters");
    }

    if (description.trim().length === 0 || description.length > 2000) {
        throw new Error("Description must be between 1 and 2000 characters");
    }

    if (overview.trim().length === 0 || overview.length > 1000) {
        throw new Error("Overview must be between 1 and 1000 characters");
    }

    const numericActualPrice = parseFloat(actualPrice);
    if (isNaN(numericActualPrice) || numericActualPrice < 0) {
        throw new Error("Actual price must be a valid positive number");
    }

    const validTypes = ["percentage", "fixed", "none"];
    const chosenType = discountType || "none";

    if (!validTypes.includes(chosenType)) {
        throw new Error("Invalid discount type");
    }

    let numericDiscountValue = 0;

    if (chosenType !== "none") {
        numericDiscountValue = parseFloat(discountValue) || 0;

        if (numericDiscountValue < 0) throw new Error("Discount value cannot be negative");

        if (chosenType === "percentage" && numericDiscountValue > 100) {
            throw new Error("Percentage discount cannot exceed 100%");
        }
    }

    let finalPrice = numericActualPrice;

    if (chosenType === "percentage") {
        finalPrice = numericActualPrice - (numericActualPrice * numericDiscountValue) / 100;
    } else if (chosenType === "fixed") {
        finalPrice = numericActualPrice - numericDiscountValue;
    }

    finalPrice = Math.max(0, finalPrice);

    return {
        numericActualPrice,
        numericDiscountValue,
        chosenType,
        finalPrice,
    };
});

// CREATE COURSE
export const createCourseService = asyncHandler(async (instructorId, data) => {
    const {
        title,
        description,
        overview,
        category,
        thumbnail,
        published,
    } = data;

    const { numericActualPrice, numericDiscountValue, chosenType, finalPrice } =
        await validateCourseInput(data);

    const course = await Course.create({
        title: title.trim(),
        description: description.trim(),
        overview: overview.trim(),
        category,
        instructor: instructorId,
        actualPrice: numericActualPrice,
        discountType: chosenType,
        discountValue: numericDiscountValue,
        price: finalPrice,
        thumbnail: thumbnail || "",
        published: published || false,
    });

    return await Course.findById(course._id)
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl headline");
});

// UPDATE COURSE
export const updateCourseService = asyncHandler(async (courseId, instructorId, data) => {
    const existing = await Course.findById(courseId);
    if (!existing) throw new Error("Course not found");

    if (existing.instructor.toString() !== instructorId) {
        throw new Error("You can only edit your own courses");
    }

    const {
        numericActualPrice,
        numericDiscountValue,
        chosenType,
        finalPrice,
    } = await validateCourseInput(data);

    const updatedCourse = await Course.findByIdAndUpdate(
        courseId,
        {
            title: data.title.trim(),
            description: data.description.trim(),
            overview: data.overview.trim(),
            category: data.category,
            actualPrice: numericActualPrice,
            discountType: chosenType,
            discountValue: numericDiscountValue,
            price: finalPrice,
            thumbnail: data.thumbnail || existing.thumbnail,
            published: data.published !== undefined ? data.published : existing.published,
        },
        { new: true, runValidators: true }
    )
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl headline");

    return updatedCourse;
});

// GET COURSE BY ID
export const getCourseByIdService = asyncHandler(async (courseId, instructorId) => {
    const course = await Course.findById(courseId)
        .populate("category", "name")
        .populate("instructor", "firstName lastName email profileImageUrl headline");

    if (!course) throw new Error("Course not found");

    if (course.instructor._id.toString() !== instructorId) {
        throw new Error("You can only view your own courses");
    }

    return course;
});
