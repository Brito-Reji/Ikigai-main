import { Router } from "express"
import { createCourse, getAllCourseByInstructor, updateCourse, getCourseById } from "../controllers/instructor/courseController.js"
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

// Chapter routes
router.get("/courses/:courseId/chapters", getCourseChapters)
router.post("/courses/:courseId/chapters", createChapter)
router.put("/courses/:courseId/chapters/:chapterId", updateChapter)
router.delete("/courses/:courseId/chapters/:chapterId", deleteChapter)



export default router