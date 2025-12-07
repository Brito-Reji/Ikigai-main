import asyncHandler from "express-async-handler";
import cloudinary from "../../config/cloudinary.js";

// Upload single image
export const uploadImage = asyncHandler(async (req, res) => {
  try {

    if (!req.file) {
      console.error("No file in request");
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }


    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
});

// Upload multiple images
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded",
      });
    }

    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename,
    }));

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      files: uploadedFiles,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      message: "Error uploading images",
      error: error.message,
    });
  }
});

// Delete image
export const deleteImage = asyncHandler(async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: "Public ID is required",
      });
    }

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
});
