import asyncHandler from 'express-async-handler'
import { Course } from '../../models/Course.js'

export const getAllCourseByInstructor = asyncHandler(async (req, res) => {
    console.log(req.user)
    res.end()
})

export const createCourse = asyncHandler(async (req, res) => {
    let user = req.user

    let { title, description, overview, category, price, thumbnail, published } = req.body


    if (!title || !description || !category || !price || !thumbnail) {
        return res.status(400).json({
            success: false,
            message: "Validation Error :- required fields missing",
        });
    }

    // Not Authorized
    if (user.role != "instructor") {
        return res.status(400).json({
            success: false,
            message: "invalid role"
        })
    }

    try {
        // Create course with updated fields
        const course = await Course.create({
            title,
            description,
            overview,
            category,
            instructor: user.id,
            price,
            thumbnail,
            published: published || false
        })

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        })
    } catch (error) {

        console.error("Course creation error:", error)
        return res.status(500).json({
            success: false,
            message: "Error creating course",
            error: error.message
        })
    }
})