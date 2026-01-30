import { Coupon } from "../../models/Coupon.js";

export const createCouponService = coupon => {
  return Coupon.create(coupon);
};

export const getAllCouponsService = () => {
  return Coupon.find({ isDeleted: false });
};

export const updateCouponService = (couponId, coupon) => {
  return Coupon.findByIdAndUpdate(couponId, coupon, { new: true });
};

export const deleteCouponService = couponId => {
  return Coupon.findByIdAndUpdate(couponId, { isDeleted: true }, { new: true });
};

export const togglePauseCouponService = async (couponId) => {
  let coupon = await Coupon.findById(couponId)
  if(!coupon) throw new Error("Coupon not found")
  coupon.isPaused = !coupon.isPaused
  return coupon.save()
 
};
