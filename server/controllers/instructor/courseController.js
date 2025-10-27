import asyncHandler from 'express-async-handler'
import { Course } from '../../models/Course.js'

export const getAllCourseByInstructor = asyncHandler(async (req, res) => {
    console.log(req.user)
    res.end()
})

export const createCourse = asyncHandler(async (req, res) => {
    let user = req.user
    // CHANGE: Changed 'categery' to 'categoryId'
    let { title, subtitle, description, overview, keyLearning, categoryId, price, language, thumbnail } = req.body
    
    // Validation error
    // CHANGE: Changed validation condition to use || instead of comma
    // CHANGE: Changed 'categery' to 'categoryId'
    if (!title || !subtitle || !description || !overview || !keyLearning || !categoryId || !price || !language || !thumbnail) {
        return res.status(400).json({
            success: false,
            message: "Validation Error :- required all fields",
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
        // CHANGE: Added instructorId, fixed variable names, and added response
        const course = await Course.create({
            title,
            subtitle,
            description,
            overview,
            keyLearning,
            categoryId,   
            instructorId: user.id,  
            price,
            language,
            thumbnail
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