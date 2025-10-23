import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const Chapter = mongoose.model("Chapter", chapterSchema)
