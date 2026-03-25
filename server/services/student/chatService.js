import { Message } from "../../models/Message.js";
import { Conversation } from "../../models/Conversation.js";
import { CourseRoom } from "../../models/CourseRoom.js";
import { Enrollment } from "../../models/Enrollment.js";
import { Course } from "../../models/Course.js";

// get student conversations (based on active purchased courses)
export const getConversations = async userId => {
  // get all active enrollments for the student
  const enrollments = await Enrollment.find({
    user: userId,
    status: "active",
  }).populate({
    path: "course",
    select: "title thumbnail instructor",
    populate: {
      path: "instructor",
      select: "username profileImageUrl",
    },
  });

  const conversationList = [];

  for (const enrollment of enrollments) {
    if (!enrollment.course || !enrollment.course.instructor) continue;

    const courseId = enrollment.course._id;
    const instructorId = enrollment.course.instructor._id;

    // find existing conversation or create a new one
    let conversation = await Conversation.findOne({
      student: userId,
      instructor: instructorId,
      course: courseId,
    }).populate("instructor", "username profileImageUrl")
      .populate("course", "title thumbnail");

    if (!conversation) {
      conversation = await Conversation.create({
        student: userId,
        instructor: instructorId,
        course: courseId,
      });
      // populate it for display
      conversation = await Conversation.findById(conversation._id)
        .populate("instructor", "username profileImageUrl")
        .populate("course", "title thumbnail");
    }

    conversationList.push({
      _id: conversation._id,
      instructorId: conversation.instructor._id,
      instructorName: conversation.instructor.username || "Instructor",
      instructorAvatar: conversation.instructor.profileImageUrl,
      courseId: conversation.course._id,
      courseTitle: conversation.course.title,
      lastMessage: conversation.lastMessage?.content || "",
      lastMessageTime: conversation.lastMessage?.timestamp || conversation.updatedAt,
      unreadCount: conversation.studentUnread || 0,
      isOnline: false,
    });
  }

  // sort by latest message time descending
  conversationList.sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

  return conversationList;
};

// get or create conversation
export const getOrCreateConversation = async (
  studentId,
  instructorId,
  courseId
) => {
  let conversation = await Conversation.findOne({
    student: studentId,
    instructor: instructorId,
    course: courseId,
  });

  if (!conversation) {
    conversation = await Conversation.create({
      student: studentId,
      instructor: instructorId,
      course: courseId,
    });
  }

  return conversation;
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

// get course rooms for enrolled courses
export const getCourseRooms = async userId => {
  // get enrolled courses
  const enrollments = await Enrollment.find({
    user: userId,
    status: "active",
  }).populate({
    path: "course",
    select: "title thumbnail instructor",
    populate: {
      path: "instructor",
      select: "username profileImageUrl",
    },
  });

  const rooms = [];

  for (const enrollment of enrollments) {
    if (!enrollment.course) continue;

    // get or create room
    let room = await CourseRoom.findOne({ course: enrollment.course._id });

    if (!room) {
      room = await CourseRoom.create({ course: enrollment.course._id });
    }

    // count participants
    const participantCount = await Enrollment.countDocuments({
      course: enrollment.course._id,
      status: "active",
    });

    rooms.push({
      _id: room._id,
      courseId: enrollment.course._id,
      courseTitle: enrollment.course.title,
      courseThumbnail: enrollment.course.thumbnail,
      participantCount: participantCount + 1, // +1 for instructor
      instructor: {
        id: enrollment.course.instructor._id,
        name: enrollment.course.instructor.username || "Instructor",
        avatar: enrollment.course.instructor.profileImageUrl,
      },
      lastMessage: room.lastMessage?.content || "No messages yet",
      lastMessageTime: room.lastMessage?.timestamp || room.createdAt,
      unreadCount: room.unreadCounts?.get(userId.toString()) || 0,
    });
  }

  return rooms;
};

// get room messages
export const getRoomMessages = async (roomId, page = 1, limit = 50) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({ roomId })
    .populate({
      path: "sender",
      select: "avatar",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  // console.log(messages);

  return messages.reverse().map(msg => ({
    _id: msg._id,
    senderId: msg.sender?._id?.toString() || msg.sender?.toString(),
    senderName: msg.senderName,
    senderAvatar: msg.senderAvatar,
    senderType: msg.senderModel === "Instructor" ? "instructor" : "student",
    content: msg.content,
    mentions: msg.mentions,
    timestamp: msg.createdAt,
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
  // console.log(participants);

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

// get room by course id
export const getRoomByCourseId = async (courseId, userId) => {
  let room = await CourseRoom.findOne({ course: courseId });

  if (!room) {
    room = await CourseRoom.create({ course: courseId });
  }

  const course = await Course.findById(courseId)
    .select("title thumbnail instructor")
    .populate("instructor", "username profileImageUrl");

  const participantCount = await Enrollment.countDocuments({
    course: courseId,
    status: "active",
  });

  return {
    _id: room._id,
    courseId: course._id,
    courseTitle: course.title,
    courseThumbnail: course.thumbnail,
    participantCount: participantCount + 1,
    instructor: {
      id: course.instructor._id,
      name: course.instructor.username || "Instructor",
      avatar: course.instructor.profileImageUrl,
    },
    lastMessage: room.lastMessage?.content || "No messages yet",
    lastMessageTime: room.lastMessage?.timestamp || room.createdAt,
    unreadCount: room.unreadCounts?.get(userId.toString()) || 0,
  };
};
