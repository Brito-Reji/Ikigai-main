// server/models/Enrollment.js
import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled", "refunded"],
    default: "active",
  },
  progress: {
    completedLessons: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    }],
    lastAccessedLesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    },
    lastAccessedAt: Date,
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  completedAt: Date,
  certificateIssued: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Compound index for faster queries
enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });
enrollmentSchema.index({ course: 1, status: 1 });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);