import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useRedux';
import { clearCart } from '@/store/slices/cartSlice';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, dispatch } = useCart();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price?.replace(/[^0-9.-]+/g, '') || 0);
      return total + price;
    }, 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      dispatch(clearCart());
      
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: 'Your courses have been added to your library.',
        confirmButtonColor: '#4f46e5',
      }).then(() => {
        navigate('/my-courses');
      });
    }, 2000);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">Secure Payment</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Card Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                      maxLength="19"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-12"
                      placeholder="1234 5678 9012 3456"
                    />
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Expiry & CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      required
                      maxLength="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      required
                      maxLength="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="123"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                >
                  {loading ? 'Processing...' : `Pay ₹${calculateTotal().toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {items.map((course) => (
                  <div key={course._id} className="flex justify-between text-sm">
                    <span className="text-gray-600 truncate pr-2">{course.title}</span>
                    <span className="text-gray-900 font-medium">{course.price}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>₹0.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
