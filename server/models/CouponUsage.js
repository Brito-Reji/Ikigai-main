import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  couponId: mongoose.Schema.Types.ObjectId,
  usedCount: {
    type: Number,
    default: 0
  }
});

export const CouponUsage = mongoose.model(
  "CouponUsage",
  couponUsageSchema
);