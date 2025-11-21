import asyncHandler from 'express-async-handler'
import { Course } from '../../models/Course.js'
import { Category } from '../../models/Category.js'

export const getAllCourseByInstructor = asyncHandler(async (req, res) => {
    try {
        const instructorId = req.user.id;
        console.log('Fetching courses for instructor:', instructorId);

        const courses = await Course.find({ instructor: instructorId })
            .populate('category', 'name')
            .populate('instructor', 'name email')
            .sort({ createdAt: -1 });

        console.log('Found courses:', courses.length);

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully",
            data: courses
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching courses",
            error: error.message
        });
    }
})

export const createCourse = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        let { title, description, overview, category, price, thumbnail, published } = req.body;

        console.log('Creating course for instructor:', user.id);
        console.log('Course data:', { title, category, price, published });

        // Validation
        if (!title || !description || !overview || !category || !price) {
            return res.status(400).json({
                success: false,
                message: "All required fields must be provided",
            });
        }

        // Validate title length
        if (title.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Title cannot be empty",
            });
        }

        if (title.length > 200) {
            return res.status(400).json({
                success: false,
                message: "Title cannot exceed 200 characters",
            });
        }

        // Validate description length
        if (description.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Description cannot be empty",
            });
        }

        if (description.length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Description cannot exceed 2000 characters",
            });
        }

        // Validate overview length
        if (overview.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Overview cannot be empty",
            });
        }

        if (overview.length > 1000) {
            return res.status(400).json({
                success: false,
                message: "Overview cannot exceed 1000 characters",
            });
        }

        // Validate price
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a valid positive number",
            });
        }

        // Create course
        const course = await Course.create({
            title: title.trim(),
            description: description.trim(),
            overview: overview.trim(),
            category,
            instructor: user.id,
            price: numericPrice,
            thumbnail: thumbnail || '',
            published: published || false
        });

        console.log('Course created successfully:', course._id);

        // Populate the created course with category and instructor details
        const populatedCourse = await Course.findById(course._id)
            .populate('category', 'name')
            .populate('instructor', 'name email');

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: populatedCourse
        });

    } catch (error) {
        console.error("Course creation error:", error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors
            });
        }

        return res.status(500).json({
            success: false,
            message: "Error creating course",
            error: error.message
        });
    }
})