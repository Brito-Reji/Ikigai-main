// import { User } from "lucide-react";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";

const isStudent = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  let user = await User.findById(decoded.id)
  if(user.isBlocked){
    return res.status(401).json({ message: 'Account is blocked' });
  }
  if (decoded.role !== 'student') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export default isStudent;