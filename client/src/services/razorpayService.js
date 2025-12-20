import api from "@/api/axiosConfig";

export const startRazorpayPayment = async (courseIds, navigate) => {
  const response = await api.post("/payments/create-order", { courseIds });

  if (!response.data.success) {
    throw new Error("Order creation failed");
  }

  const order = response.data.data;
 console.log("order->",order.amount)

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount*100,
    currency: "INR",
    order_id: order.razorpayOrderId,

    handler: async function (response) {
      try {
        // verify payment
        await api.post("/payments/verify-payment", response);

        // navigate to success page AFTER verification
        navigate("/payment/success");
      } catch (err) {
        console.error("Payment verification failed:", err);
        navigate("/payment/failed");
      }
    },

    modal: {
      ondismiss: function () {
        navigate("/payment/cancelled");
      }
    }
  };

  const rzp = new window.Razorpay(options);

  // only handle failures via event
  rzp.on("payment.failed", function (response) {
    console.error("Payment failed:", response.error);
    navigate("/payment/failed");
  });

  rzp.open();
  return response;
};
