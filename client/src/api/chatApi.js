import api from "./axiosConfig";

export const chatApi = {
  // conversations
  getConversations: () => api.get("/student/chat/conversations"),

  createConversation: (instructorId, courseId) =>
    api.post("/student/chat/conversations", { instructorId, courseId }),

  getConversationMessages: (conversationId, page = 1) =>
    api.get(
      `/student/chat/conversations/${conversationId}/messages?page=${page}`
    ),

  // rooms
  getCourseRooms: () => api.get("/student/chat/rooms"),

  getRoomMessages: (roomId, page = 1) =>
    api.get(`/student/chat/rooms/${roomId}/messages?page=${page}`),

  getRoomParticipants: roomId =>
    api.get(`/student/chat/rooms/${roomId}/participants`),

  getRoomByCourse: courseId =>
    api.get(`/student/chat/rooms/course/${courseId}`),
};

export default chatApi;
