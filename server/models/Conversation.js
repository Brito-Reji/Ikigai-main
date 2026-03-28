import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // student participant
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // instructor participant
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    // courses this conversation is about
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    lastMessage: {
      content: String,
      sender: mongoose.Schema.Types.ObjectId,
      senderModel: {
        type: String,
        enum: ["User", "Instructor"],
      },
      timestamp: Date,
    },
    // unread counts
    studentUnread: {
      type: Number,
      default: 0,
    },
    instructorUnread: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// unique conversation per student-instructor pair
conversationSchema.index(
  { student: 1, instructor: 1 },
  { unique: true }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
