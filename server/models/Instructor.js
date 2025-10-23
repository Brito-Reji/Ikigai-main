import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    about: { type: String },
    expertise: [{ type: String }],
    experience: { type: String },
  },
  { timestamps: true }
);

export const Instructor = mongoose.model('Instructor',instructorSchema)