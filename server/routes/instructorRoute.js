import { Router } from 'express'
import { createCourse, getAllCourseByInstructor } from '../controllers/instructor/courseController.js'



const router = Router()

router.post('/courses', createCourse)
router.get('/courses', getAllCourseByInstructor)

export default router