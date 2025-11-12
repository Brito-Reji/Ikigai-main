import asyncHandler from 'express-async-handler';
import { User } from '../../models/User.js';
import { Instructor } from '../../models/Instructor.js';

export const checkUsernameAvailabilty = asyncHandler(async (req, res) => {
    try {
        const { username, email, role } = req.query;

        if (!username && !email) {
            return res.status(400).json({
                success: false,
                message: "Username or email is required",
            });
        }

        const Model = role === "instructor" ? Instructor : User;
        const query = {};

        if (username) query.username = username;
        if (email) query.email = email;

        const existingUser = await Model.findOne(query);

        if (existingUser) {
            const field = username ? "username" : "email";
            return res.status(200).json({
                success: true,
                available: false,
                message: `This ${field} is already taken`,
            });
        }

        return res.status(200).json({
            success: true,
            available: true,
            message: "Available",
        });
    } catch (error) {
        console.error("Availability check error:", error);
        return res.status(500).json({
            success: false,
            message: "Error checking availability",
        });
    }
})

