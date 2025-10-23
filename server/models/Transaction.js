import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "Instructor" },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: { type: mongoose.Schema.Types.Decimal128, required: true },
    originalAmount: { type: mongoose.Schema.Types.Decimal128 },
    discountAmount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    tax: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    type: { type: String, enum: ["purchase", "refund"], default: "purchase" },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model("Transaction",transactionSchema)