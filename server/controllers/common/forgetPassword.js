import asyncHandler from 'express-async-handler'
import api from '../../config/axiosConfig.js';
export const forgetPassword = asyncHandler(async (req, res) => {
  let { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "no email is provided",
    });
  }
  if (email) {
    const response = await api.post("/send-otp");
    console.log(response);
  }
});
