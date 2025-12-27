import React, { useState } from "react";
import { Mail, Save, Check } from "lucide-react";
import api from "@/api/axiosConfig.js";
import toast from "react-hot-toast";

export default function ChangeEmailSection({ currentEmail, authType }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    newEmail: "",
    password: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    newEmail: "",
    password: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  const validateStep1 = () => {
    const newErrors = { newEmail: "", password: "", otp: "" };

    if (!formData.newEmail) {
      newErrors.newEmail = "New email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.newEmail)) {
      newErrors.newEmail = "Please enter a valid email address";
    } else if (formData.newEmail === currentEmail) {
      newErrors.newEmail = "New email must be different from current email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.newEmail && !newErrors.password;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = window.location.pathname.includes('/instructor/') 
        ? "/instructor/profile/request-email-change" 
        : "/student/profile/request-email-change";
      const response = await api.post(endpoint, {
        newEmail: formData.newEmail,
        password: formData.password,
      });
      toast.success(response.data.message || "OTP sent to your new email");
      setStep(2);
      setErrors({ newEmail: "", password: "", otp: "" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const validateStep2 = () => {
    const newErrors = { newEmail: "", password: "", otp: "" };

    if (!formData.otp) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return !newErrors.otp;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = window.location.pathname.includes('/instructor/') 
        ? "/instructor/profile/verify-email-change" 
        : "/student/profile/verify-email-change";
      const response = await api.post(endpoint, {
        newEmail: formData.newEmail,
        otp: formData.otp,
      });
      toast.success(response.data.message || "Email changed successfully");
      setFormData({ newEmail: "", password: "", otp: "" });
      setErrors({ newEmail: "", password: "", otp: "" });
      setStep(1);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  if (authType === "google") {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Mail className="w-5 h-5 mr-2" />
        Change Email
      </h3>

      {step === 1 ? (
        <form onSubmit={handleRequestOTP}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Email
              </label>
              <input
                type="email"
                value={currentEmail}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.newEmail}
                onChange={(e) => {
                  setFormData({ ...formData, newEmail: e.target.value });
                  setErrors({ ...errors, newEmail: "" });
                }}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.newEmail ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.newEmail && (
                <p className="mt-1 text-sm text-red-500">{errors.newEmail}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setErrors({ ...errors, password: "" });
                }}
                placeholder="Enter your current password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center disabled:opacity-50"
            >
              <Mail className="w-4 h-4 mr-2" />
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                OTP sent to <strong>{formData.newEmail}</strong>. Please check your inbox.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => {
                  setFormData({ ...formData, otp: e.target.value });
                  setErrors({ ...errors, otp: "" });
                }}
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.otp ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-500">{errors.otp}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center disabled:opacity-50"
              >
                <Check className="w-4 h-4 mr-2" />
                {loading ? "Verifying..." : "Verify & Change Email"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
