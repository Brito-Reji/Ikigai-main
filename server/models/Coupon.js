import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },

  discountType: {
    type: String,
    enum: ["PERCENT", "FLAT"],
    required: true
  },

  discountValue: Number,

  minCartValue: {
    type: Number,
    default: 0
  },

  maxDiscount: Number,

  usageLimit: {
    type: Number 
  },

  usedCount: {
    type: Number,
    default: 0
  },

  perUserLimit: {
    type: Number,
    default: 1 
  },

  expiryDate: Date,
  isActive: { type: Boolean, default: true }
});

export const Coupon = mongoose.model("Coupon", couponSchema);
