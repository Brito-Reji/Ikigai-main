import { createClient } from "redis";
import asyncHandler from 'express-async-handler'
const redisClient = createClient();
await redisClient.connect();


export const sentOTP = asyncHandler(async (req, res) => {
  console.log(req.body)
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // Save OTP in Redis with expiry (120 seconds)]
  console.log(otp);
  await redisClient.setEx(`otp:${email}`, 120, otp);

  console.log(`OTP for ${email}: ${otp}`); // In real app, send via SMS/email
  res.json({ message: "OTP sent successfully" });
});



export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = await redisClient.get(`otp:${email}`);
  if (!storedOtp)
    return res.status(400).json({ message: "OTP expired or invalid" });

  if (storedOtp === otp) {
    await redisClient.del(`otp:${email}`); // Delete OTP after success
    return res.status(200).json({ message: "OTP verified successfully" });
  } else {
    return res.status(400).json({ message: "Invalid OTP" });
  }
})


