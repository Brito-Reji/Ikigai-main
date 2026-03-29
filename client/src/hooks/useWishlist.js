import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { wishlistApi } from "@/api/wishlistApi";

export const useWishlist = () => {
  const user = useSelector((state) => state.studentAuth.user);
  const isAuthenticated = useSelector((state) => state.studentAuth.isAuthenticated);

  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.getWishlist,
    retry: false,
    enabled: isAuthenticated && user?.role === "student",
  });
};

export const useToggleWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.toggleWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });
};
