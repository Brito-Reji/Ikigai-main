export const couponEndpoints = {
  admin: {
    add: () => "/admin/coupons",
    update: couponId => `/admin/coupons/${couponId}`,
    delete: couponId => `/admin/coupons/${couponId}`,
    getAll: () => "/admin/coupons",
    togglePause: couponId => `/admin/coupons/${couponId}/toggle-pause`,
  },
  student: {
    apply: couponId => `/student/coupons/${couponId}`,
    remove: couponId => `/student/coupons/${couponId}`,
  },
};
