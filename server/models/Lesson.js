import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    title: { type: String, required: true },
    duration: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    description: { type: String },
    resources: { type: String },
    order: { type: Number, required: true },
    videoUrl: { type: String },
  },
  { timestamps: true }
);

export const Lesson = mongoose.model('lesson',lessonSchema)
