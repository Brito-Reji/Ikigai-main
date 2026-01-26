import { refundEndpoints } from "./endpoints/refundEndpoints.js";
import api from "./axiosConfig.js";

export const refundApi = {
  requestPartial: ({ courseId, razorpayOrderId, reason }) =>
    api.post(refundEndpoints.partial(), { courseId, razorpayOrderId, reason }),

  requestFull: ({ razorpayOrderId, reason }) =>
    api.post(refundEndpoints.full(), { razorpayOrderId, reason }),

  getHistory: () => api.get(refundEndpoints.history()),
};
