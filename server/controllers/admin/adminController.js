import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
export const adminLogin = asyncHandler(async (req,res) => {
    let { username, password } = req.body

    
})