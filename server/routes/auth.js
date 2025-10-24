import express from 'express'
import { studentRegister } from '../controllers/students/studentController.js'
import { instructorRegister } from '../controllers/students/instructorController.js'


const router = express.Router()

router.get('/instructor/register',instructorRegister)

router.post('/student/register',studentRegister)

export default router