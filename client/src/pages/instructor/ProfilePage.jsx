import React from "react";
import { Mail, Phone, Briefcase, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile.js";
import ChangeEmailSection from "@/components/ChangeEmailSection.jsx";
import ChangePasswordSection from "@/components/ChangePasswordSection.jsx";

export default function InstructorProfilePage() {
  const navigate = useNavigate();
  const { data: profileData, isLoading } = useProfile();
  const profile = profileData?.data;
  console.log("profile->", profile);
  console.log(profileData)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={() => navigate("/instructor/profile/edit")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition flex items-center"
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
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-indigo-600">
                    {profile?.firstName?.[0] || "I"}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-gray-600">{profile?.headline || "Instructor"}</p>
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
              <span className="text-gray-600">Headline:</span>
              <span className="font-medium">{profile?.headline || "Not provided"}</span>
            </div>
            {profile?.description && (
              <div>
                <span className="text-gray-600">About:</span>
                <p className="mt-1 text-gray-900">{profile.description}</p>
              </div>
            )}
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
