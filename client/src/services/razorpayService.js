import api from "@/api/axiosConfig";

export const startRazorpayPayment = async (courseIds) => {
  const response = await api.post("/payments/create-order", { courseIds });

  if (!response.data.success) {
    throw new Error("Order creation failed");
  }

  const order = response.data.data;

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    order_id: order.id,

    handler: async (response) => {
      await api.post("/payments/verify-payment", {
        razorpayOrderId: response.razorpay_order_id,
        razorpayPaymentId: response.razorpay_payment_id,
        razorpaySignature: response.razorpay_signature,
      });
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
