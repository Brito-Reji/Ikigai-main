import { couponApi } from "@/api/couponApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetCoupons = () => {
  return useQuery({
    queryKey: ["coupon"],
    queryFn: () => couponApi.admin.getAll(),
  });
};

export const useAddCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.admin.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupon"] });
    },
  });
};

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.admin.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupon"] });
    },
  });
};

export const useTogglePauseCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: couponApi.admin.togglePause,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupon"] });
    },
  });
};

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ couponId, couponData }) =>
      couponApi.admin.update(couponId, couponData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupon"] });
    },
  });
};
