import asyncHandler from 'express-async-handler'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { User } from '../../models/User'
// import { User } from './model/'

const studentRegister = asyncHandler(async (req,res) => {
    let { email, username, firstname, lastname, password, role } = req.body
    
    const student = User.findOne({ email });

    if (student) return res.status(400).json({ message: "Email already exist" });

    
    
})

const studentLogin = asyncHandler(async (req, res) => { });

const studentForgetPassword = asyncHandler(async (req, res) => { });


const studentAddToCart = asyncHandler(async (req, res) => { });

const verifyOtp = asyncHandler((req, res) => {
    
})





