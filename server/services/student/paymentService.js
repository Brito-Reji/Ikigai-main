import razorpayInstance from "../../config/razorpayConfig.js";
import crypto from "crypto";
import { Course } from "../../models/Course.js";
import { Payment } from "../../models/Payment.js";
import { Order } from "../../models/Order.js";

export const createOrderService = async ({ courseIds, userId }) => {
  const courses = await Course.find({
    _id: { $in: courseIds },
    published: true
  });


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

  const razorpayOrder = await razorpayInstance.orders.create(options);

  console.log(userId);

  await Order.create({
    userId,
    courseIds: courseIds,
    razorpayOrderId: razorpayOrder.id,
    amount,
    status: "CREATED"
  });

  const paymentsData = courses.map((course) => ({
    courseId: course._id,
    userId,
    razorpayOrderId: razorpayOrder.id,
    amount: course.price,
    status: "CREATED"
  }));

  await Payment.insertMany(paymentsData);

  return {
    razorpayOrderId: razorpayOrder.id,
    amount,
    currency: "INR",
    message: "Order created successfully"
  };
};



export const verifyPaymentService = ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
}) => {

  console.log("verifyPaymentService hit");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");



  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  return true;
};

export const updatePaymentStatusService = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {

  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = "PAID";
  await order.save();

 await Payment.updateMany(
    { razorpayOrderId: razorpay_order_id },
    { 
      status: "PAID",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature
    }
  );


  return { paymentId: razorpay_payment_id };
};