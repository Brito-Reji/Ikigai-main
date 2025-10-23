import mongoose from 'mongoose'
const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    expires: "5m", // OTP expires in 5 minutes
    default: Date.now,
  },
});

module.exports = mongoose.model("OTP", otpSchema);
