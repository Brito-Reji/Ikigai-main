import { AppError } from "../../errors/AppError.js";
import { Coupon } from "../../models/Coupon.js";
import { CouponUsage } from "../../models/CouponUsage.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const validateCouponService = async (code, userId, amount) => {
  if (!amount || isNaN(Number(amount))) {
  throw new AppError("Valid amount is required", HTTP_STATUS.BAD_REQUEST);
}
  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isDeleted: false,
  });

  if (!coupon) {
    throw new AppError("Invalid coupon code",HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.isPaused) {
    throw new AppError("Coupon is currently unavailable",HTTP_STATUS.BAD_REQUEST);
  }

  const now = new Date();
  if (new Date(coupon.expiryDate) < now) {
    throw new AppError("Coupon has expired",HTTP_STATUS.BAD_REQUEST);
  }

  if (amount < coupon.minAmount) {
    console.log(amount)
    throw new AppError(`Minimum purchase amount of ₹${coupon.minAmount} required`,HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError("Coupon usage limit reached",HTTP_STATUS.BAD_REQUEST);
  }

  if (coupon.perUserLimit) {
    const usage = await CouponUsage.findOne({
      userId,
      couponId: coupon._id,
    });

    if (usage && usage.usedCount >= coupon.perUserLimit) {
      throw new AppError("You have reached the usage limit for this coupon",HTTP_STATUS.BAD_REQUEST);
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
