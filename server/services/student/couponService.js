import { Coupon } from "../../models/Coupon.js";
import { CouponUsage } from "../../models/CouponUsage.js";

export const applyCouponService = async ({ couponId, userId }) => {
  if (!couponId) {
    throw new Error("Coupon ID is required");
  }

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new Error("Invalid coupon");
  }

  const couponUsage = await CouponUsage.findOne({
    couponId,
    userId
  });

  // If user already used coupon
  if (couponUsage && couponUsage.usedCount >= coupon.perUserLimit) {
    throw new Error("Coupon limit exceeded");
  }

  return coupon;
};

