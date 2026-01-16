import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    minAmount: {
      type: Number,
      default: 0,
    },

    maxDiscount: Number,

    usageLimit: {
      type: Number,
    },

    usedCount: {
      type: Number,
      default: 0,
    },

    perUserLimit: {
      type: Number,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    isPaused: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);
