import razorpayInstance from "../../config/razorpayConfig.js";
import { Payment } from "../../models/Payment.js";
import { Order } from "../../models/Order.js";
import { decrementCouponUsageService } from "./couponService.js";

export const processFullRefund = async ({
  razorpayOrderId,
  userId,
  reason = "Customer request",
}) => {
  const order = await Order.findOne({ razorpayOrderId, userId });

  if (!order) {
    throw new Error("Order not found");
  }

  if (order.status === "REFUNDED") {
    throw new Error("Order already refunded");
  }

  const payments = await Payment.find({ razorpayOrderId, userId });

  if (!payments || payments.length === 0) {
    throw new Error("No payments found for this order");
  }

  // check if already refunded
  const alreadyRefunded = payments.every(p => p.status === "REFUNDED");
  if (alreadyRefunded) {
    throw new Error("All payments already refunded");
  }

  // razorpay full refund
  try {
    const refund = await razorpayInstance.payments.refund(
      payments[0].razorpayPaymentId,
      {
        amount: Math.round(order.amount * 100),
        notes: { reason },
      }
    );

    order.status = "REFUNDED";
    await order.save();

    await Payment.updateMany(
      { razorpayOrderId, userId },
      {
        status: "REFUNDED",
        razorpayRefundId: refund.id,
        refundedAt: new Date(),
      }
    );

    // decrement coupon usage so user can reuse coupon
    if (order.couponId) {
      await decrementCouponUsageService(order.couponId, order.userId);
    }

    return {
      success: true,
      refundId: refund.id,
      amount: order.amount,
      message: "Full refund processed successfully",
    };
  } catch (error) {
    console.error("Razorpay refund error:", error);
    throw new Error(`Refund failed: ${error.message}`);
  }
};

export const processPartialRefund = async ({
  courseId,
  userId,
  razorpayOrderId,
  reason = "Customer request",
}) => {
  const payment = await Payment.findOne({ courseId, userId, razorpayOrderId });

  if (!payment) {
    throw new Error("Payment not found for this course");
  }

  if (payment.status === "REFUNDED") {
    throw new Error("This course payment is already refunded");
  }

  // get order to check coupon details
  const order = await Order.findOne({ razorpayOrderId, userId });
  if (!order) {
    throw new Error("Order not found");
  }

  // calculate refund amount (proportional if coupon was used)
  let refundAmount = payment.amount;

  if (
    order.discountAmount &&
    order.discountAmount > 0 &&
    order.originalAmount
  ) {
    // proportional discount = (coursePrice / originalTotal) * totalDiscount
    const courseProportionalDiscount = Math.round(
      (payment.amount / order.originalAmount) * order.discountAmount
    );
    refundAmount = payment.amount - courseProportionalDiscount;
  }

  // ensure refund is not negative
  refundAmount = Math.max(0, refundAmount);

  try {
    const refund = await razorpayInstance.payments.refund(
      payment.razorpayPaymentId,
      {
        amount: Math.round(refundAmount * 100), // razorpay expects paise
        notes: { reason, courseId: payment.courseId.toString() },
      }
    );

    payment.status = "REFUNDED";
    payment.razorpayRefundId = refund.id;
    payment.refundedAt = new Date();
    payment.refundAmount = refundAmount; // store actual refunded amount
    await payment.save();

    const remainingPayments = await Payment.find({
      razorpayOrderId,
      userId,
      status: { $ne: "REFUNDED" },
    });

    // if all courses refunded, mark order as refunded and restore coupon usage
    if (remainingPayments.length === 0) {
      await Order.findOneAndUpdate(
        { razorpayOrderId, userId },
        { status: "REFUNDED" }
      );

      // restore coupon usage only when full order is refunded
      if (order.couponId) {
        await decrementCouponUsageService(order.couponId, order.userId);
      }
    }

    return {
      success: true,
      refundId: refund.id,
      originalPrice: payment.amount,
      discountApplied: payment.amount - refundAmount,
      refundAmount: refundAmount,
      courseId: payment.courseId,
      message: "Partial refund processed successfully",
    };
  } catch (error) {
    console.error("Razorpay refund error:", error);
    throw new Error(`Refund failed: ${error.message}`);
  }
};

export const getRefundHistory = async ({ userId, razorpayOrderId }) => {
  const query = { userId, status: "REFUNDED" };
  if (razorpayOrderId) {
    query.razorpayOrderId = razorpayOrderId;
  }

  const refundedPayments = await Payment.find(query)
    .populate("courseId", "title price")
    .sort({ refundedAt: -1 });

  return refundedPayments.map(payment => ({
    courseId: payment.courseId._id,
    courseTitle: payment.courseId.title,
    amount: payment.amount,
    razorpayRefundId: payment.razorpayRefundId,
    refundedAt: payment.refundedAt,
    razorpayOrderId: payment.razorpayOrderId,
  }));
};
