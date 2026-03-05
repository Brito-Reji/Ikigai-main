import { couponEndpoints } from "./endpoints/couponEndpoint.js";
import api from "./axiosConfig.js";
import adminApi from "./adminAxiosConfig.js";

export const couponApi = {
  admin: {
    add: coupon => adminApi.post(couponEndpoints.admin.add(), coupon),
    update: (couponId, coupon) =>
      adminApi.put(couponEndpoints.admin.update(couponId), coupon),
    delete: couponId => adminApi.delete(couponEndpoints.admin.delete(couponId)),
    getAll: () => adminApi.get(couponEndpoints.admin.getAll()),
    togglePause: couponId =>
      adminApi.patch(couponEndpoints.admin.togglePause(couponId)),
  },
  student: {
    validate: (code, amount) =>
      api.get(couponEndpoints.student.validate(code, amount)),
  },
};
