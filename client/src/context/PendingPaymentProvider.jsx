import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import OrderPaymentModal from "../components/common/OrderPaymentModal";
import { startRazorpayPayment, retryPayment } from "@/services/razorpayService";
import { useVerifyPayment } from "@/hooks/useCourses";
import { useAuth } from "@/hooks/useRedux";
import api from "@/api/axiosConfig";

const PendingPaymentContext = createContext();

export const usePendingPayment = () => {
  const ctx = useContext(PendingPaymentContext);
  if (!ctx) throw new Error("usePendingPayment must be used within PendingPaymentProvider");
  return ctx;
};

export const PendingPaymentProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const verifyPaymentMutation = useVerifyPayment();
  const { accessToken } = useAuth();
  const hasFetchedPending = useRef(false);

  // auto-check once per session for pending orders
  useEffect(() => {
    if (!accessToken || hasFetchedPending.current) return;
    hasFetchedPending.current = true;

    const checkPending = async () => {
      try {
        const res = await api.get("/payments/orders/pending");
        if (res.data.success && res.data.data) {
          const data = res.data.data;
          const normalized = {
            orderId: data.orderId,
            razorpayOrderId: data.razorpayOrderId,
            amount: data.enrolledDetails?.amount ?? data.amount,
            originalAmount: data.enrolledDetails?.originalAmount,
            discountAmount: data.enrolledDetails?.discountAmount,
            walletAmountUsed: data.enrolledDetails?.walletAmountUsed,
            couponCode: data.enrolledDetails?.couponCode,
            courseIds: data.enrolledDetails?.courseIds || [],
            currency: data.currency,
          };
          setOrderDetails(normalized);
          setIsOpen(true);
        }
      } catch (err) {
        console.error("Pending payment check failed:", err);
      }
    };

    checkPending();
  }, [accessToken]);

  const openPaymentModal = (details) => {
    setOrderDetails(details);
    setIsOpen(true);
  };

  const closePaymentModal = async () => {
    if (orderDetails?.orderId) {
      try {
        await api.put("/payments/orders/cancel", { orderId: orderDetails.orderId });
      } catch (err) {
        console.error("Cancel order failed:", err);
      }
    }
    setIsOpen(false);
    setOrderDetails(null);
  };

  // trigger razorpay
  const handlePayment = async () => {
    if (!orderDetails) return;
    setIsLoading(true);

    try {
      if (orderDetails.orderId) {
        await retryPayment(orderDetails.orderId, navigate, verifyPaymentMutation);
      } else {
        await startRazorpayPayment(
          orderDetails.courseIds,
          navigate,
          verifyPaymentMutation,
          orderDetails.couponCode || null,
          orderDetails.useWallet || false
        );
      }
      closePaymentModal();
    } catch (err) {
      console.error("Payment error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PendingPaymentContext.Provider value={{ openPaymentModal, closePaymentModal }}>
      {children}

      <OrderPaymentModal
        isOpen={isOpen}
        onClose={closePaymentModal}
        orderDetails={orderDetails}
        onPayment={handlePayment}
        isLoading={isLoading}
      />
    </PendingPaymentContext.Provider>
  );
};
