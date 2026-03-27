import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useCart as useCartAPI } from "@/hooks/useCart";
import { setCart } from "@/store/slices/cartSlice";

const CartIcon = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.studentAuth.user);
  const reduxItems = useSelector((state) => state.cart.items);
  const { data: apiCartData } = useCartAPI();
  const isLoggedIn = !!(user && (user.id || user._id));

  // sync server cart to redux
  useEffect(() => {
    if (isLoggedIn && apiCartData?.data) {
      dispatch(setCart(apiCartData.data));
    }
  }, [apiCartData, isLoggedIn, dispatch]);

  const items = isLoggedIn && apiCartData?.data ? apiCartData.data : reduxItems;
  const itemCount = items?.length || 0;

  return (
    <button
      onClick={() => navigate("/cart")}
      className="relative p-2 hover:bg-gray-100 rounded-full transition"
      aria-label="Shopping Cart"
    >
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;

