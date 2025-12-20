import asyncHandler from "express-async-handler";
import * as paymentService from "../../services/student/paymentService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { MESSAGES } from "../../utils/messages.js";


export const createOrder = asyncHandler(async (req, res) => {
  const { courseIds } = req.body;
  console.log("createOrder payload:", JSON.stringify(req.body, null, 2));

  if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error(`Valid Course IDs are required. Received: ${JSON.stringify(req.body)}`);
  }

  // logic is delegated to the service layer
  console.log(req.user._id);
  const order = await paymentService.createOrderService({ courseIds, userId: req.user._id });
  console.log("order->", order.razorpayOrderId);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: MESSAGES.PAYMENT.ORDER_CREATED,
    data: order
  });
});


export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;
  console.log("verifyPayment payload:", JSON.stringify(req.body, null, 2));

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Missing payment verification details");
  }

  const isValid = paymentService.verifyPaymentService({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  });

  if (isValid) {
    const result = await paymentService.updatePaymentStatusService({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    });

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.PAYMENT.VERIFIED,
      data: result
    });
  } else {
    res.status(HTTP_STATUS.BAD_REQUEST);
    throw new Error("Invalid payment signature");
  }
});