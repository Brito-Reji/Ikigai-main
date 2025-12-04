import { Router } from "express"
import { createCourse, getAllCourseByInstructor, updateCourse, getCourseById, applyForVerification } from "../controllers/instructor/courseController.js"
import {
    getCourseChapters,
    createChapter,
    updateChapter,
    deleteChapter,
} from "../controllers/instructor/chapterController.js"

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
router.get("/profile", (req, res) => {
    res.send("Instructor Profile")
})

router.put('/profile', (req, res) => {
    res.send('Update Instructor Profile')
})



export default router