import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '@/api/cartApi';

// Get cart
export const useCart = () => {
    return useQuery({
        queryKey: ['cart'],
        queryFn: cartApi.getCart,
        retry: false
    });
};

// Add to cart
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};

// Remove from cart
export const useRemoveFromCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.removeFromCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};

// Sync cart
export const useSyncCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.syncCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};

// Clear cart
export const useClearCart = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cartApi.clearCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        }
    });
};
