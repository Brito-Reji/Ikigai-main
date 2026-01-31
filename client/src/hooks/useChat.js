import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { chatApi } from "@/api/chatApi";
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
export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const res = await chatApi.getConversations();
      return res.data;
    },
  });
};

// get all course rooms
export const useGetCourseRooms = () => {
  return useQuery({
    queryKey: ["course-rooms"],
    queryFn: async () => {
      const res = await chatApi.getCourseRooms();
      return res.data;
    },
  });
};

// get conversation messages with socket updates
export const useConversationMessages = conversationId => {
  const [messages, setMessages] = useState([]);
  const queryClient = useQueryClient();

  // fetch initial messages
  const { data, isLoading } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await chatApi.getConversationMessages(conversationId);
      return res.data;
    },
    enabled: !!conversationId,
  });

  // set initial messages
  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);

  // socket listener
  useEffect(() => {
    if (!conversationId) return;

    const socket = getSocket();
    if (!socket) return;

    // join room
    joinConversation(conversationId);

    // listen for new messages
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

  // send message
  const sendMessage = useCallback(
    (content, mentions = []) => {
      socketSendMessage(conversationId, content, mentions);
    },
    [conversationId]
  );

  return { messages, isLoading, sendMessage };
};

// get room messages with socket updates
export const useRoomMessages = roomId => {
  const [messages, setMessages] = useState([]);

  // fetch initial messages
  const { data, isLoading } = useQuery({
    queryKey: ["room-messages", roomId],
    queryFn: async () => {
      const res = await chatApi.getRoomMessages(roomId);
      return res.data;
    },
    enabled: !!roomId,
  });

  // set initial messages
  useEffect(() => {
    if (data?.data) {
      setMessages(data.data);
    }
  }, [data]);

  // socket listener
  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();
    if (!socket) return;

    // join room
    joinRoom(roomId);

    // listen for new messages
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

  // send message
  const sendMessage = useCallback(
    (content, mentions = []) => {
      socketSendRoomMessage(roomId, content, mentions);
    },
    [roomId]
  );

  return { messages, isLoading, sendMessage };
};

// get room participants
export const useGetRoomParticipants = roomId => {
  return useQuery({
    queryKey: ["room-participants", roomId],
    queryFn: async () => {
      const res = await chatApi.getRoomParticipants(roomId);
      return res.data;
    },
    enabled: !!roomId,
  });
};

// get room by course id
export const useGetRoomByCourse = courseId => {
  return useQuery({
    queryKey: ["course-room", courseId],
    queryFn: async () => {
      const res = await chatApi.getRoomByCourse(courseId);
      return res.data;
    },
    enabled: !!courseId,
  });
};

// create/get conversation
export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ instructorId, courseId }) =>
      chatApi.createConversation(instructorId, courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

// typing indicator hook
export const useTypingIndicator = () => {
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
