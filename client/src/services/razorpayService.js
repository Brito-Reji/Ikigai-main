import api from "@/api/axiosConfig";

export const startRazorpayPayment = async (
  courseIds,
  navigate,
  verifyPaymentMutation,
  couponCode = null,
  useWallet = false
) => {
  const response = await api.post("/payments/create-order", {
    courseIds,
    couponCode,
    useWallet,
  });

  if (!response.data.success) {
    throw new Error("Order creation failed");
  }

  const order = response.data.data;

  // if paid in full with wallet - no razorpay needed
  console.log("order", order);
  if (order.paidInFull) {
    navigate("/payment/success", {
      replace: true,
      state: {
        paymentId: order.razorpayOrderId,
        enrolledDetails: order.enrolledDetails,
        walletPayment: true,
      },
    });
    return response;
  }

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount / 100,
    currency: "INR",
    order_id: order.razorpayOrderId,

    handler: async function (response) {
      let paymentId;
      let enrolledDetails;

      try {
        const verifyResult = await verifyPaymentMutation.mutateAsync(response);

        paymentId = verifyResult.data.paymentId;
        enrolledDetails = verifyResult.data.enrolledDetails;

        navigate("/payment/success", {
          replace: true,
          state: { paymentId, enrolledDetails },
        });
      } catch (err) {
        console.error("Payment verification error:", err);

        navigate("/payment/failed", {
          replace: true,
          state: { paymentId, enrolledDetails },
        });
      }
    },
  };

  const rzp = new window.Razorpay(options);

  rzp.on("payment.failed", function (response) {
    console.error("Payment failed:", response.error);
    navigate("/payment/failed");
  });

  rzp.open();
  return response;
};
