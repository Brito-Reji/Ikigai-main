import { Instructor } from '../../models/Instructor.js';
import { Otp } from '../../models/Otp.js';
import bcrypt from 'bcrypt';
import { sendOtpEmail } from '../../utils/emailService.js';

export const getInstructorProfileSerice = async req => {
  let InstructorProfile = await Instructor.findById(req.user._id).select(
    '-password'
  );
  return InstructorProfile;
};

export const updateInstructorProfileService = async req => {
  const { name, email, password, bio, website } = req.body;
  const user = req.user;

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.website = website || user.website;

    if (password) {
      user.password = password;
    }

    const updatedUser = await user.save();
    return updatedUser;
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

export const requestEmailChangeOTPService = async (
  userId,
  newEmail,
  password
) => {
  const instructor = await Instructor.findById(userId).select('+password');

  if (!instructor) {
    throw new Error('Instructor not found');
  }

  if (instructor.authType !== 'email') {
    throw new Error('Cannot change email for Google authenticated users');
  }

  const isPasswordValid = await bcrypt.compare(password, instructor.password);
  if (!isPasswordValid) {
    const error = new Error('Invalid password');
    error.statusCode = 401;
    throw error;
  }

  const emailExists = await Instructor.findOne({ email: newEmail });
  if (emailExists) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.findOneAndDelete({ email: newEmail });
  await Otp.create({
    email: newEmail,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  await sendOtpEmail(newEmail, otp);

  return { message: 'OTP sent to new email address' };
};

export const verifyEmailChangeOTPService = async (userId, newEmail, otp) => {
  const otpRecord = await Otp.findOne({ email: newEmail, otp });

  if (!otpRecord) {
    throw new Error('Invalid OTP');
  }

  if (otpRecord.expiresAt < new Date()) {
    await Otp.findByIdAndDelete(otpRecord._id);
    throw new Error('OTP has expired');
  }

  const instructor = await Instructor.findById(userId);

  if (!instructor) {
    throw new Error('Instructor not found');
  }

  instructor.email = newEmail;
  instructor.isVerified = true;
  await instructor.save();

  await Otp.findByIdAndDelete(otpRecord._id);

  return { message: 'Email updated successfully' };
};

export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  if (newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long');
  }

  const instructor = await Instructor.findById(userId).select('+password');

  if (!instructor) {
    throw new Error('Instructor not found');
  }

  if (instructor.authType !== 'email') {
    throw new Error('Cannot change password for Google authenticated users');
  }

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    instructor.password
  );
  if (!isPasswordValid) {
    const error = new Error('Current password is incorrect');
    error.statusCode = 401;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  instructor.password = hashedPassword;
  await instructor.save();

  return { message: 'Password changed successfully' };
};
