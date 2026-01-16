import asyncHandler from "express-async-handler"
import { HTTP_STATUS } from "../../utils/httpStatus.js"
import { createCouponService, getAllCouponsService } from "../../services/admin/couponService.js"
export const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountType, discountValue, minAmount, maxDiscount, expiryDate, usageLimit, perUserLimit, isPaused, description } = req.body
    let data = createCouponService({ code, discountType, discountValue, minAmount, maxDiscount, expiryDate, usageLimit, perUserLimit, isPaused, description })
    res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: "Coupon created successfully",
        data
    })
})


    
export const getAllCoupons = asyncHandler(async (req, res) => {
    let data = getAllCouponsService()
    console.log(data)
    res.status(HTTP_STATUS.OK).json({
        success: true,
        message: "Coupons fetched successfully",
        data
    })
})    