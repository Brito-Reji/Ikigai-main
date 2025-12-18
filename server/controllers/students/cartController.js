import asyncHandler from "express-async-handler";
import {
    getCartService,
    addToCartService,
    removeFromCartService,
    syncCartService,
    clearCartService
} from "../../services/student/cartService.js";

// get cart
export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const courses = await getCartService(userId);

    res.status(200).json({
        success: true,
        message: "CART FETCHED SUCCESSFULLY",
        data: courses,
        count: courses.length
    });
});

// add to cart
export const addToCart = asyncHandler(async (req, res) => {
    console.log("=== ADD TO CART REQUEST ===");
    console.log("User:", req.user?._id);
    console.log("Body:", req.body);

    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
        res.status(400);
        throw new Error("Course ID is required");
    }

    const courses = await addToCartService(userId, courseId);

    res.status(201).json({
        success: true,
        message: "COURSE ADDED TO CART",
        data: courses,
        count: courses.length
    });
});

// remove from cart
export const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseId } = req.params;

    await removeFromCartService(userId, courseId);

    res.status(200).json({
        success: true,
        message: "COURSE REMOVED FROM CART"
    });
});

// sync guest cart
export const syncCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseIds } = req.body;

    if (!Array.isArray(courseIds)) {
        res.status(400);
        throw new Error("courseIds must be an array");
    }

    const courses = await syncCartService(userId, courseIds);

    res.status(200).json({
        success: true,
        message: "CART SYNCED SUCCESSFULLY",
        data: courses,
        count: courses.length
    });
});

// clear cart
export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await clearCartService(userId);

    res.status(200).json({
        success: true,
        message: "CART CLEARED SUCCESSFULLY"
    });
});
