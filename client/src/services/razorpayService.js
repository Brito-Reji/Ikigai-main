import api from "@/api/axiosConfig";

export const startRazorpayPayment = async (courseIds, navigate) => {
  const response = await api.post("/payments/create-order", { courseIds });

  if (!response.data.success) {
    throw new Error("Order creation failed");
  }

  const order = response.data.data;

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    order_id: order.id,

    handler: async function (response) {
      try {
        // 1. verify payment
        await api.post("/payments/verify-payment", response)

     
      } catch (err) {
        navigate("/payment/failed")
      }
    },

    modal: {
      ondismiss: function () {
        navigate("/payment/cancelled")
      }
    }
  }

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function () {
    navigate("/payment/failed")
  })
  rzp.on("payment.success", function () {
    navigate("/payment/success")
  })
  rzp.open();
  return response;
};
