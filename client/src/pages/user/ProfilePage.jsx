import React from "react";
import { Mail, Phone, MapPin, Edit, BookOpen, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile.js";
import ChangeEmailSection from "@/components/ChangeEmailSection.jsx";
import ChangePasswordSection from "@/components/ChangePasswordSection.jsx";

export default function StudentProfilePage() {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();
  const profile = profileData?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => navigate("/profile/edit")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </button>
          </div>

          {/* Profile Image */}
          <div className="flex items-center gap-6 mb-6">
            <div className="relative">
              {profile?.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-blue-600">
                    {profile?.firstName?.[0] || "S"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-gray-600">Student</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Enrolled Courses</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-yellow-500 text-xl">⭐</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">0</p>
              <p className="text-sm text-gray-600">Certificates</p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{profile?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phone:</span>
              <span className="font-medium">{profile?.phone || "Not provided"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Address:</span>
              <span className="font-medium">{profile?.address || "Not provided"}</span>
            </div>
          </div>
        </div>

        {/* Account Security - Only for email/password users */}
        {profile?.authType === "email" && (
          <>
            <ChangeEmailSection currentEmail={profile?.email} authType={profile?.authType} />
            <div className="mt-6">
              <ChangePasswordSection authType={profile?.authType} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
