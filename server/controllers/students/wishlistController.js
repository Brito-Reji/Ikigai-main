import asyncHandler from "express-async-handler";
import {
    getWishlistService,
    addToWishlistService,
    removeFromWishlistService,
    toggleWishlistService
} from "../../services/student/wishlistService.js";

// get wishlist
export const getWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const courses = await getWishlistService(userId);

    res.status(200).json({
        success: true,
        message: "WISHLIST FETCHED SUCCESSFULLY",
        data: courses,
        count: courses.length
    });
});

// toggle wishlist
export const toggleWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
        res.status(400);
        throw new Error("Course ID is required");
    }

    const result = await toggleWishlistService(userId, courseId);

    res.status(200).json({
        success: true,
        message: result.action === 'added' ? "ADDED TO WISHLIST" : "REMOVED FROM WISHLIST",
        data: result
    });
});

// remove from wishlist
export const removeFromWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseId } = req.params;

    await removeFromWishlistService(userId, courseId);

    res.status(200).json({
        success: true,
        message: "REMOVED FROM WISHLIST"
    });
});
