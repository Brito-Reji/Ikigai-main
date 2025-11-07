import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { Instructor } from '../models/Instructor';
const isInstructor = asyncHandler(async (req, res, next) => {

  const accessToken = req.headers.authorization?.split(' ')[1]
  if (!accessToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
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