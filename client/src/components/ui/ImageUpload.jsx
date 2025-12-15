import React, { useState } from "react";
import { Upload, X, Loader2, Crop } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/api/axiosConfig";
import ImageCropModal from "./ImageCropModal";
import { createCroppedImage } from "@/utils/cropImage";

const ImageUpload = ({
  value,
  onChange,
  endpoint = "/upload/image",
  label = "Upload Image",
  maxSize = 5,
  accept = "image/*",
  className = "",
  error = "",
  aspectRatio = 16 / 9,
  enableCrop = true
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size should be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Read file and show crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result);
      if (enableCrop) {
        setShowCropModal(true);
      } else {
        setPreview(reader.result);
        uploadImage(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedAreaPixels) => {
    try {
      const croppedBlob = await createCroppedImage(originalImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "cropped-image.jpg", { type: "image/jpeg" });

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(croppedFile);

      setShowCropModal(false);
      uploadImage(croppedFile);
    } catch (error) {
      console.error("Crop error:", error);
      toast.error("Failed to crop image");
    }
  };

  const uploadImage = async (file) => {

    setUploading(true);
    const uploadToast = toast.loading("Uploading image to Cloudinary...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        onChange(response.data.url);
        toast.success("Image uploaded successfully! ✨", { id: uploadToast });
      }
    } catch (error) {
      console.error("Upload error:", error);

      let errorMessage = "Error uploading image";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Not authenticated. Please log in again.";
      } else if (error.response?.status === 500) {
        errorMessage = "Server error. Check Cloudinary configuration.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, { id: uploadToast });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange("");
    toast.success("Image removed");
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-lg font-medium text-gray-700 mb-3">
          {label}
        </label>
      )}

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />

        {!preview ? (
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center justify-center"
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
            )}
            <p className="text-sm text-gray-600 mb-2">
              {uploading ? "Uploading..." : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP up to {maxSize}MB
            </p>
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            {!uploading && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {/* Crop Modal */}
      {showCropModal && originalImage && (
        <ImageCropModal
          image={originalImage}
          onCropComplete={handleCropComplete}
          onClose={() => {
            setShowCropModal(false);
            setOriginalImage(null);
          }}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
};

export default ImageUpload;
