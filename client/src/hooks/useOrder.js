import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderApi } from "@/api/orderApi";
import { refundApi } from "@/api/refundApi";

export const useOrderHistory = () => {
  return useQuery({
    queryKey: ["orders", "history"],
    queryFn: async () => {
      const response = await orderApi.getHistory();
      // convert paise to rupees
      const orders = response.data.data.map(order => ({
        ...order,
        courseIds: order.courseIds.map(course => ({
          ...course,
          price: course.price / 100,
        })),
        amount: order.amount / 100,
        originalAmount: order.originalAmount / 100,
        discountAmount: order.discountAmount / 100,
        payments: order.payments.map(p => ({
          ...p,
          refundAmount: p.refundAmount ? p.refundAmount / 100 : p.refundAmount,
        })),
      }));
      return orders;
    },
  });
};

export const usePartialRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ courseId, razorpayOrderId, reason }) =>
      refundApi.requestPartial({ courseId, razorpayOrderId, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};

export const useFullRefund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ razorpayOrderId, reason }) =>
      refundApi.requestFull({ razorpayOrderId, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["enrolled-courses"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
      queryClient.invalidateQueries({ queryKey: ["wallet-transactions"] });
    },
  });
};

export const useRefundHistory = () => {
  return useQuery({
    queryKey: ["refunds", "history"],
    queryFn: () => refundApi.getHistory(),
  });
};
