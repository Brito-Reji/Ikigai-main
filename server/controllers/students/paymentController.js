import asyncHandler from "express-async-handler";
import * as paymentService from "../../services/student/paymentService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { MESSAGES } from "../../utils/messages.js";

export const createOrder = asyncHandler(async (req, res) => {
  const { courseIds, couponCode } = req.body;
  if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error(
      `Valid Course IDs are required. Received: ${JSON.stringify(req.body)}`
    );
  }

  const order = await paymentService.createOrderService({
    courseIds,
    userId: req.user._id,
    couponCode,
  });
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
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Missing payment verification details");
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
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Invalid payment signature");
  }
});

export const getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await paymentService.getOrderHistoryService(req.user._id);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    data: orders,
  });
});
