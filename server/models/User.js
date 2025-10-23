import mongoose, {Schema} from "mongoose";



const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      default: "student",
      required: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [100, "Headline cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    language: {
      type: String,
      trim: true,
      default: "en",
    },
    profileImageUrl: {
      type: String,
      trim: true,
    },
    social: {
      website: { type: String, trim: true },
      twitter: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      youtube: { type: String, trim: true },
    },
  },
  {
    timestamps: true, 
  }
);


export const User = mongoose.model('User', userSchema)
