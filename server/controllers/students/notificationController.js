import asyncHandler from "express-async-handler";
import { Notification } from "../../models/Notification.js";

// Get user notifications
export const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);

    res.status(200).json({
        success: true,
        message: "Notifications fetched",
        data: notifications,
    });
});

// Mark notification as read
export const markNotificationRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    await Notification.findOneAndUpdate({ _id: id, userId }, { read: true });

    res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: null,
    });
});

// Mark all as read
export const markAllRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    await Notification.updateMany({ userId, read: false }, { read: true });

    res.status(200).json({
        success: true,
        message: "All notifications marked as read",
        data: null,
    });
});
