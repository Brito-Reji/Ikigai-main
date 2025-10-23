import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    overview: { type: String },
    keyLearning: { type: String },
    instructor: { type: String },
    duration: { type: Number, default: 0 },
    thumbnail: { type: String },
    isPublished: { type: Boolean, default: false },
    language: { type: String, default: "en" },
    price: { type: mongoose.Schema.Types.Decimal128, required: true },
  },
  { timestamps: true }
);


export const Course = mongoose.model("Course",courseSchema)