import asyncHandler from 'express-async-handler';
import {
  getCartService,
  addToCartService,
  removeFromCartService,
  syncCartService,
  clearCartService,
} from '../../services/student/cartService.js';
import { HTTP_STATUS } from '../../utils/httpStatus.js';
import { MESSAGES } from '../../utils/messages.js';

// get cart
export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const courses = await getCartService(userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART.FETCHED,
    data: courses,
    count: courses.length,
  });
});

// add to cart
export const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  if (!courseId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error(MESSAGES.CART.COURSE_ID_REQUIRED);
  }

  const courses = await addToCartService(userId, courseId);

  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: MESSAGES.CART.ADDED,
    data: courses,
    count: courses.length,
  });
});

// remove from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  await removeFromCartService(userId, courseId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART.REMOVED,
  });
});

// sync guest cart
export const syncCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courseIds } = req.body;

  if (!Array.isArray(courseIds)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error('courseIds must be an array');
  }

  const courses = await syncCartService(userId, courseIds);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART.SYNCED,
    data: courses,
    count: courses.length,
  });
});

// clear cart
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  await clearCartService(userId);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.CART.CLEARED,
  });
});
