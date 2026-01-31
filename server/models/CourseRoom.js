import mongoose from "mongoose";

const courseRoomSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      unique: true,
    },
    lastMessage: {
      content: String,
      senderName: String,
      sender: mongoose.Schema.Types.ObjectId,
      senderModel: {
        type: String,
        enum: ["User", "Instructor"],
      },
      timestamp: Date,
    },
    // track unread per user
    unreadCounts: {
      type: Map,
      of: Number,
      default: new Map(),
    },
  },
  { timestamps: true }
);

courseRoomSchema.index({ course: 1 });

export const CourseRoom = mongoose.model("CourseRoom", courseRoomSchema);
