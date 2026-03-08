import {Coupon} from "../../models/Coupon.js";

const getPublicCouponsService = async () => {
    const coupons = await Coupon.find({ isPublic: true ,expiryDate:{$gte:new Date()}, isPaused:false, isDeleted:false})
    
    return coupons;
};

export default getPublicCouponsService;