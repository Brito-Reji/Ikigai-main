import { Router } from 'express'
import { createCourse, getAllCourseByInstructor, updateCourse, getCourseById } from '../controllers/instructor/courseController.js'

const router = Router()

router.post('/courses', createCourse)
router.get('/courses', getAllCourseByInstructor)
router.get('/courses/:courseId', getCourseById)
router.put('/courses/:courseId', updateCourse)

export default router