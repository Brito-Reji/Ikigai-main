import React, { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axiosConfig";

const ProfileImageUpload = ({ currentImage, onImageUpload, disabled = false }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setUploading(true);
    const uploadToast = toast.loading("Uploading image...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        onImageUpload(response.data.url);
        toast.success("Image uploaded successfully!", { id: uploadToast });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Failed to upload image", {
        id: uploadToast,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="profile-image-upload"
        disabled={uploading || disabled}
      />
      <label
        htmlFor="profile-image-upload"
        className={`absolute bottom-0 right-0 p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-lg ${uploading || disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Camera className="w-4 h-4" />
        )}
      </label>
    </div>
  );
};

export default ProfileImageUpload;
