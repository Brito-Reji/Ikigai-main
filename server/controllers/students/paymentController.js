
import asyncHandler from 'express-async-handler';
import * as paymentService from '../../services/student/paymentService.js';


export const createOrder = asyncHandler(async (req, res) => {
  const { courseIds } = req.body;
  console.log("createOrder payload:", JSON.stringify(req.body, null, 2));

  if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
    res.status(400);
    throw new Error(`Valid Course IDs are required. Received: ${JSON.stringify(req.body)}`);
  }

  // logic is delegated to the service layer
  console.log(req.user._id);
  const order = await paymentService.createOrderService({ courseIds, userId: req.user._id });

  res.status(200).json({
    success: true,
    message: "Order created successfully",
    data: order
  });
});


export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  // console.log("verifyPayment payload:", JSON.stringify(req.body, null, 2));

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    res.status(400);
    throw new Error("Missing payment verification details");
  }

  // logic is delegated to the service layer
 
  const isValid = paymentService.verifyPaymentService(
    {razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature}
  );

  if (isValid) {
    // TODO: Perform database operations here (e.g., set order status to 'paid')

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: { paymentId: razorpayPaymentId }
    });
  } else {
    res.status(400);
    throw new Error("Invalid payment signature");
  }
});