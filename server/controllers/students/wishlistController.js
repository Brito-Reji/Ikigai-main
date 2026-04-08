import asyncHandler from "express-async-handler";
import {
  getWishlistService,

  toggleWishlistService,
} from "../../services/student/wishlistService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { MESSAGES } from "../../utils/messages.js";
import { AppError } from "../../errors/AppError.js";

// get wishlist
export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const courses = await getWishlistService(userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.WISHLIST.FETCHED,
    data: courses,
    count: courses.length,
  });
});

// toggle wishlist
export const toggleWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  if (!courseId) {
    throw new AppError(MESSAGES.CART.COURSE_ID_REQUIRED, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await toggleWishlistService(userId, courseId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message:
      result.action === "added"
        ? MESSAGES.WISHLIST.ADDED
        : MESSAGES.WISHLIST.REMOVED,
    data: result,
  });
});

