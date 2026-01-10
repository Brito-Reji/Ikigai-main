import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";
import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { Admin } from "../../models/Admin.js";

export const logout = asyncHandler(async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            // Find user and clear refresh token
            let user = await User.findOne({ refreshToken });
            if (!user) {
                user = await Instructor.findOne({ refreshToken });
            }
            if (!user) {
                user = Admin.findOne({refreshToken})
            }

            if (user) {
                user.refreshToken = null;
                await user.save({ validateBeforeSave: false });
            }
        }
        // Clear cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
});
