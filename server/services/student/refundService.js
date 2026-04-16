import { Payment } from "../../models/Payment.js";
import { Order } from "../../models/Order.js";
import { Enrollment } from "../../models/Enrollment.js";
import { decrementCouponUsageService } from "./couponService.js";
import { creditWallet } from "./walletService.js";
import razorpayInstance from "../../config/razorpayConfig.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import { AppError } from "../../errors/AppError.js";

export const processFullRefund = async ({
  razorpayOrderId,
  userId,
  reason = "Customer request",
  refundMethod = "wallet",
}) => {
  const order = await Order.findOne({ razorpayOrderId, userId });

  if (!order) {
    throw new AppError("Order not found",HTTP_STATUS.NOT_FOUND);
  }

  if (order.status === "REFUNDED") {
    throw new AppError("Order already refunded",HTTP_STATUS.BAD_REQUEST);
  }

  const payments = await Payment.find({ razorpayOrderId, userId });

  if (!payments || payments.length === 0) {
    throw new AppError("No payments found for this order",HTTP_STATUS.NOT_FOUND);
  }

  const alreadyRefunded = payments.every(p => p.status === "REFUNDED");
  if (alreadyRefunded) {
    throw new AppError("All payments already refunded",HTTP_STATUS.BAD_REQUEST);
  }

  // wallet-only orders can only be refunded to wallet
  if (order.paymentMethod === "wallet") {
    refundMethod = "wallet";
  }

  try {
    // user paid = razorpay portion + wallet portion (coupon is not refunded)
    const razorpayPortion = Math.round(order.amount);
    const walletPortion = Math.round(order.walletAmountUsed || 0);
    const totalUserPaid = razorpayPortion + walletPortion;

    let refundAmount;

    if (refundMethod === "bank" && razorpayPortion > 0) {
      // bank: 80% of razorpay portion to bank
      const bankRefund = Math.round(razorpayPortion * 0.8);

      const refund = await razorpayInstance.payments.refund(
        payments[0].razorpayPaymentId,
        {
          amount: bankRefund,
          notes: { reason },
        }
      );

      await Payment.updateMany(
        { razorpayOrderId, userId },
        {
          status: "REFUNDED",
          razorpayRefundId: refund.id,
          refundedAt: new Date(),
          refundAmount: bankRefund,
          refundMethod: "bank",
        }
      );

      // credit wallet portion back
      if (walletPortion > 0) {
        await creditWallet({
          userId,
          amount: walletPortion,
          reason: "Wallet portion refund for order",
          relatedOrderId: order._id,
        });
      }

      refundAmount = bankRefund + walletPortion;
    } else {
      // wallet: 100% of total user paid to wallet
      refundAmount = totalUserPaid;

      await creditWallet({
        userId,
        amount: refundAmount,
        reason: "Full refund for order",
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
      originalAmount: totalUserPaid,
      refundAmount,
      refundMethod,
      message:
        refundMethod === "bank"
          ? "Refund of 80% processed to bank (5-7 days). Wallet portion credited back."
          : "Full refund credited to wallet",
    };
  } catch (error) {
    console.error("Refund error:", error);
    const errorMessage =
      error?.error?.description || error?.message || "Unknown error";
    throw new AppError(`Refund failed: ${errorMessage}`,HTTP_STATUS.BAD_REQUEST);
  }
};

export const processPartialRefund = async ({
  courseId,
  userId,
  razorpayOrderId,
  reason = "Customer request",
  refundMethod = "wallet",
}) => {
  const payment = await Payment.findOne({ courseId, userId, razorpayOrderId });

  if (!payment) {
    throw new AppError("Payment not found for this course",HTTP_STATUS.NOT_FOUND);
  }

  if (payment.status === "REFUNDED") {
    throw new AppError("This course payment is already refunded",HTTP_STATUS.BAD_REQUEST);
  }

  const order = await Order.findOne({ razorpayOrderId, userId });
  if (!order) {
    throw new AppError("Order not found",HTTP_STATUS.NOT_FOUND);
  }

  // wallet-only orders can only be refunded to wallet
  if (order.paymentMethod === "wallet") {
    refundMethod = "wallet";
  }

  // total amount user actually paid (razorpay + wallet, excludes coupon)
  const totalUserPaid =
    Math.round(order.amount) + Math.round(order.walletAmountUsed || 0);
  const coursePrice = payment.amount;

  // proportional refund based on total user paid amount
  let baseRefundAmount;
  if (order.originalAmount && order.originalAmount > 0) {
    baseRefundAmount = Math.round(
      (coursePrice / order.originalAmount) * totalUserPaid
    );
  } else {
    baseRefundAmount = coursePrice;
  }

  baseRefundAmount = Math.max(1, baseRefundAmount);

  // wallet = 100%, bank = 80%
  const refundAmount =
    refundMethod === "bank"
      ? Math.round(baseRefundAmount * 0.8)
      : baseRefundAmount;

  // proportional wallet portion for this course
  const walletPortion = Math.round(order.walletAmountUsed || 0);
  const courseWalletPortion =
    order.originalAmount && order.originalAmount > 0
      ? Math.round((coursePrice / order.originalAmount) * walletPortion)
      : 0;

  try {
    if (refundMethod === "bank" && order.paymentMethod !== "wallet") {
      // bank refund via razorpay
      const refund = await razorpayInstance.payments.refund(
        payment.razorpayPaymentId,
        {
          amount: refundAmount,
          notes: { reason, courseId: payment.courseId.toString() },
        }
      );

      payment.razorpayRefundId = refund.id;
      payment.refundMethod = "bank";

      // credit wallet portion back
      if (courseWalletPortion > 0) {
        await creditWallet({
          userId,
          amount: courseWalletPortion,
          reason: "Wallet portion refund for course",
          relatedPaymentId: payment._id,
          relatedOrderId: order._id,
        });
      }
    } else {
      // wallet refund
      await creditWallet({
        userId,
        amount: refundAmount,
        reason: "Refund for course",
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
      message:
        refundMethod === "bank"
          ? "Refund of 80% processed to bank (5-7 days)"
          : "Full refund credited to wallet",
    };
  } catch (error) {
    console.error("Refund error:", error);
    const errorMessage =
      error?.error?.description || error?.message || "Unknown error";
    throw new AppError(`Refund failed: ${errorMessage}`,HTTP_STATUS.BAD_REQUEST);
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
