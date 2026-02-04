import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { instructorChatApi } from "@/api/chatApi";
import {
  getSocket,
  joinConversation,
  leaveConversation,
  joinRoom,
  leaveRoom,
  sendMessage as socketSendMessage,
  sendRoomMessage as socketSendRoomMessage,
} from "@/lib/socket";

// get all conversations
export const useGetInstructorConversations = () => {
  return useQuery({
    queryKey: ["instructor-conversations"],
    queryFn: async () => {
      const res = await instructorChatApi.getConversations();
      return res.data;
    },
  });
};

// get all course rooms
export const useGetInstructorRooms = () => {
  return useQuery({
    queryKey: ["instructor-rooms"],
    queryFn: async () => {
      const res = await instructorChatApi.getCourseRooms();
      return res.data;
    },
  });
};

// get conversation messages with socket
export const useInstructorConversationMessages = conversationId => {
  const [messages, setMessages] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-messages", conversationId],
    queryFn: async () => {
      const res =
        await instructorChatApi.getConversationMessages(conversationId);
      return res.data;
    },
    enabled: !!conversationId,
  });

  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    if (!socket) return;

    joinConversation(conversationId);

    const handleNewMessage = ({ message }) => {
      if (message.conversationId === conversationId) {
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      leaveConversation(conversationId);
      socket.off("message:new", handleNewMessage);
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (content, mentions = []) => {
      socketSendMessage(conversationId, content, mentions);
    },
    [conversationId]
  );

  return { messages, isLoading, sendMessage };
};

// get room messages with socket
export const useInstructorRoomMessages = roomId => {
  const [messages, setMessages] = useState([]);

  const { data, isLoading } = useQuery({
    queryKey: ["instructor-room-messages", roomId],
    queryFn: async () => {
      const res = await instructorChatApi.getRoomMessages(roomId);
      return res.data;
    },
    enabled: !!roomId,
  });

  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);

  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();
    if (!socket) return;

    joinRoom(roomId);

    const handleNewMessage = ({ message }) => {
      if (message.roomId === roomId) {
        setMessages(prev => [...prev, message]);
      }
    };

    socket.on("room:message:new", handleNewMessage);

    return () => {
      leaveRoom(roomId);
      socket.off("room:message:new", handleNewMessage);
    };
  }, [roomId]);

  const sendMessage = useCallback(
    (content, mentions = []) => {
      socketSendRoomMessage(roomId, content, mentions);
    },
    [roomId]
  );

  return { messages, isLoading, sendMessage };
};

// get room participants
export const useGetInstructorRoomParticipants = roomId => {
  return useQuery({
    queryKey: ["instructor-room-participants", roomId],
    queryFn: async () => {
      const res = await instructorChatApi.getRoomParticipants(roomId);
      return res.data;
    },
    enabled: !!roomId,
  });
};

// typing indicator
export const useInstructorTypingIndicator = () => {
  const [typingUsers, setTypingUsers] = useState([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleTyping = ({ userId, userName, isTyping }) => {
      if (isTyping) {
        setTypingUsers(prev => {
          if (prev.find(u => u.userId === userId)) return prev;
          return [...prev, { userId, userName }];
        });
      } else {
        setTypingUsers(prev => prev.filter(u => u.userId !== userId));
      }
    };

    socket.on("typing:update", handleTyping);

    return () => {
      socket.off("typing:update", handleTyping);
    };
  }, []);

  return typingUsers;
};
