export const wishlistEndpoints = {
    get: () => '/student/wishlist',
    toggle: () => '/student/wishlist/toggle',
    remove: (courseId) => `/student/wishlist/${courseId}`
};
