import { refundEndpoints } from "./endpoints/refundEndpoints.js";
import api from "./axiosConfig.js";

export const refundApi = {
  requestPartial: ({ courseId, razorpayOrderId, reason, refundMethod }) =>
    api.post(refundEndpoints.partial(), {
      courseId,
      razorpayOrderId,
      reason,
      refundMethod,
    }),

  requestFull: ({ razorpayOrderId, reason, refundMethod }) =>
    api.post(refundEndpoints.full(), { razorpayOrderId, reason, refundMethod }),

  getHistory: () => api.get(refundEndpoints.history()),
};
