import express from 'express'
import { studentRegister } from '../controllers/students/studentController.js'
import { instructorRegister } from '../controllers/students/instructorController.js'
import { adminLogin } from '../controllers/admin/adminController.js'
import { instructorSignin } from '../controllers/instructor/instructorController.js'


const router = express.Router()

router.get('/instructor/register', instructorRegister)
router.get('/instructor/signin',instructorSignin)

router.post('/student/register', studentRegister)

router.post('/admin/login',adminLogin)

export default router