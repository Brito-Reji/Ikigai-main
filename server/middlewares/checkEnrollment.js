import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
export const isLoggedIn = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
     logger.error(error);
      return next();
    }
  }
};
