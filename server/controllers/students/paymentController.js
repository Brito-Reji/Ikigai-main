
import asyncHandler from 'express-async-handler';
import * as paymentService from '../../services/student/paymentService.js';


export const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) {
    res.status(400);
    throw new Error("Amount is required");
  }

  // logic is delegated to the service layer
  const order = await paymentService.createOrderService(amount);

  res.status(200).json({
    success: true,
    message: "Order created successfully",
    data: order
  });
});


export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    res.status(400);
    throw new Error("Missing payment verification details");
  }

  // logic is delegated to the service layer
  const isValid = paymentService.verifyPaymentService(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  );

  if (isValid) {
    // TODO: Perform database operations here (e.g., set order status to 'paid')
    
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      data: { paymentId: razorpay_payment_id }
    });
  } else {
    res.status(400);
    throw new Error("Invalid payment signature");
  }
});