import { Router } from "express";
import {
  createCourse,
  getAllCourseByInstructor,
  updateCourse,
  getCourseById,
  applyForVerification,
  togglePublish,
} from "../controllers/instructor/courseController.js";
import {
  getCourseChapters,
  createChapter,
  updateChapter,
  deleteChapter,
  getLessons,
  addLesson,
  updateLesson,
  deleteLesson,
} from "../controllers/instructor/chapterController.js";
import {
  uploadVideo,
  getVideoUrl,
} from "../controllers/instructor/videoController.js";
import multer from "multer";

const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
});

const router = Router();

// Course routes
router.post("/courses", createCourse);
router.get("/courses", getAllCourseByInstructor);
router.get("/courses/:courseId", getCourseById);
router.put("/courses/:courseId", updateCourse);
router.post("/courses/:courseId/apply-verification", applyForVerification);
router.patch("/courses/:courseId/toggle-publish", togglePublish);

// Chapter routes
router.get("/courses/:courseId/chapters", getCourseChapters);
router.post("/courses/:courseId/chapters", createChapter);
router.put("/courses/:courseId/chapters/:chapterId", updateChapter);
router.delete("/courses/:courseId/chapters/:chapterId", deleteChapter);

// Lesson routes
router.get("/courses/:courseId/chapters/:chapterId/lessons", getLessons);
router.post("/courses/:courseId/chapters/:chapterId/lessons", addLesson);
router.put(
  "/courses/:courseId/chapters/:chapterId/lessons/:lessonId",
  updateLesson
);
router.delete(
  "/courses/:courseId/chapters/:chapterId/lessons/:lessonId",
  deleteLesson
);

// Video upload
router.post("/upload-video", upload.single("video"), uploadVideo);
router.get("/video-url", getVideoUrl);

// Profile Routes
import {
  getProfile,
  updateProfile,
  requestEmailChangeOTP,
  verifyEmailChangeOTP,
  changePassword,
} from "../controllers/instructor/instructorProfileController.js";

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/request-email-change", requestEmailChangeOTP);
router.post("/profile/verify-email-change", verifyEmailChangeOTP);
router.put("/profile/change-password", changePassword);

// Dashboard Routes
import {
  getDashboardStats,
  getTransactions,
} from "../controllers/instructor/dashboardController.js";

router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/transactions", getTransactions);

// Revenue Routes
import {
  getRevenueStats,
  getMonthlyRevenue,
  getCourseRevenue,
} from "../controllers/instructor/revenueController.js";

router.get("/revenue/stats", getRevenueStats);
router.get("/revenue/monthly", getMonthlyRevenue);
router.get("/revenue/by-course", getCourseRevenue);

// Chat Routes
import {
  getConversations,
  getMessages,
  getCourseRooms,
  getRoomMessages,
  getRoomParticipants,
} from "../controllers/instructor/instructorChatController.js";

router.get("/chat/conversations", getConversations);
router.get("/chat/conversations/:conversationId/messages", getMessages);
router.get("/chat/rooms", getCourseRooms);
router.get("/chat/rooms/:roomId/messages", getRoomMessages);
router.get("/chat/rooms/:roomId/participants", getRoomParticipants);

export default router;
