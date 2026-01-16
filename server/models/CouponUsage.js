import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

couponUsageSchema.index({ userId: 1, couponId: 1 }, { unique: true });

export const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);
