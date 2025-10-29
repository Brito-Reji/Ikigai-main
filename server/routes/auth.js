import express from 'express'
import { studentRegister } from '../controllers/students/studentController.js'
import jwt from 'jsonwebtoken'
import { adminLogin } from '../controllers/admin/adminController.js'
import { instructorRegister, instructorSignin } from '../controllers/instructor/instructorController.js'
import { User } from '../models/User.js'
import { sentOTP } from '../utils/OTPServices.js'


const router = express.Router()
// Instructor Routes
router.post('/instructor/register', instructorRegister)
router.post('/instructor/signin',instructorSignin)

router.post('/student/register', studentRegister)

router.post('/admin/login', adminLogin)


// OTP

router.post('/send-otp', sentOTP)
// router.post('/verify-otp',verifyOTP)

// router.get('/refresh',async (req,res)=>{
//   try{
//     const incomingToken = req.cookies?.refreshToken || req.headers['x-refresh-token'] || req.query.refreshToken
//     if(!incomingToken){
//       return res.status(403).json({ success:false, message:"No refresh token provided" })
//     }

//     // Verify token
//     let decoded
//     try {
//       decoded = jwt.verify(incomingToken, process.env.JWT_SECRET)
//     } catch (e) {
//       return res.status(403).json({ success:false, message:"Invalid refresh token" })
//     }

//     const user = await User.findById(decoded.id)
//     if(!user){
//       return res.status(403).json({ success:false, message:"User not found" })
//     }
//     if(user.isBlocked){
//       return res.status(403).json({ success:false, message:"Account is blocked" })
//     }
//     if(user.refreshToken !== incomingToken){
//       return res.status(403).json({ success:false, message:"Invalid refresh token" })
//     }

//     // Rotate refresh token
//     const newRefreshToken = jwt.sign({ id:user._id, role:user.role }, process.env.JWT_SECRET, { expiresIn:'7d' })
//     user.refreshToken = newRefreshToken
//     await user.save({ validateBeforeSave:false })

//     // Issue new access token
//     const accessToken = jwt.sign(
//       { id: user._id, email: user.email, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '15m' }
//     )

//     return res.json({ success:true, data: { accessToken, refreshToken: newRefreshToken } })
//   }catch(err){
//     return res.status(500).json({ success:false, message: "Server error", error: err.message });
//   }
// })

// Get current user from access token
router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.authToken
    if(!token){
      return res.status(401).json({ success:false, message:'No token provided' })
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return res.status(200).json({ success:true, user: { id: decoded.id, email: decoded.email, username: decoded.username, role: decoded.role } })
  } catch (err) {
    return res.status(401).json({ success:false, message:'Invalid token' })
  }
})

 

export default router