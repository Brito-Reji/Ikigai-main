import asyncHandler from "express-async-handler";
import {
    getCartService,
    addToCartService,
    removeFromCartService,
    syncCartService,
    clearCartService
} from "../../services/student/cartService.js";

// GET CART
export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const cartItems = await getCartService(userId);

    res.status(200).json({
        success: true,
        message: "CART FETCHED SUCCESSFULLY",
        data: cartItems,
        count: cartItems.length
    });
});

// ADD TO CART
export const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
        res.status(400);
        throw new Error("Course ID is required");
    }

    const cartItem = await addToCartService(userId, courseId);

    res.status(201).json({
        success: true,
        message: "COURSE ADDED TO CART",
        data: cartItem
    });
});

// REMOVE FROM CART
export const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseId } = req.params;

    await removeFromCartService(userId, courseId);

    res.status(200).json({
        success: true,
        message: "COURSE REMOVED FROM CART"
    });
});

// SYNC GUEST CART
export const syncCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { courseIds } = req.body;

    if (!Array.isArray(courseIds)) {
        res.status(400);
        throw new Error("courseIds must be an array");
    }

    const addedItems = await syncCartService(userId, courseIds);

    res.status(200).json({
        success: true,
        message: "CART SYNCED SUCCESSFULLY",
        data: addedItems,
        count: addedItems.length
    });
});

// CLEAR CART
export const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await clearCartService(userId);

    res.status(200).json({
        success: true,
        message: "CART CLEARED SUCCESSFULLY"
    });
});
