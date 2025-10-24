import { Router } from 'express'
import { getAllCourseByInstructor } from '../controllers/instructor/courseController.js'
import { verifyInstructor } from '../middlewares/auth.js'

const router = Router()

router.get('/course', verifyInstructor,getAllCourseByInstructor)

export default router