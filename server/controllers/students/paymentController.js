import asyncHandler from "express-async-handler";
import * as paymentService from "../../services/student/paymentService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { MESSAGES } from "../../utils/messages.js";
import { AppError } from "../../errors/AppError.js";


export const createOrder = asyncHandler(async (req, res) => {
  const { courseIds, couponCode, useWallet } = req.body;
  if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    throw new AppError(
      `Valid Course IDs are required. Received: ${JSON.stringify(req.body)}`,
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const order = await paymentService.createOrderService({
    courseIds,
    userId: req.user._id,
    couponCode,
    useWallet,
  });

  console.log(order);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.PAYMENT.ORDER_CREATED,
    data: order,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new AppError("Missing payment verification details", HTTP_STATUS.BAD_REQUEST);
  }

  const isValid = paymentService.verifyPaymentService({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (isValid) {
    const result = await paymentService.updatePaymentStatusService({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.PAYMENT.VERIFIED,
      data: result,
    });
  } else {
    throw new AppError("Invalid payment signature", HTTP_STATUS.BAD_REQUEST);
  }
});

export const retryOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    throw new AppError("Order ID is required", HTTP_STATUS.BAD_REQUEST);
  }

  const order = await paymentService.retryOrderService({
    orderId,
    userId: req.user._id,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.PAYMENT.ORDER_RETRY,
    data: order,
  });
});


export const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await paymentService.getOrderHistoryService(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: orders,
  });
});

export const getPendingPayment = asyncHandler(async (req, res) => {
  const order = await paymentService.getPendingPaymentService(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: order,
  });
});

// cancel a pending order
export const cancelOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  if (!orderId) {
    throw new AppError("Order ID is required", HTTP_STATUS.BAD_REQUEST);
  }
  const result = await paymentService.cancelOrderService({
    orderId,
    userId: req.user._id,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Order cancelled",
    data: result,
  });
});
