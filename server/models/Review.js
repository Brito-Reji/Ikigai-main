import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    description: { type: String },
    rating: { type: mongoose.Schema.Types.Decimal128, required: true },
  },
  { timestamps: true }
);


const Review = mongoose.model("Review",reviewSchema)
