import api from './axiosConfig';
import { cartEndpoints } from './endpoints/cartEndpoints';

export const cartApi = {
    // Get cart
    getCart: async () => {
        const { data } = await api.get(cartEndpoints.get());
        return data;
    },

    // Add to cart
    addToCart: async (courseId) => {
        const { data } = await api.post(cartEndpoints.add(), { courseId });
        return data;
    },

    // Remove from cart
    removeFromCart: async (courseId) => {
        const { data } = await api.delete(cartEndpoints.remove(courseId));
        return data;
    },

    // Sync guest cart
    syncCart: async (courseIds) => {
        const { data } = await api.post(cartEndpoints.sync(), { courseIds });
        return data;
    },

    // Clear cart
    clearCart: async () => {
        const { data } = await api.delete(cartEndpoints.clear());
        return data;
    }
};
