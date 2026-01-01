import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import * as applyCouponService from "../../services/student/couponService.js";

export const applyCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.body;
  const userId = req.user._id;

  const coupon = await applyCouponService.applyCouponService({
    couponId,
    userId,
  });

  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Coupon applied successfully",
    data: {
      couponId: coupon._id,
      discount: coupon.discount,
      type: coupon.type,
    },
  });
});

export const getCoupon = asyncHandler(async (req, res) => {
  const coupon = await applyCouponService.getCouponService({
    couponId: req.params.id,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Coupon fetched successfully",
    data: coupon,
  });
});
