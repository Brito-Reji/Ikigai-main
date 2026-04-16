import { AppError } from "../../errors/AppError.js";
import { Coupon } from "../../models/Coupon.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Validate discount vs min amount
const validateCouponAmounts = ({ discountType, discountValue, minAmount }) => {
  if (discountType === "fixed" && Number(discountValue) === Number(minAmount)) {
    throw new AppError(
      "Discount value cannot equal minimum purchase amount",
      HTTP_STATUS.BAD_REQUEST
    );
  }
};

export const createCouponService = coupon => {
  validateCouponAmounts(coupon);
  return Coupon.create(coupon);
};

export const getAllCouponsService = () => {
  return Coupon.find({ isDeleted: false })
    .sort({ createdAt: -1 }) 
    .lean();
};

export const updateCouponService = (couponId, coupon) => {
  validateCouponAmounts(coupon);
  return Coupon.findByIdAndUpdate(couponId, coupon, { new: true });
};

export const deleteCouponService = couponId => {
  return Coupon.findByIdAndUpdate(couponId, { isDeleted: true }, { new: true });
};

export const togglePauseCouponService = async (couponId) => {
  let coupon = await Coupon.findById(couponId)
  if(!coupon) throw new AppError("Coupon not found", HTTP_STATUS.NOT_FOUND)
  coupon.isPaused = !coupon.isPaused
  return coupon.save()
 
};
