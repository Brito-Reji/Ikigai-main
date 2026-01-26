import razorpayInstance from "../../config/razorpayConfig.js";
import crypto from "crypto";
import { Course } from "../../models/Course.js";
import { Payment } from "../../models/Payment.js";
import { Order } from "../../models/Order.js";
import { Cart } from "../../models/Cart.js";
import { Wishlist } from "../../models/Wishlist.js";
import { Enrollment } from "../../models/Enrollment.js";
import {
  validateCouponService,
  incrementCouponUsageService,
} from "./couponService.js";

export const createOrderService = async ({ courseIds, userId, couponCode }) => {
  const courses = await Course.find({
    _id: { $in: courseIds },
    published: true,
  });

  if (courses.length !== courseIds.length) {
    throw new Error("One or more courses are not published");
  }

  const originalAmount = courses.reduce(
    (total, course) => total + course.price,
    0
  );

  let discountAmount = 0;
  let couponId = null;
  let appliedCouponCode = null;

  // validate and apply coupon
  if (couponCode) {
    const couponData = await validateCouponService(
      couponCode,
      userId,
      originalAmount
    );
    discountAmount = couponData.discountAmount;
    couponId = couponData.couponId;
    appliedCouponCode = couponData.code;
  }

  const finalAmount = originalAmount - discountAmount;

  const options = {
    amount: Math.round(finalAmount),
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  const razorpayOrder = await razorpayInstance.orders.create(options);

  await Order.create({
    userId,
    courseIds: courseIds,
    razorpayOrderId: razorpayOrder.id,
    amount: finalAmount,
    originalAmount,
    discountAmount,
    couponCode: appliedCouponCode,
    couponId,
    status: "CREATED",
  });

  const paymentsData = courses.map(course => ({
    courseId: course._id,
    userId,
    razorpayOrderId: razorpayOrder.id,
    amount: course.price,
    status: "CREATED",
  }));

  await Payment.insertMany(paymentsData);

  return {
    razorpayOrderId: razorpayOrder.id,
    amount: finalAmount,
    originalAmount,
    discountAmount,
    couponCode: appliedCouponCode,
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

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  return true;
};

export const updatePaymentStatusService = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = "PAID";
  await order.save();

  // increment coupon usage
  if (order.couponId) {
    await incrementCouponUsageService(order.couponId, order.userId);
  }

  await Payment.updateMany(
    { razorpayOrderId: razorpay_order_id },
    {
      status: "PAID",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      releaseStatus: "HELD",
    }
  );
  // clear cart and wishlist
  await Cart.find({ userId: order.userId, courses: { $in: order.courseIds } });

  for (const courseId of order.courseIds) {
    await Enrollment.create({
      user: order.userId,
      course: courseId,
      payment: order._id,
      status: "active",
    });
  }

  await Cart.updateMany(
    { userId: order.userId, courses: { $in: order.courseIds } },
    { $pull: { courses: { $in: order.courseIds } } }
  );
  await Wishlist.updateMany(
    { userId: order.userId, courses: { $in: order.courseIds } },
    { $pull: { courses: { $in: order.courseIds } } }
  );
  let enrolledDetails = await Order.findOne({
    razorpayOrderId: razorpay_order_id,
  }).populate({
    path: "courseIds",
    select: "title price thumbnail instructor",
    populate: {
      path: "instructor",
      select: "firstName lastName",
    },
  });

  return { paymentId: razorpay_payment_id, enrolledDetails };
};

export const getOrderHistoryService = async userId => {
  const orders = await Order.find({
    userId,
    status: { $in: ["PAID", "REFUNDED"] },
  })
    .populate({
      path: "courseIds",
      select: "title price thumbnail",
    })
    .populate({
      path: "couponId",
      select: "code discountType discountValue",
    })
    .sort({ createdAt: -1 });

  // get payment details for each order
  const ordersWithPayments = await Promise.all(
    orders.map(async order => {
      const payments = await Payment.find({
        razorpayOrderId: order.razorpayOrderId,
        userId,
      }).select("courseId status refundAmount refundedAt");

      return {
        ...order.toObject(),
        payments,
      };
    })
  );

  return ordersWithPayments;
};
