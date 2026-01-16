import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

const CouponModal = ({ isOpen, onClose, onSubmit, coupon, mode }) => {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minAmount: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
    perUserLimit: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && coupon) {
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minAmount: coupon.minAmount,
        maxDiscount: coupon.maxDiscount || "",
        expiryDate: coupon.expiryDate
          ? new Date(coupon.expiryDate).toISOString().split("T")[0]
          : "",
        usageLimit: coupon.usageLimit,
        perUserLimit: coupon.perUserLimit || "",
        description: coupon.description,
      });
    } else {
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minAmount: "",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: "",
        perUserLimit: "",
        description: "",
      });
    }
    setErrors({});
  }, [mode, coupon, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Coupon code is required";
    } else if (!/^[A-Z0-9]+$/.test(formData.code)) {
      newErrors.code = "Code must be uppercase letters and numbers only";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (formData.discountType === "percentage" && formData.discountValue > 100) {
      newErrors.discountValue = "Percentage cannot exceed 100%";
    }

    if (!formData.minAmount || formData.minAmount < 0) {
      newErrors.minAmount = "Minimum amount must be 0 or greater";
    }

    if (formData.discountType === "percentage" && formData.maxDiscount && formData.maxDiscount <= 0) {
      newErrors.maxDiscount = "Maximum discount must be greater than 0";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (new Date(formData.expiryDate) < new Date()) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }

    if (formData.usageLimit && formData.usageLimit <= 0) {
      newErrors.usageLimit = "Usage limit must be greater than 0";
    }

    if (formData.perUserLimit && formData.perUserLimit <= 0) {
      newErrors.perUserLimit = "Per user limit must be greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      discountValue: Number(formData.discountValue),
      minAmount: Number(formData.minAmount),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      perUserLimit: formData.perUserLimit ? Number(formData.perUserLimit) : null,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .coupon-input::placeholder {
          color: #9ca3af;
          opacity: 1;
        }
        .coupon-input:focus::placeholder {
          color: #d1d5db;
          opacity: 1;
        }
      `}</style>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h3 className="text-xl font-semibold text-gray-800">
            {mode === "add" ? "Add New Coupon" : "Edit Coupon"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 uppercase ${
                    errors.code ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="SAVE20"
                  disabled={mode === "edit"}
                />
                {errors.code && (
                  <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="discountValue"
                  value={formData.discountValue}
                  onChange={handleChange}
                  className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.discountValue ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={formData.discountType === "percentage" ? "20" : "200"}
                  min="0"
                  step="0.01"
                />
                {errors.discountValue && (
                  <p className="text-red-500 text-sm mt-1">{errors.discountValue}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Purchase (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="minAmount"
                  value={formData.minAmount}
                  onChange={handleChange}
                  className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.minAmount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="500"
                  min="0"
                  step="0.01"
                />
                {errors.minAmount && (
                  <p className="text-red-500 text-sm mt-1">{errors.minAmount}</p>
                )}
              </div>
            </div>

            {formData.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Discount Cap (₹)
                </label>
                <input
                  type="number"
                  name="maxDiscount"
                  value={formData.maxDiscount}
                  onChange={handleChange}
                  className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.maxDiscount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="1000"
                  min="0"
                  step="0.01"
                />
                {errors.maxDiscount && (
                  <p className="text-red-500 text-sm mt-1">{errors.maxDiscount}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Leave empty for no cap
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.expiryDate ? "border-red-500" : "border-gray-300"
                  }`}
                  min={new Date().toISOString().split("T")[0]}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleChange}
                  className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                    errors.usageLimit ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Leave empty for unlimited"
                  min="1"
                />
                {errors.usageLimit && (
                  <p className="text-red-500 text-sm mt-1">{errors.usageLimit}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">
                  Total uses across all users. Leave empty for unlimited
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per User Limit
              </label>
              <input
                type="number"
                name="perUserLimit"
                value={formData.perUserLimit}
                onChange={handleChange}
                className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.perUserLimit ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Leave empty for unlimited per user"
                min="1"
              />
              {errors.perUserLimit && (
                <p className="text-red-500 text-sm mt-1">{errors.perUserLimit}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Max uses per user. Leave empty for unlimited per user
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`coupon-input w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Get 20% off on all courses"
                rows="3"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
            >
              {mode === "add" ? "Add Coupon" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};

export default CouponModal;
