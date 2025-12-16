import { Cart } from "../../models/Cart.js";
import { Course } from "../../models/Course.js";

// GET USER CART
export const getCartService = async (userId) => {
    const cartItems = await Cart.find({ userId })
        .populate({
            path: 'courseId',
            select: 'title description price thumbnail instructor category',
            populate: [
                { path: 'instructor', select: 'firstName lastName' },
                { path: 'category', select: 'name' }
            ]
        })
        .sort({ createdAt: -1 });

    return cartItems;
};

// ADD TO CART
export const addToCartService = async (userId, courseId) => {
    const existingItem = await Cart.findOne({ userId, courseId });

    if (existingItem) {
        throw new Error("Course already in cart");
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    if (!course.published || course.blocked) {
        throw new Error("This course is not available");
    }

    const cartItem = await Cart.create({ userId, courseId });

    const populatedItem = await Cart.findById(cartItem._id)
        .populate({
            path: 'courseId',
            select: 'title description price thumbnail instructor category',
            populate: [
                { path: 'instructor', select: 'firstName lastName' },
                { path: 'category', select: 'name' }
            ]
        });

    return populatedItem;
};

// REMOVE FROM CART
export const removeFromCartService = async (userId, courseId) => {
    const result = await Cart.findOneAndDelete({ userId, courseId });

    if (!result) {
        throw new Error("Item not found in cart");
    }

    return result;
};

// SYNC GUEST CART
export const syncCartService = async (userId, courseIds) => {
    if (!Array.isArray(courseIds) || courseIds.length === 0) {
        return [];
    }

    const addedItems = [];

    for (const courseId of courseIds) {
        try {
            const existingItem = await Cart.findOne({ userId, courseId });

            if (!existingItem) {
                const course = await Course.findById(courseId);

                if (course && course.published && !course.blocked) {
                    const cartItem = await Cart.create({ userId, courseId });
                    addedItems.push(cartItem);
                }
            }
        } catch (error) {
            console.error(`Error syncing course ${courseId}:`, error);
        }
    }

    return addedItems;
};

// CLEAR CART
export const clearCartService = async (userId) => {
    const result = await Cart.deleteMany({ userId });
    return result;
};
