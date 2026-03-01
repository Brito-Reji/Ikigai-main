import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import {
  createCouponService,
  getAllCouponsService,
  updateCouponService,
  deleteCouponService,
  togglePauseCouponService,
} from "../../services/admin/couponService.js";

export const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountType,
    discountValue,
    minAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
    perUserLimit,
    isPaused,
    description,
  } = req.body;
  let data = await createCouponService({
    code,
    discountType,
    discountValue,
    minAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
    perUserLimit,
    isPaused,
    description,
  });
  res.status(HTTP_STATUS.CREATED).json({
    success: true,
    message: "Coupon created successfully",
    data,
  });
});

export const getAllCoupons = asyncHandler(async (req, res) => {
  let data = await getAllCouponsService();
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Coupons fetched successfully",
    data,
  });
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  const {
    code,
    discountType,
    discountValue,
    minAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
    perUserLimit,
    isPaused,
    description,
  } = req.body;
  let data = await updateCouponService(couponId, {
    code,
    discountType,
    discountValue,
    minAmount,
    maxDiscount,
    expiryDate,
    usageLimit,
    perUserLimit,
    isPaused,
    description,
  });
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Coupon updated successfully",
    data,
  });
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  let data = await deleteCouponService(couponId);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Coupon deleted successfully",
    data,
  });
});

export const togglePauseCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  let data = await togglePauseCouponService(couponId);
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `Coupon ${data.isPaused ? "paused" : "activated"} successfully`,
    data,
  });
});
