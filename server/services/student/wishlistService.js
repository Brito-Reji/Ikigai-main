import { Wishlist } from "../../models/Wishlist.js";
import { Course } from "../../models/Course.js";

export const getWishlistService = async (userId) => {
    const wishlistItems = await Wishlist.find({ userId })
        .populate({
            path: 'courseId',
            select: 'title description price thumbnail instructor category rating students',
            populate: [
                { path: 'instructor', select: 'firstName lastName' },
                { path: 'category', select: 'name' }
            ]
        })
        .sort({ createdAt: -1 });

    return wishlistItems;
};

export const addToWishlistService = async (userId, courseId) => {
    const existingItem = await Wishlist.findOne({ userId, courseId });

    if (existingItem) {
        return existingItem;
    }

    const course = await Course.findById(courseId);
    if (!course) {
        throw new Error("Course not found");
    }

    const wishlistItem = await Wishlist.create({ userId, courseId });
    return wishlistItem;
};

export const removeFromWishlistService = async (userId, courseId) => {
    const result = await Wishlist.findOneAndDelete({ userId, courseId });

    if (!result) {
        throw new Error("Item not found in wishlist");
    }

    return result;
};

export const toggleWishlistService = async (userId, courseId) => {
    const existingItem = await Wishlist.findOne({ userId, courseId });

    if (existingItem) {
        await Wishlist.findOneAndDelete({ userId, courseId });
        return { action: 'removed', inWishlist: false };
    } else {
        const course = await Course.findById(courseId);
        if (!course) {
            throw new Error("Course not found");
        }
        await Wishlist.create({ userId, courseId });
        return { action: 'added', inWishlist: true };
    }
};
