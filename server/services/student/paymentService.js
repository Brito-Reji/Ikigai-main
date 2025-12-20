import razorpayInstance from "../../config/razorpayConfig.js";
import crypto from "crypto";
import { Course } from "../../models/Course.js";
import { Payment } from "../../models/Payment.js";
import { Order } from "../../models/Order.js";

export const createOrderService = async ({ courseIds, userId,couponId }) => {
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

  const razorpayOrder = await razorpayInstance.orders.create(options);

  const payment = await Payment.create({
    userId,
    amount,
    razorpayOrderId: razorpayOrder.id,
    status: "PENDING",
  })

  const orders = await Order.insertMany(
    courses.map((course) => ({
      userId,
      courseId: course._id,
      paymentId: payment._id,
      amount: course.price,
      currency: "INR",
      status: "CREATED",
    }))
  );
  let eachPrice = courses.reduce((total, course) => total + course.price, 0)/courses.length;
  payment.orders = orders.map(o => { return {courseId:o._id,itemCost:eachPrice}});
  await payment.save();

  return {
    razorpayOrderId: razorpayOrder.id,
    amount,
    currency: "INR",
    message: "Order created successfully",
  };


};



export const verifyPaymentService = ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
}) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  console.log("Expected signature:", expectedSignature);
  console.log("Razorpay signature:", razorpay_signature);

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  return true;
};

export const updatePaymentStatusService = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  console.log("payment verified");

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

  if (!payment) {
    throw new Error("Payment not found");
  }

  payment.status = "SUCCESS";
  payment.razorpayPaymentId = razorpay_payment_id;
  payment.razorpaySignature = razorpay_signature;
  await payment.save();

  const orders = await Order.updateMany(
    { paymentId: payment._id },
    { status: "PAID" }
  );

  console.log("orders->", orders);

  return { paymentId: razorpay_payment_id };
};