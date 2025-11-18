import { Router } from 'express'
import { createCourse, getAllCourseByInstructor } from '../controllers/instructor/courseController.js'



const router = Router()

router.get('/course', (req, res) => {
    res.send('helloo')
})

router.post('/courses/create', createCourse)

export default router