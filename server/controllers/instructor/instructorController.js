import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import { User } from '../../models/User.js'
import jwt from 'jsonwebtoken'
// import { User } from './model/'

export const instructorRegister = asyncHandler(async (req, res) => {
  let { email, username, firstname, lastname, password } = req.body;

  if (!email || !username || !firstname || !lastname || !password || !role) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all requird fields" });
  }
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  console.log(existingUser)
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: "email or username  already exist" });

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address",
    });
  }

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }
    
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    User.create({
        email: email.toLowerCase(),
      password: hashedPassword,
        username,
        firstname,
        lastname,
        role:'instructor'
    })
  
  let token = jwt.sign(
    {
      email,
      username,
      role,
    },
    process.env.JWT_SECRET
    , {
    expiresIn:86400
  });
  return res.json({
    success: true,
    message: "Account created successfully",
    data: {
      user: {
        email,
        username,
        firstname,
        lastname,
        role,
        profileImageUrl: null,
      },
  token
    },
  });
    
    
})







