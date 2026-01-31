import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseRoom",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["User", "Instructor"],
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    mentions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "mentionModels",
      },
    ],
    mentionModels: [
      {
        type: String,
        enum: ["User", "Instructor"],
      },
    ],
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "readByModels",
      },
    ],
    readByModels: [
      {
        type: String,
        enum: ["User", "Instructor"],
      },
    ],
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
  },
  { timestamps: true }
);

// index for efficient queries
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ roomId: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);
