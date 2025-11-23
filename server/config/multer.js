import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Course thumbnails storage
const courseThumbnailStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ikigai/course-thumbnails",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, height: 450, crop: "limit" }]
    },
});

// Profile images storage
const profileImageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ikigai/profile-images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
    },
});

// Category images storage
const categoryImageStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ikigai/category-images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 600, height: 400, crop: "limit" }]
    },
});

// General upload storage
const generalStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "ikigai/general",
        allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf", "doc", "docx"]
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, PDF, and DOC files are allowed.'), false);
    }
};

// Create different upload instances
export const uploadCourseThumbnail = multer({
    storage: courseThumbnailStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadProfileImage = multer({
    storage: profileImageStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

export const uploadCategoryImage = multer({
    storage: categoryImageStorage,
    fileFilter,
    limits: { fileSize: 3 * 1024 * 1024 }
});

const upload = multer({
    storage: generalStorage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export default upload;
