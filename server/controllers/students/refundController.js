import asyncHandler from "express-async-handler";
import * as refundService from "../../services/student/refundService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const fullRefund = asyncHandler(async (req, res) => {
  const { razorpayOrderId, reason, refundMethod } = req.body;
  const userId = req.user._id;

  if (!razorpayOrderId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Razorpay Order ID is required");
  }

  const result = await refundService.processFullRefund({
    razorpayOrderId,
    userId,
    reason,
    refundMethod,
  });

  res.status(HTTP_STATUS.OK).json(result);
});

export const partialRefund = asyncHandler(async (req, res) => {
  const { courseId, razorpayOrderId, reason, refundMethod } = req.body;
  const userId = req.user._id;

  if (!courseId || !razorpayOrderId) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Course ID and Razorpay Order ID are required");
  }

  const result = await refundService.processPartialRefund({
    courseId,
    userId,
    razorpayOrderId,
    reason,
    refundMethod,
  });

  res.status(HTTP_STATUS.OK).json(result);
});

export const refundHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { razorpayOrderId } = req.query;

  const history = await refundService.getRefundHistory({
    userId,
    razorpayOrderId,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: history,
  });
});
