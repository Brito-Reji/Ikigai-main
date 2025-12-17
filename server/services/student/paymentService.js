import razorpayInstance from "../../config/razorpayConfig.js";
import crypto from "crypto";

export const createOrderService = async (amount, currency = 'INR') => {
  const options = {
    amount: amount * 100,
    currency,
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    throw new Error(error.error ? error.error.description : 'Error creating Razorpay order');
  }
};


export const verifyPaymentService = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest('hex');

  if (generatedSignature !== razorpaySignature) {
    throw new Error('Invalid payment signature');
  }

  return true;  
};