import asyncHandler from "express-async-handler";
import { HTTP_STATUS } from "../../utils/httpStatus.js";
import * as couponService from "../../services/student/couponService.js";

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { amount } = req.query;

 

  const couponData = await couponService.validateCouponService(
    code,
    req.user._id,
     Number(amount)

  );


  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: "Coupon is valid",
    data: couponData,
  });
});
