import React from "react";
import { Mail, Phone, MapPin, Edit, BookOpen, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile.js";


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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => navigate("/profile/edit")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center shadow-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Horizontal Profile Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row items-center gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full relative overflow-hidden ring-4 ring-white shadow-sm">
                {profile?.profileImageUrl ? (
                  <img
                    src={profile.profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <span className="text-2xl font-bold">{profile?.firstName?.[0] || "S"}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {profile?.firstName} {profile?.lastName}
              </h2>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Student
                </span>
              </div>
            </div>

            {/* Stats (Horizontal in Header) */}
            <div className="flex gap-8 border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-8 mt-4 md:mt-0 justify-center md:justify-end w-full md:w-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <div className="flex items-center text-xs text-gray-500 gap-1 justify-center">
                  <BookOpen className="w-3 h-3" /> Enrolled
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <div className="flex items-center text-xs text-gray-500 gap-1 justify-center">
                  <ShoppingBag className="w-3 h-3" /> Completed
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">0</p>
                <div className="flex items-center text-xs text-gray-500 gap-1 justify-center">
                  <span className="text-[10px]">⭐</span> Certificates
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="p-6 md:p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address</label>
                <div className="flex items-center text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  {profile?.email}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone Number</label>
                <div className="flex items-center text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  {profile?.phone || "Not provided"}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Address</label>
                <div className="flex items-center text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <MapPin className="w-4 h-4 text-gray-400 mr-3" />
                  {profile?.address || "Not provided"}
                </div>
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>
  );
}
