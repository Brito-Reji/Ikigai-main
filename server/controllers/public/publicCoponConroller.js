import getPublicCouponsService from "../../services/public/publicCouponService.js";
import asyncHandler from "express-async-handler"

const getPublicCouponsController = asyncHandler(async (req, res) => {
    const coupons = await getPublicCouponsService();
    console.log("coupons", coupons);
    res.status(200).json({
        success: true,
        data: coupons,
    });
});

export default getPublicCouponsController;