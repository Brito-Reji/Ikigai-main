import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            // Find user and clear refresh token
            let user = await User.findOne({ refreshToken });
            if (!user) {
                user = await Instructor.findOne({ refreshToken });
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

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (err) {
        console.error("Logout error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
