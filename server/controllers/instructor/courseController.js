import asyncHandler from 'express-async-handler'

export const getAllCourseByInstructor = asyncHandler(async (req, res) => {
    console.log(req.user)
    res.end()
})