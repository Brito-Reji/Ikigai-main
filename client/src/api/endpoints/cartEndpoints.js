export const cartEndpoints = {
    get: () => '/student/cart',
    add: () => '/student/cart',
    remove: (courseId) => `/student/cart/${courseId}`,
    sync: () => '/student/cart/sync',
    clear: () => '/student/cart'
};
