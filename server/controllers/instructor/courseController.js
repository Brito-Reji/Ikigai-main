import asyncHandler from 'express-async-handler'
import { Course } from '../../models/Course.js'

export const getAllCourseByInstructor = asyncHandler(async (req, res) => {
    console.log(req.user)
    res.end()
})

export const createCourse = asyncHandler(async (req, res) => {
    let user = req.user
    let { title, subtitle, description, overview, keyLearning, categery, price, language, thumbnail } = req.body
// Validation error
    if (!title, !subtitle, !description, !overview, !keyLearning, !categery, !price, !language, !thumbnail) {
           return res.status(400).json({
             success: false,
             message: "Validation Error :- required all fields",
           });
    }
// Not Authorized
    if (user.role != "instructor") {
       return res.status(400).json({
            success: false,
            message:"invalid role"
        })
    }

try {
    await Course.create({
        title,subtitle,description,overview,keyLearning,categoryId,price,language,thumbnail
    })
} catch (error) {
    
}
   
    

})