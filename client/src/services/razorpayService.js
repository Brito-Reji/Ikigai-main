import api from '@/api/axiosConfig';

export const startRazorpayPayment = async (
  courseIds,
  navigate,
  verifyPaymentMutation
) => {
  const response = await api.post('/payments/create-order', { courseIds });

  if (!response.data.success) {
    throw new Error('Order creation failed');
  }

  const order = response.data.data;
  console.log('order->', order.amount);

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount / 100,
    currency: 'INR',
    order_id: order.razorpayOrderId,

    handler: async function (response) {
      let paymentId;
      let enrolledDetails;

      try {
        const verifyResult = await verifyPaymentMutation.mutateAsync(response);

        console.log('Verify Payment Result:', verifyResult);

        paymentId = verifyResult.data.paymentId;
        enrolledDetails = verifyResult.data.enrolledDetails;

        console.log('Extracted PaymentId:', paymentId);
        console.log('Extracted EnrolledDetails:', enrolledDetails);

        navigate('/payment/success', {
          replace: true,
          state: { paymentId, enrolledDetails },
        });
      } catch (err) {
        console.error('Payment verification error:', err);

        navigate('/payment/failed', {
          replace: true,
          state: { paymentId, enrolledDetails },
        });
      }
    },

    modal: {
      ondismiss: function () {
        navigate('/payment/cancelled', { replace: true });
      },
    },
  };

  const rzp = new window.Razorpay(options);

  // only handle failures via event
  rzp.on('payment.failed', function (response) {
    console.error('Payment failed:', response.error);
    navigate('/payment/failed');
  });

  rzp.open();
  return response;
};
