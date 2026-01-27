import { Payment } from "../../models/Payment.js";
import { Order } from "../../models/Order.js";
import { Enrollment } from "../../models/Enrollment.js";
import { decrementCouponUsageService } from "./couponService.js";
import { creditWallet } from "./walletService.js";
import razorpayInstance from "../../config/razorpayConfig.js";

export const processFullRefund = async ({
  razorpayOrderId,
  userId,
  reason = "Customer request",
  refundMethod = "wallet", // wallet or bank
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

  const alreadyRefunded = payments.every(p => p.status === "REFUNDED");
  if (alreadyRefunded) {
    throw new Error("All payments already refunded");
  }

  try {
    const baseAmount = Math.round(order.amount);
    // wallet = 100%, bank = 80%
    const refundAmount = refundMethod === "bank" 
      ? Math.round(baseAmount * 0.8) 
      : baseAmount;

    if (refundMethod === "bank") {
      // razorpay refund
      const refund = await razorpayInstance.payments.refund(
        payments[0].razorpayPaymentId,
        {
          amount: refundAmount,
          notes: { reason },
        }
      );

      await Payment.updateMany(
        { razorpayOrderId, userId },
        {
          status: "REFUNDED",
          razorpayRefundId: refund.id,
          refundedAt: new Date(),
          refundAmount,
          refundMethod: "bank",
        }
      );
    } else {
      // wallet refund
      await creditWallet({
        userId,
        amount: refundAmount,
        reason: `Full refund for order`,
        relatedOrderId: order._id,
      });

      await Payment.updateMany(
        { razorpayOrderId, userId },
        {
          status: "REFUNDED",
          refundedAt: new Date(),
          refundAmount,
          refundMethod: "wallet",
        }
      );
    }

    order.status = "REFUNDED";
    await order.save();

    await Enrollment.updateMany(
      { user: userId, course: { $in: order.courseIds } },
      { status: "refunded" }
    );

    if (order.couponId) {
      await decrementCouponUsageService(order.couponId, order.userId);
    }

    return {
      success: true,
      originalAmount: baseAmount,
      refundAmount,
      refundMethod,
      message: refundMethod === "bank" 
        ? "Refund of 80% processed to bank (5-7 days)" 
        : "Full refund credited to wallet",
    };
  } catch (error) {
    console.error("Refund error:", error);
    const errorMessage = error?.error?.description || error?.message || "Unknown error";
    throw new Error(`Refund failed: ${errorMessage}`);
  }
};

export const processPartialRefund = async ({
  courseId,
  userId,
  razorpayOrderId,
  reason = "Customer request",
  refundMethod = "wallet", // wallet or bank
}) => {
  const payment = await Payment.findOne({ courseId, userId, razorpayOrderId });

  if (!payment) {
    throw new Error("Payment not found for this course");
  }

  if (payment.status === "REFUNDED") {
    throw new Error("This course payment is already refunded");
  }

  const order = await Order.findOne({ razorpayOrderId, userId });
  if (!order) {
    throw new Error("Order not found");
  }

  // calculate base refund amount
  let baseRefundAmount;
  const coursePrice = payment.amount;

  if (order.originalAmount && order.originalAmount !== order.amount) {
    baseRefundAmount = Math.round(
      (coursePrice / order.originalAmount) * order.amount
    );
  } else {
    baseRefundAmount = coursePrice;
  }

  baseRefundAmount = Math.max(1, baseRefundAmount);

  // wallet = 100%, bank = 80%
  const refundAmount = refundMethod === "bank" 
    ? Math.round(baseRefundAmount * 0.8) 
    : baseRefundAmount;

  try {
    if (refundMethod === "bank") {
      // razorpay refund
      const refund = await razorpayInstance.payments.refund(
        payment.razorpayPaymentId,
        {
          amount: refundAmount,
          notes: { reason, courseId: payment.courseId.toString() },
        }
      );

      payment.razorpayRefundId = refund.id;
      payment.refundMethod = "bank";
    } else {
      // wallet refund
      await creditWallet({
        userId,
        amount: refundAmount,
        reason: `Refund for course`,
        relatedPaymentId: payment._id,
        relatedOrderId: order._id,
      });
      payment.refundMethod = "wallet";
    }

    payment.status = "REFUNDED";
    payment.refundedAt = new Date();
    payment.refundAmount = refundAmount;
    await payment.save();

    await Enrollment.findOneAndUpdate(
      { user: userId, course: courseId },
      { status: "refunded" }
    );

    const remainingPayments = await Payment.find({
      razorpayOrderId,
      userId,
      status: { $ne: "REFUNDED" },
    });

    if (remainingPayments.length === 0) {
      await Order.findOneAndUpdate(
        { razorpayOrderId, userId },
        { status: "REFUNDED" }
      );

      if (order.couponId) {
        await decrementCouponUsageService(order.couponId, order.userId);
      }
    }

    return {
      success: true,
      originalPrice: payment.amount,
      baseRefundAmount,
      refundAmount,
      refundMethod,
      courseId: payment.courseId,
      message: refundMethod === "bank" 
        ? "Refund of 80% processed to bank (5-7 days)" 
        : "Full refund credited to wallet",
    };
  } catch (error) {
    console.error("Refund error:", error);
    const errorMessage = error?.error?.description || error?.message || "Unknown error";
    throw new Error(`Refund failed: ${errorMessage}`);
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
