import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
const isInstructor = asyncHandler(async (req, res, next) => {

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.role !== 'instructor') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
})

export default isInstructor;