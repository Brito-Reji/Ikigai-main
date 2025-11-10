import mongoose, { Schema } from "mongoose";

const instructorSchema = new Schema(
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
      unique: true,
      sparse: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },

    password: {
      type: String,

      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: ["admin", "instructor", "student"],
      default: "instructor",
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
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

export const Instructor = mongoose.model("Instructor", instructorSchema);
