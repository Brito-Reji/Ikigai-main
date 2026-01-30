import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  mockConversations,
  mockCourseRooms,
  getConversationById,
  getCourseRoomById,
  getCourseRoomByCourseId,
  getConversationByInstructorId,
} from "@/data/mockChatData";

// simulate async delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// mock fetchers
const fetchConversations = async () => {
  await delay(300);
  return { data: mockConversations };
};

const fetchCourseRooms = async () => {
  await delay(300);
  return { data: mockCourseRooms };
};

const fetchConversationById = async conversationId => {
  await delay(200);
  const conversation = getConversationById(conversationId);
  if (!conversation) throw new Error("Conversation not found");
  return { data: conversation };
};

const fetchCourseRoomById = async roomId => {
  await delay(200);
  const room = getCourseRoomById(roomId);
  if (!room) throw new Error("Room not found");
  return { data: room };
};

const fetchRoomByCourseId = async courseId => {
  await delay(200);
  const room = getCourseRoomByCourseId(courseId);
  return { data: room || null };
};

const fetchConversationByInstructorId = async instructorId => {
  await delay(200);
  const conversation = getConversationByInstructorId(instructorId);
  return { data: conversation || null };
};

// get all conversations
export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });
};

// get all course rooms
export const useGetCourseRooms = () => {
  return useQuery({
    queryKey: ["course-rooms"],
    queryFn: fetchCourseRooms,
  });
};

// get single conversation
export const useGetConversationById = conversationId => {
  return useQuery({
    queryKey: ["conversations", conversationId],
    queryFn: () => fetchConversationById(conversationId),
    enabled: !!conversationId,
  });
};

// get single room
export const useGetCourseRoomById = roomId => {
  return useQuery({
    queryKey: ["course-rooms", roomId],
    queryFn: () => fetchCourseRoomById(roomId),
    enabled: !!roomId,
  });
};

// get room by course id
export const useGetRoomByCourseId = courseId => {
  return useQuery({
    queryKey: ["course-rooms", "by-course", courseId],
    queryFn: () => fetchRoomByCourseId(courseId),
    enabled: !!courseId,
  });
};

// get conversation by instructor id
export const useGetConversationByInstructor = instructorId => {
  return useQuery({
    queryKey: ["conversations", "by-instructor", instructorId],
    queryFn: () => fetchConversationByInstructorId(instructorId),
    enabled: !!instructorId,
  });
};

// send message to conversation
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, message }) => {
      await delay(100);
      const conversation = getConversationById(conversationId);
      if (conversation) {
        conversation.messages.push(message);
        conversation.lastMessage = message.content;
        conversation.lastMessageTime = message.timestamp;
      }
      return { data: message };
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["conversations", conversationId],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// send message to room
export const useSendRoomMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roomId, message }) => {
      await delay(100);
      const room = getCourseRoomById(roomId);
      if (room) {
        room.messages.push(message);
        room.lastMessage = message.content;
        room.lastMessageTime = message.timestamp;
      }
      return { data: message };
    },
    onSuccess: (_, { roomId }) => {
      queryClient.invalidateQueries({ queryKey: ["course-rooms", roomId] });
      queryClient.invalidateQueries({ queryKey: ["course-rooms"] });
    },
  });
};

// get room participants for mentions
export const useGetRoomParticipants = roomId => {
  return useQuery({
    queryKey: ["course-rooms", roomId, "participants"],
    queryFn: async () => {
      await delay(150);
      const room = getCourseRoomById(roomId);
      if (!room) return { data: [] };

      // extract unique participants from messages + instructor
      const participants = new Map();

      // add instructor
      participants.set(room.instructor.id, {
        id: room.instructor.id,
        name: room.instructor.name,
        avatar: room.instructor.avatar,
        type: "instructor",
      });

      // add students from messages
      room.messages.forEach(msg => {
        if (!participants.has(msg.senderId)) {
          participants.set(msg.senderId, {
            id: msg.senderId,
            name: msg.senderName,
            avatar: msg.senderAvatar,
            type: msg.senderType,
          });
        }
      });

      return { data: Array.from(participants.values()) };
    },
    enabled: !!roomId,
  });
};
