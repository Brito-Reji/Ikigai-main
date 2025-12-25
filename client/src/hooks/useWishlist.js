import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/api/wishlistApi';
import { jwtDecode } from 'jwt-decode';

export const useWishlist = () => {
    const role = localStorage.getItem('accessToken') && jwtDecode(localStorage.getItem('accessToken'));
    
    return useQuery({
        queryKey: ['wishlist'],
        queryFn: wishlistApi.getWishlist,
        retry: false,
        enabled: role?.role === 'student'
    });
};

export const useToggleWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.toggleWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        }
    });
};

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: wishlistApi.removeFromWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        }
    });
};
