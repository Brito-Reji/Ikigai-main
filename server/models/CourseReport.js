import mongoose from "mongoose";

const courseReportSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      enum: [
        "inappropriate_content",
        "misleading_information",
        "poor_quality",
        "copyright_violation",
        "spam",
        "other",
      ],
      required: true,
    },
    otherReason: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ["pending", "dismissed", "actioned"],
      default: "pending",
    },
    adminNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

courseReportSchema.index({ courseId: 1, reportedBy: 1 }, { unique: true });

export const CourseReport = mongoose.model("CourseReport", courseReportSchema);
