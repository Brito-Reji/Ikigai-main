import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useRedux';

const CartIcon = () => {
  const navigate = useNavigate();
  const { items = [] } = useCart();
  const itemCount = items?.length || 0;

  return (
    <button
      onClick={() => navigate('/cart')}
      className="relative p-2 hover:bg-gray-100 rounded-full transition"
      aria-label="Shopping Cart"
    >
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
