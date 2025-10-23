import express from 'express'
import { studentRegister } from '../controllers/students/studentController.js'


const router = express.Router()

// router.get('/instructor/sign-up',)

router.post('/student/register',studentRegister)

export default router