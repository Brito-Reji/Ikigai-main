import { couponEndpoints } from "./endpoints/couponEndpoint.js";
import api from "./axiosConfig.js";

export const couponApi = {
  admin: {
    add: coupon => api.post(couponEndpoints.admin.add(), coupon),
    update: (couponId, coupon) =>
      api.put(couponEndpoints.admin.update(couponId), coupon),
    delete: couponId => api.delete(couponEndpoints.admin.delete(couponId)),
    getAll: () => api.get(couponEndpoints.admin.getAll()),
    togglePause: couponId =>
      api.patch(couponEndpoints.admin.togglePause(couponId)),
  },
  student: {
    validate: (code, amount) => api.get(couponEndpoints.student.validate(code, amount)),
  },
};
