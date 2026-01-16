import { couponApi } from "@/api/couponApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetCoupons = () => {
return useQuery({
        queryKey: ['coupon'],
        queryFn: () => couponApi.admin.getAll(),
    });
}

export const useAddCoupon = () => {
    return useMutation({
        mutationFn: couponApi.admin.add,
    });
}