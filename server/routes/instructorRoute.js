import { Router } from "express"
import { createCourse, getAllCourseByInstructor, updateCourse, getCourseById, applyForVerification } from "../controllers/instructor/courseController.js"
import {
    getCourseChapters,
    createChapter,
    updateChapter,
    deleteChapter,
} from "../controllers/instructor/chapterController.js"
import { getInstructorProfile } from "../controllers/instructor/profileController.js"

const router = Router()

// Course routes
router.post("/courses", createCourse)
router.get("/courses", getAllCourseByInstructor)
router.get("/courses/:courseId", getCourseById)
router.put("/courses/:courseId", updateCourse)
router.post("/courses/:courseId/apply-verification", applyForVerification)

// Chapter routes
router.get("/courses/:courseId/chapters", getCourseChapters)
router.post("/courses/:courseId/chapters", createChapter)
router.put("/courses/:courseId/chapters/:chapterId", updateChapter)
router.delete("/courses/:courseId/chapters/:chapterId", deleteChapter)

// Profile Routes
import { getProfile, updateProfile, requestEmailChangeOTP, verifyEmailChangeOTP, changePassword } from "../controllers/instructor/instructorProfileController.js";

router.get("/profile", getProfile)
router.put("/profile", updateProfile)
router.post("/profile/request-email-change", requestEmailChangeOTP)
router.post("/profile/verify-email-change", verifyEmailChangeOTP)
router.put("/profile/change-password", changePassword)



export default router