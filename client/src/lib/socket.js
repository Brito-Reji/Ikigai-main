import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";

let socket = null;

export const getSocket = () => socket;

export const connectSocket = token => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", err => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("disconnect", reason => {
    console.log("Socket disconnected:", reason);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// join conversation room
export const joinConversation = conversationId => {
  socket?.emit("conversation:join", { conversationId });
};

// leave conversation room
export const leaveConversation = conversationId => {
  socket?.emit("conversation:leave", { conversationId });
};

// join course room
export const joinRoom = roomId => {
  socket?.emit("room:join", { roomId });
};

// leave course room
export const leaveRoom = roomId => {
  socket?.emit("room:leave", { roomId });
};

// send message to conversation
export const sendMessage = (conversationId, content, mentions = []) => {
  socket?.emit("message:send", { conversationId, content, mentions });
};

// send message to room
export const sendRoomMessage = (roomId, content, mentions = []) => {
  socket?.emit("room:message", { roomId, content, mentions });
};

// typing indicators
export const startTyping = ({ conversationId, roomId }) => {
  socket?.emit("typing:start", { conversationId, roomId });
};

export const stopTyping = ({ conversationId, roomId }) => {
  socket?.emit("typing:stop", { conversationId, roomId });
};

export default {
  getSocket,
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  joinRoom,
  leaveRoom,
  sendMessage,
  sendRoomMessage,
  startTyping,
  stopTyping,
};
