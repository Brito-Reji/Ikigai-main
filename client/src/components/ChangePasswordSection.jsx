import React, { useState } from "react";
import { Lock, Save } from "lucide-react";
import api from "@/api/axiosConfig.js";
import Swal from "sweetalert2";

export default function ChangePasswordSection({ authType }) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "New passwords do not match",
        confirmButtonColor: "#ef4444",
      });
      return;
    }

    setLoading(true);

    try {
      const endpoint = window.location.pathname.includes('/instructor/') 
        ? "/instructor/profile/change-password" 
        : "/student/profile/change-password";
      const response = await api.put(endpoint, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data.message,
        confirmButtonColor: "#14b8a6",
      });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Failed to change password",
        confirmButtonColor: "#ef4444",
      });
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
        <Lock className="w-5 h-5 mr-2" />
        Change Password
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              required
              placeholder="Enter your current password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              required
              placeholder="Enter new password (min 6 characters)"
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
              placeholder="Confirm new password"
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
