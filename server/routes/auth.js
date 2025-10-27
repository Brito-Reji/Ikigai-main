import express from 'express'
import { studentRegister } from '../controllers/students/studentController.js'
import jwt from 'jsonwebtoken'
import { adminLogin } from '../controllers/admin/adminController.js'
import { instructorRegister, instructorSignin } from '../controllers/instructor/instructorController.js'
import { getMe } from '../middlewares/auth.js'
import { User } from 'lucide-react'


const router = express.Router()
// Instrucotr Route
router.post('/instructor/register', instructorRegister)
router.post('/instructor/signin',instructorSignin)

router.post('/student/register', studentRegister)

router.post('/admin/login', adminLogin)

router.get('/refresh',async (req,res)=>{
try{
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(403).json({message:"no refresh token found"})
    }
    jwt.verify(refreshToken,process.env.REFRESH_SECRET,(error,userData)=>{
        if(error){
            return res.status(403).json({message:"invalid refrsh token"})
        }
        const accessToken = jwt.sign(
            { id: userData.id, role: userData.role },
            process.env.ACCESS_SECRET,
            { expiresIn: "15m" }
          );
          return res.json({accessToken})
    })
}catch(err){
    res.status(500).json({ message: "Server error", error });

}
})

// get me

router.get('/me', getMe)

export default router