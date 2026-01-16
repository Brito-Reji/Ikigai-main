import { Coupon } from "../../models/Coupon.js"

export const createCouponService = (coupon) => {
    return Coupon.create(coupon)
}

export const getAllCouponsService = () => {
    return Coupon.find()
}
