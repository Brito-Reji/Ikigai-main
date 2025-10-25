import asyncHandler from 'express-async-handler'
import { Course } from '../models/Course.js'


const getAllCourse = asyncHandler(async (req, res) => {
    let courses = await Course.find()
    
})