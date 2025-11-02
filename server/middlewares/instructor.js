import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { Instructor } from '../models/Instructor';
const isInstructor = asyncHandler(async (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== 'instructor') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  let user = await Instructor.findById(decoded.id)
  if(user.isBlocked){
    return res.status(401).json({ message: 'Account is blocked' });
  }
  next();
})

export default isInstructor;