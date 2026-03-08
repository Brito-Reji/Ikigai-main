import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { cartApi } from "@/api/cartApi";
import { addToCart } from "@/store/slices/cartSlice";

// get cart
export const useCart = () => {
  const user = useSelector(state => state.auth.user);

  return useQuery({
    queryKey: ["cart", user?._id || user?.id || null],
    queryFn: cartApi.getCart,
    enabled: !!user,
    retry: 2,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async courseId => {
      const res = await cartApi.addToCart(courseId);
      return res.data?.course || null;
    },

    onSuccess: course => {
      if (course) {
        dispatch(addToCart(course));
      }
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
// Remove from cart
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.removeFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Sync cart
export const useSyncCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.syncCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Clear cart
export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
