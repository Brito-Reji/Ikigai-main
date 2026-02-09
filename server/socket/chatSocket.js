import jwt from "jsonwebtoken";
import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { CourseRoom } from "../models/CourseRoom.js";
import { Course } from "../models/Course.js";
import { User } from "../models/User.js";
import { Instructor } from "../models/Instructor.js";
import { getAIResponse } from "./Gemini.js";

// store active users
const activeUsers = new Map();

export const initChatSocket = io => {
  // auth middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      console.log(token);
      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      socket.userRole = decoded.role;

      // get user data
      if (decoded.role === "student") {
        const user = await User.findById(decoded.id).select(
          "username profileImageUrl"
        );
        socket.userName = user.username || "User";
        socket.userAvatar =
          user.profileImageUrl ||
          "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png";
      } else if (decoded.role === "instructor") {
        const instructor = await Instructor.findById(decoded.id).select(
          "username profileImageUrl"
        );
        socket.userName = instructor.username || "Instructor";
        socket.userAvatar =
          instructor.profileImageUrl ||
          "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png";
      }

      next();
    } catch (err) {
      next(new Error("Invalid token", err));
    }
  });

  io.on("connection", socket => {
    // console.log(socket);
    console.log(`User connected: ${socket.userId} (${socket.userRole})`);

    // track active user
    activeUsers.set(socket.userId, socket.id);
    io.emit("user:online", { userId: socket.userId });

    // join personal room for direct messages
    socket.join(`user:${socket.userId}`);

    // join conversation
    socket.on("conversation:join", async ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`);

      // mark messages as read
      const conversation = await Conversation.findById(conversationId);
      if (conversation) {
        if (
          socket.userRole === "student" &&
          conversation.student.toString() === socket.userId
        ) {
          conversation.studentUnread = 0;
          await conversation.save();
        } else if (
          socket.userRole === "instructor" &&
          conversation.instructor.toString() === socket.userId
        ) {
          conversation.instructorUnread = 0;
          await conversation.save();
        }
      }
    });

    // leave conversation
    socket.on("conversation:leave", ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`);
    });

    // join course room
    socket.on("room:join", async ({ roomId }) => {
      socket.join(`room:${roomId}`);

      // clear unread
      const room = await CourseRoom.findById(roomId);
      if (room) {
        room.unreadCounts.set(socket.userId, 0);
        await room.save();
      }
    });

    // leave course room
    socket.on("room:leave", ({ roomId }) => {
      socket.leave(`room:${roomId}`);
    });

    // send message to conversation
    socket.on(
      "message:send",
      async ({ conversationId, content, mentions = [] }) => {
        try {
          const senderModel =
            socket.userRole === "student" ? "User" : "Instructor";

          const message = await Message.create({
            conversationId,
            sender: socket.userId,
            senderModel,
            senderName: socket.userName,
            senderAvatar: socket.userAvatar,
            content,
            mentions,
            mentionModels: mentions.map(() => "User"),
          });

          // update conversation
          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: {
              content,
              sender: socket.userId,
              senderModel,
              timestamp: new Date(),
            },
            $inc:
              socket.userRole === "student"
                ? { instructorUnread: 1 }
                : { studentUnread: 1 },
          });

          // broadcast to conversation
          io.to(`conversation:${conversationId}`).emit("message:new", {
            message: {
              _id: message._id,
              conversationId,
              sender: socket.userId,
              senderModel,
              senderName: socket.userName,
              senderAvatar: socket.userAvatar,
              content,
              mentions,
              createdAt: message.createdAt,
            },
          });
        } catch (err) {
          console.error("Message send error:", err);
          socket.emit("error", { message: "Failed to send message" });
        }
      }
    );

    // send message to room
    socket.on("room:message", async ({ roomId, content, mentions = [] }) => {
      try {
        const senderModel =
          socket.userRole === "student" ? "User" : "Instructor";

        const message = await Message.create({
          roomId,
          sender: socket.userId,
          senderModel,
          senderName: socket.userName,
          senderAvatar: socket.userAvatar,
          content,
          mentions,
          mentionModels: mentions.map(() => "User"),
        });

        // update room
        await CourseRoom.findByIdAndUpdate(roomId, {
          lastMessage: {
            content,
            senderName: socket.userName,
            sender: socket.userId,
            senderModel,
            timestamp: new Date(),
          },
        });

        // broadcast to room
        io.to(`room:${roomId}`).emit("room:message:new", {
          message: {
            _id: message._id,
            roomId,
            sender: socket.userId,
            senderModel,
            senderName: socket.userName,
            senderAvatar: socket.userAvatar,
            senderType: socket.userRole,
            content,
            mentions,
            createdAt: message.createdAt,
          },
        });
        // check if @AI mentioned in message
        if (content.toLowerCase().includes("@ai")) {
          // get course context
          const room = await CourseRoom.findById(roomId);
          const course = await Course.findById(room.course).select(
            "title description overview"
          );

          // get last 10 messages for context
          const recentMessages = await Message.find({ roomId })
            .sort({ createdAt: -1 })
            .limit(10);
          const chatHistory = recentMessages.reverse();

          // extract question from message
          const question = content.replace(/@ai/gi, "").trim();

          // get AI response
          const aiResponse = await getAIResponse(
            question,
            {
              title: course?.title || "Unknown Course",
              description: course?.description || "",
              overview: course?.overview || "",
            },
            chatHistory
          );

          // save AI message to DB
          const aiMessage = await Message.create({
            roomId,
            sender: socket.userId,
            senderModel: "User",
            senderName: "AI Assistant",
            senderAvatar:
              "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
            content: aiResponse,
            mentions: [],
            mentionModels: [],
          });

          // broadcast AI response
          io.to(`room:${roomId}`).emit("room:message:new", {
            message: {
              _id: aiMessage._id,
              roomId,
              sender: "ai-assistant",
              senderModel: "AI",
              senderName: "AI Assistant",
              senderAvatar:
                "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
              senderType: "ai",
              content: aiResponse,
              mentions: [],
              createdAt: aiMessage.createdAt,
            },
          });
        }
      } catch (err) {
        console.error("Room message error:", err);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // typing indicators
    socket.on("typing:start", ({ conversationId, roomId }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit("typing:update", {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: true,
        });
      }
      if (roomId) {
        socket.to(`room:${roomId}`).emit("typing:update", {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: true,
        });
      }
    });

    socket.on("typing:stop", ({ conversationId, roomId }) => {
      if (conversationId) {
        socket.to(`conversation:${conversationId}`).emit("typing:update", {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: false,
        });
      }
      if (roomId) {
        socket.to(`room:${roomId}`).emit("typing:update", {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: false,
        });
      }
    });

    // disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
      activeUsers.delete(socket.userId);
      io.emit("user:offline", { userId: socket.userId });
    });
  });
};

export const getActiveUsers = () => activeUsers;
