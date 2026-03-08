import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tag, ArrowLeft, Copy, Check, Clock, Percent, IndianRupee } from "lucide-react";
import { useGetPublicCoupons } from "@/hooks/useCoupon";
import toast from "react-hot-toast";

const CouponsPage = () => {
  const navigate = useNavigate();
  const { data: publicCoupons, isLoading } = useGetPublicCoupons();
  const [copiedCode, setCopiedCode] = useState(null);

  const coupons = publicCoupons?.data?.data || [];

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Copied "${code}"`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const daysLeft = (date) => {
    const diff = new Date(date) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors"
        >
          <div className="bg-white p-2 rounded-full shadow-sm group-hover:shadow mr-3 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </div>
          <span className="font-medium">Back</span>
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Tag className="w-8 h-8 text-indigo-500 mr-3" />
            Available Coupons
          </h1>
          <p className="text-gray-600 mt-2">
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {coupons.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">No coupons available</h2>
            <p className="text-gray-500">Check back later for new offers!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {coupons.map((coupon) => {
              const remaining = daysLeft(coupon.expiryDate);
              const isExpiringSoon = remaining <= 3;

              return (
                <div
                  key={coupon._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* left accent */}
                    <div className="sm:w-40 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 flex flex-col items-center justify-center text-white">
                      {coupon.discountType === "percentage" ? (
                        <>
                          <span className="text-3xl font-bold">{coupon.discountValue}%</span>
                          <span className="text-indigo-200 text-sm">OFF</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl font-bold">₹{coupon.discountValue}</span>
                          <span className="text-indigo-200 text-sm">OFF</span>
                        </>
                      )}
                    </div>

                    {/* details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{coupon.code}</h3>
                          <p className="text-gray-600 text-sm mt-1">{coupon.description}</p>
                        </div>
                        <button
                          onClick={() => handleCopy(coupon.code)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium"
                        >
                          {copiedCode === coupon.code ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        {coupon.minAmount > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            <IndianRupee className="w-3 h-3" />
                            Min order ₹{coupon.minAmount}
                          </span>
                        )}
                        {coupon.maxDiscount && (
                          <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                            <Percent className="w-3 h-3" />
                            Max discount ₹{coupon.maxDiscount}
                          </span>
                        )}
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${
                            isExpiringSoon
                              ? "bg-red-50 text-red-600"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {isExpiringSoon
                            ? `Expires in ${remaining} day${remaining !== 1 ? "s" : ""}`
                            : `Valid till ${formatDate(coupon.expiryDate)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsPage;
