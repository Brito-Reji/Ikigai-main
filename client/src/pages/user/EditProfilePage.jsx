import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Mail, Phone, MapPin, User, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload.jsx";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile.js";
import toast from "react-hot-toast";
import ChangeEmailSection from "@/components/profile/ChangeEmailSection.jsx";
import ChangePasswordSection from "@/components/profile/ChangePasswordSection.jsx";

export default function EditStudentProfilePage() {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();
  const updateMutation = useUpdateProfile();
  const profile = profileData?.data;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profileImageUrl: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    phone: "",
  });

  useEffect(() => {
    if (profileData?.data) {
      setFormData({
        firstName: profileData.data.firstName || "",
        lastName: profileData.data.lastName || "",
        email: profileData.data.email || "",
        phone: profileData.data.phone || "",
        profileImageUrl: profileData.data.profileImageUrl || "",
    
      });
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (url) => {
    setFormData({ ...formData, profileImageUrl: url });
  };

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      phone: "",
    };

    // Validate first name
    if (!formData.firstName || !formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    // Validate phone (optional but if provided should be valid)
    if (formData.phone && formData.phone.trim()) {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    setErrors(newErrors);
    return !newErrors.firstName && !newErrors.phone;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateMutation.mutateAsync(formData);
      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header Navigation */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

          {/* Horizontal Profile Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-center gap-6">
            <div className="relative group flex-shrink-0">
              <div className="w-20 h-20 rounded-full relative overflow-hidden ring-4 ring-white shadow-sm">
                {formData.profileImageUrl ? (
                  <img
                    src={formData.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1">
                <ProfileImageUpload
                  currentImage={formData.profileImageUrl}
                  onImageUpload={handleImageChange}
                  disabled={updateMutation.isPending}
                />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h3 className="text-lg font-bold text-gray-900">{formData.firstName} {formData.lastName}</h3>
              <p className="text-sm text-gray-500">{formData.email}</p>
              <p className="text-xs text-blue-600 mt-1 font-medium">Student Account</p>
            </div>

            {/* Pro Tip Box (Horizontal) */}
            <div className="bg-blue-50/80 rounded-lg p-3 border border-blue-100 max-w-md hidden lg:block">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-blue-100 rounded-md text-blue-600 mt-0.5">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-blue-900">Professional Photo?</p>
                  <p className="text-xs text-blue-700 leading-tight mt-0.5">
                    A clear profile picture helps instructors recognize you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {/* 3-Column Grid for Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                  placeholder="Doe"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-2.5 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Second Row: Email & Address */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Email (Read Only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
                {profileData?.data?.authType === "email" && (
                  <p className="text-xs text-gray-500 mt-1.5 text-right">
                    <button type="button" onClick={() => document.getElementById('change-email-section')?.scrollIntoView({ behavior: 'smooth' })} className="text-blue-600 hover:underline">Change Email Below</button>
                  </p>
                )}
              </div>

            
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate("/profile")}
                className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all font-medium shadow-md shadow-blue-100 flex items-center"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>

          </form>
        </div>

        {/* Security & Account Settings (Moved from Profile Page) */}
        {profile?.authType === "email" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8" id="change-email-section">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Password</h3>
              <ChangePasswordSection authType={profile?.authType} />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Email Address</h3>
              <ChangeEmailSection currentEmail={profile?.email} authType={profile?.authType} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
