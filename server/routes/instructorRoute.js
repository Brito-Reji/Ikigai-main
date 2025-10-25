import { Router } from 'express'
import { getAllCourseByInstructor } from '../controllers/instructor/courseController.js'
import { verifyInstructor } from '../middlewares/auth.js'

const router = Router()

router.get('/course', getAllCourseByInstructor)

// router.post('/course/create')

export default router