import { Cart } from "../../models/Cart.js";
import { Course } from "../../models/Course.js";

export const getCartService = async (userId) => {
    const cart = await Cart.findOne({ userId })
        .populate({
            path: "courses",
            select: "title description price thumbnail instructor category blocked",
            match: { blocked: false },
            populate: [
                { path: "instructor", select: "firstName lastName", },
                { path: "category", select: "name isBlocked" }
            ] 
        }).lean();



    // filter nulls
    const filteredCourses = (cart?.courses || []).filter(course => course !== null && course.category && !course.category.isBlocked);
    
    // cleanup - remove null references from DB
    if (cart && filteredCourses.length !== cart.courses.length) {
        const validIds = filteredCourses.map(c => c._id);
        await Cart.findOneAndUpdate(
            { userId },
            { $set: { courses: validIds } }
        );
    }

    console.log("Filtered Courses in Cart:", filteredCourses);
    const updated = filteredCourses.map(course => ({ ...course, price: course.price / 100,priceInPaise:course.price }))
    console.log("Updated Courses with Adjusted Price:", updated);
    return updated;
};

// add to cart
export const addToCartService = async (userId, courseId) => {

    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    if (!course.published || course.blocked) {
        throw new Error("This course is not available");
    }


    const cart = await Cart.findOneAndUpdate(
        { userId },
        { $addToSet: { courses: courseId } },
        { upsert: true, new: true }
    ).populate({
        path: "courses",
        select: "title description price thumbnail instructor category",
        populate: [
            { path: "instructor", select: "firstName lastName" },
            { path: "category", select: "name" }
        ]
    });

    // filter nulls
    const filteredCourses = (cart.courses || []).filter(course => course !== null);
    
    // cleanup - remove null references from DB
    if (filteredCourses.length !== cart.courses.length) {
        const validIds = filteredCourses.map(c => c._id);
        await Cart.findOneAndUpdate(
            { userId },
            { $set: { courses: validIds } }
        );
    }
    
    return filteredCourses;
};

// remove from cart
export const removeFromCartService = async (userId, courseId) => {
    const cart = await Cart.findOneAndUpdate(
        { userId },
        { $pull: { courses: courseId } },
        { new: true }
    );

    if (!cart) {
        throw new Error("Cart not found");
    }

    return cart;
};

// sync guest cart
export const syncCartService = async (userId, courseIds) => {
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
        return [];
    }

    // validate courses exist and are available
    const validCourses = await Course.find({
        _id: { $in: courseIds },
        published: true,
        blocked: { $ne: true }
    }).select("_id");

    const validIds = validCourses.map(c => c._id);

    const cart = await Cart.findOneAndUpdate(
        { userId },
        { $addToSet: { courses: { $each: validIds } } },
        { upsert: true, new: true }
    ).populate({
        path: "courses",
        select: "title description price thumbnail instructor category",
        populate: [
            { path: "instructor", select: "firstName lastName" },
            { path: "category", select: "name" }
        ]
    });

    // filter nulls
    const filteredCourses = (cart.courses || []).filter(course => course !== null);
    
    // cleanup - remove null references from DB
    if (filteredCourses.length !== cart.courses.length) {
        const validIds = filteredCourses.map(c => c._id);
        await Cart.findOneAndUpdate(
            { userId },
            { $set: { courses: validIds } }
        );
    }
    
    return filteredCourses;
};

// clear cart
export const clearCartService = async (userId) => {
    const result = await Cart.findOneAndUpdate(
        { userId },
        { $set: { courses: [] } },
        { new: true }
    );
    return result;
};
