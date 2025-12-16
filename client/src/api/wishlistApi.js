import api from './axiosConfig';
import { wishlistEndpoints } from './endpoints/wishlistEndpoints';

export const wishlistApi = {
    getWishlist: async () => {
        const { data } = await api.get(wishlistEndpoints.get());
        return data;
    },

    toggleWishlist: async (courseId) => {
        const { data } = await api.post(wishlistEndpoints.toggle(), { courseId });
        return data;
    },

    removeFromWishlist: async (courseId) => {
        const { data } = await api.delete(wishlistEndpoints.remove(courseId));
        return data;
    }
};
