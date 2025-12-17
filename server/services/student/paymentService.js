import razorpayInstance from "../../config/razorpayConfig.js";
import crypto from "crypto";
import { Course } from "../../models/Course.js";
import { Payment } from "../../models/Payment.js";

export const createOrderService = async ({ courseIds, userId }) => {
  const courses = await Course.find({
    _id: { $in: courseIds },
    published: true
  });

  console.log(`Found ${courses.length} courses for IDs: ${courseIds}`);

  if (courses.length !== courseIds.length) {
    throw new Error("One or more courses are not published");
  }

  // TODO: implement discount logic
  // TODO: implement coupon logic
  // TODO: implement the already purchased courses check

  const amount = courses.reduce((total, course) => total + course.price, 0);

  const options = {
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const order = await razorpayInstance.orders.create(options);
  await Payment.create({
    userId,
    courseIds,
    amount,
    razorpayOrderId: order.id,
    status: "PENDING",
  })
  return order;

};



export const verifyPaymentService = ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (expectedSignature !== razorpaySignature) {
    throw new Error("Invalid payment signature");
  }

  return true;
};