import { Router } from "express";
import upload, { uploadCourseThumbnail, uploadProfileImage, uploadCategoryImage } from "../config/multer.js";
import { uploadImage, uploadMultipleImages, deleteImage } from "../controllers/upload/uploadController.js";

const router = Router();

// Course thumbnail upload (no auth for now - add back later if needed)
router.post("/course-thumbnail", uploadCourseThumbnail.single("image"), uploadImage);

// Profile image upload
router.post("/profile-image", uploadProfileImage.single("image"), uploadImage);

// Category image upload
router.post("/category-image", uploadCategoryImage.single("image"), uploadImage);

// General single image upload
router.post("/image", upload.single("image"), uploadImage);

// Multiple images upload
router.post("/images", upload.array("images", 10), uploadMultipleImages);

// Delete image
router.delete("/image", deleteImage);

export default router;
