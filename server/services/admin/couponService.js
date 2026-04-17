import { AppError } from "../../errors/AppError.js";
import { Coupon } from "../../models/Coupon.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// Validate discount vs min amount
const validateCouponAmounts = ({ discountType, discountValue, minAmount }) => {
  if (discountType == "fixed" && discountValue >minAmount) {
    throw new AppError("min amoutn should be greater ",HTTP_STATUS.FORBIDDEN)
  }


  if (discountType === "fixed" && Number(discountValue) === Number(minAmount)) {
    throw new AppError(
      "Discount value cannot equal minimum purchase amount",
      HTTP_STATUS.BAD_REQUEST
    );
  }
};

export const createCouponService = async (coupon) => {
  validateCouponAmounts(coupon);

  const exists = await Coupon.findOne({ 
    code: { $regex: `^${coupon.code.trim()}$`, $options: "i" } 
  });
  if (exists) throw new AppError("Coupon code already exists", HTTP_STATUS.BAD_REQUEST);

  return Coupon.create(coupon);
};

export const getAllCouponsService = () => {
  return Coupon.find({ isDeleted: false })
    .sort({ createdAt: -1 }) 
    .lean();
};

export const updateCouponService = async (couponId, coupon) => {
  validateCouponAmounts(coupon);
  
  const exists = await Coupon.findOne({ 
    code: { $regex: `^${coupon.code.trim()}$`, $options: "i" },
    _id: { $ne: couponId }
  });

  if (exists) {
    throw new AppError("Coupon code already exists", HTTP_STATUS.FORBIDDEN);
  }
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
