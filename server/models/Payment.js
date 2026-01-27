// models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySignature: {
      type: String,
    },
    razorpayRefundId: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["CREATED", "PAID", "REFUNDED"],
      default: "CREATED",
      index: true,
    },
    releaseDate: {
      type: Date,
    },
    releaseStatus: {
      type: String,
      enum: ["PENDING", "HELD", "RELEASED", "REFUNDED"],
      default: "PENDING",
      index: true,
    },
    refundedAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
    },
    refundMethod: {
      type: String,
      enum: ["wallet", "bank"],
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
