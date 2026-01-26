import { Coupon } from "../../models/Coupon.js";
import { CouponUsage } from "../../models/CouponUsage.js";

export const validateCouponService = async (code, userId, amount) => {
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isDeleted: false,
  });

  if (!coupon) {
    throw new Error("Invalid coupon code");
  }

  if (coupon.isPaused) {
    throw new Error("Coupon is currently unavailable");
  }

  const now = new Date();
  if (new Date(coupon.expiryDate) < now) {
    throw new Error("Coupon has expired");
  }

  if (amount < coupon.minAmount) {
    throw new Error(`Minimum purchase amount of ₹${coupon.minAmount} required`);
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new Error("Coupon usage limit reached");
  }

  if (coupon.perUserLimit) {
    const usage = await CouponUsage.findOne({
      userId,
      couponId: coupon._id,
    });

    if (usage && usage.usedCount >= coupon.perUserLimit) {
      throw new Error("You have reached the usage limit for this coupon");
    }
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = (amount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else {
    discountAmount = coupon.discountValue;
  }

  discountAmount = Math.min(discountAmount, amount);

  return {
    couponId: coupon._id,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount: Math.round(discountAmount),
    description: coupon.description,
  };
};

export const incrementCouponUsageService = async (couponId, userId) => {
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });

  await CouponUsage.findOneAndUpdate(
    { userId, couponId },
    { $inc: { usedCount: 1 } },
    { upsert: true, new: true }
  );
};

export const decrementCouponUsageService = async (couponId, userId) => {
  // decrement total usage count (min 0)
  await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: -1 } });

  // decrement per-user usage
  const usage = await CouponUsage.findOneAndUpdate(
    { userId, couponId, usedCount: { $gt: 0 } },
    { $inc: { usedCount: -1 } },
    { new: true }
  );

  // cleanup if usage is 0
  if (usage && usage.usedCount <= 0) {
    await CouponUsage.deleteOne({ _id: usage._id });
  }
};
