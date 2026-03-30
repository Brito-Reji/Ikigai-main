import { Message } from "../../models/Message.js";
import { Conversation } from "../../models/Conversation.js";
import { CourseRoom } from "../../models/CourseRoom.js";
import { Course } from "../../models/Course.js";
import { Enrollment } from "../../models/Enrollment.js";

// get instructor conversations
export const getConversations = async instructorId => {
  const conversations = await Conversation.find({ instructor: instructorId })
    .populate("student", "firstName lastName profileImageUrl username")
    .populate("courses", "title thumbnail")
    .sort({ updatedAt: -1 });

  return conversations
    .filter(conv => conv.student)
    .map(conv => ({
      _id: conv._id,
      studentId: conv.student._id,
      studentName: conv.student.username || `${conv.student.firstName} ${conv.student.lastName}`.trim() || "Student",
      studentAvatar: conv.student.profileImageUrl || null,
      courses: conv.courses.map(c => ({
        id: c._id,
        title: c.title,
        thumbnail: c.thumbnail,
      })),
      lastMessage: conv.lastMessage?.content || "",
      lastMessageTime: conv.lastMessage?.timestamp || conv.updatedAt,
      unreadCount: conv.instructorUnread,
    }));
};

// get messages for conversation
export const getConversationMessages = async (
  conversationId,
  page = 1,
  limit = 50
) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return messages.reverse();
};

// get course rooms for instructor's courses
export const getCourseRooms = async instructorId => {
  // get instructor's courses
  const courses = await Course.find({
    instructor: instructorId,
    published: true,
  }).select("_id title thumbnail");

  const rooms = [];

  for (const course of courses) {
    // get or create room
    let room = await CourseRoom.findOne({ course: course._id });

    if (!room) {
      room = await CourseRoom.create({ course: course._id });
    }

    // count participants
    const participantCount = await Enrollment.countDocuments({
      course: course._id,
      status: "active",
    });

    rooms.push({
      _id: room._id,
      courseId: course._id,
      courseTitle: course.title,
      courseThumbnail: course.thumbnail,
      participantCount: participantCount + 1,
      lastMessage: room.lastMessage?.content || "No messages yet",
      lastMessageTime: room.lastMessage?.timestamp || room.createdAt,
      unreadCount: room.unreadCounts?.get(instructorId.toString()) || 0,
    });
  }

  return rooms;
};

// get room messages
export const getRoomMessages = async (roomId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({ roomId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return messages.reverse().map(msg => ({
    _id: msg._id,
    sender: msg.sender.toString(),
    senderModel: msg.senderModel,
    senderName: msg.senderName,
    senderAvatar: msg.senderAvatar,
    senderType: msg.senderModel === "Instructor" ? "instructor" : "student",
    content: msg.content,
    mentions: msg.mentions,
    createdAt: msg.createdAt,
  }));
};

// get room participants
export const getRoomParticipants = async roomId => {
  const room = await CourseRoom.findById(roomId).populate({
    path: "course",
    select: "instructor",
    populate: {
      path: "instructor",
      select: "username profileImageUrl",
    },
  });

  if (!room) return [];

  // add AI as default mention
  const participants = [
    {
      id: "ai-assistant",
      name: "AI",
      avatar: "https://cdn-icons-png.flaticon.com/512/4712/4712109.png",
      type: "ai",
    },
  ];

  if (room.course?.instructor) {
    participants.push({
      id: room.course.instructor._id,
      name: room.course.instructor.username || "Instructor",
      avatar: room.course.instructor.profileImageUrl,
      type: "instructor",
    });
  }

  // get enrolled students
  const enrollments = await Enrollment.find({
    course: room.course._id,
    status: "active",
  }).populate("user", "username profileImageUrl");

  for (const enrollment of enrollments) {
    if (enrollment.user) {
      participants.push({
        id: enrollment.user._id,
        name: enrollment.user.username || "User",
        avatar: enrollment.user.profileImageUrl,
        type: "student",
      });
    }
  }

  return participants;
};
