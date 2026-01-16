export const couponEndpoints = {
    admin:{
        add: () => '/admin/coupon',
        update: (couponId) => `/admin/coupon/${couponId}`,
        delete: (couponId) => `/admin/coupon/${couponId}`,
        getAll: () => '/admin/coupon',
    },
   student:{
    apply: (couponId) => `/student/coupon/${couponId}`,
    remove: (couponId) => `/student/coupon/${couponId}`,
   }
}