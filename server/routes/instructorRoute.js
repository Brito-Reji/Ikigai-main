import { Router } from "express"
import { createCourse, getAllCourseByInstructor, updateCourse, getCourseById, applyForVerification, togglePublish } from "../controllers/instructor/courseController.js"
import {
    getCourseChapters,
    createChapter,
    updateChapter,
    deleteChapter,
    getLessons,
    addLesson,
    updateLesson,
    deleteLesson,
} from "../controllers/instructor/chapterController.js"
import { uploadVideo, getVideoUrl } from "../controllers/instructor/videoController.js"
import { streamVideo, streamVideoOptions } from "../controllers/instructor/streamController.js"
import multer from "multer"

const upload = multer({ dest: "uploads/" })
import { getInstructorProfile } from "../controllers/instructor/profileController.js"

const router = Router()

// Course routes
router.post("/courses", createCourse)
router.get("/courses", getAllCourseByInstructor)
router.get("/courses/:courseId", getCourseById)
router.put("/courses/:courseId", updateCourse)
router.post("/courses/:courseId/apply-verification", applyForVerification)
router.patch("/courses/:courseId/toggle-publish", togglePublish)

// Chapter routes
router.get("/courses/:courseId/chapters", getCourseChapters)
router.post("/courses/:courseId/chapters", createChapter)
router.put("/courses/:courseId/chapters/:chapterId", updateChapter)
router.delete("/courses/:courseId/chapters/:chapterId", deleteChapter)

// Lesson routes
router.get("/courses/:courseId/chapters/:chapterId/lessons", getLessons)
router.post("/courses/:courseId/chapters/:chapterId/lessons", addLesson)
router.put("/courses/:courseId/chapters/:chapterId/lessons/:lessonId", updateLesson)
router.delete("/courses/:courseId/chapters/:chapterId/lessons/:lessonId", deleteLesson)

// Video upload
router.post("/upload-video", upload.single("video"), uploadVideo)
router.get("/video-url", getVideoUrl)
router.get("/stream-video", streamVideo)
router.options("/stream-video", streamVideoOptions)

// Profile Routes
import { getProfile, updateProfile, requestEmailChangeOTP, verifyEmailChangeOTP, changePassword } from "../controllers/instructor/instructorProfileController.js";

router.get("/profile", getProfile)
router.put("/profile", updateProfile)
router.post("/profile/request-email-change", requestEmailChangeOTP)
router.post("/profile/verify-email-change", verifyEmailChangeOTP)
router.put("/profile/change-password", changePassword)



export default router