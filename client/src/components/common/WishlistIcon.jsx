import React from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useWishlist } from "@/hooks/useWishlist";

const WishlistIcon = ({ className = "" }) => {
  const navigate = useNavigate();
  const user = useSelector(state => state.studentAuth.user);
  const isLoggedIn = !!(user && (user.id || user._id));

  const { data: wishlistData } = useWishlist();
  console.log("Wishlist data:", wishlistData);
  const wishlistItems =
    isLoggedIn && wishlistData?.data ? wishlistData.data : [];
  const itemCount = wishlistItems.length || 0;
  console.log("Wishlist items:", wishlistItems, "Count:", itemCount);

  return (
    <button
      onClick={() => navigate("/wishlist")}
      className="relative p-2 hover:bg-gray-100 rounded-full transition"
      aria-label="Wishlist"
    >
      <Heart className="w-6 h-6 text-gray-700" />
      {/* personaly i dont like it to have count in the wishlist */}
      {/* {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )} */}
    </button>
  );
};

export default WishlistIcon;
