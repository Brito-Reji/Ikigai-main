export const mockConversations = [
  {
    id: "conv1",
    instructorId: "inst1",
    instructorName: "Sarah Johnson",
    instructorAvatar: "https://i.pravatar.cc/150?img=5",
    courseTitle: "Complete Web Development Bootcamp 2024",
    lastMessage: "That's a great question! Let me explain...",
    lastMessageTime: "2024-12-28T15:30:00Z",
    unreadCount: 2,
    isOnline: true,
    messages: [
      {
        id: "msg1",
        senderId: "student1",
        senderType: "student",
        content:
          "Hi Sarah! I'm having trouble understanding the async/await concept from lesson 5.",
        timestamp: "2024-12-28T14:00:00Z",
        status: "read",
      },
      {
        id: "msg2",
        senderId: "inst1",
        senderType: "instructor",
        content:
          "Hi! I'd be happy to help. Can you tell me which specific part is confusing?",
        timestamp: "2024-12-28T14:05:00Z",
        status: "read",
      },
      {
        id: "msg3",
        senderId: "student1",
        senderType: "student",
        content:
          "I don't understand when to use async/await vs promises. They seem to do the same thing?",
        timestamp: "2024-12-28T14:10:00Z",
        status: "read",
      },
      {
        id: "msg4",
        senderId: "inst1",
        senderType: "instructor",
        content: "That's a great question! Let me explain...",
        timestamp: "2024-12-28T15:30:00Z",
        status: "delivered",
      },
      {
        id: "msg5",
        senderId: "inst1",
        senderType: "instructor",
        content:
          "Async/await is actually syntactic sugar built on top of promises. It makes asynchronous code look and behave more like synchronous code, which is easier to read and understand.",
        timestamp: "2024-12-28T15:31:00Z",
        status: "delivered",
      },
    ],
  },
  {
    id: "conv2",
    instructorId: "inst2",
    instructorName: "Michael Chen",
    instructorAvatar: "https://i.pravatar.cc/150?img=12",
    courseTitle: "Advanced React Patterns & Best Practices",
    lastMessage: "Sure, I'll post the code examples in the resources section.",
    lastMessageTime: "2024-12-28T10:15:00Z",
    unreadCount: 0,
    isOnline: false,
    messages: [
      {
        id: "msg6",
        senderId: "student1",
        senderType: "student",
        content:
          "Hey Michael! Thanks for the great lesson on custom hooks. Do you have any code examples I can reference?",
        timestamp: "2024-12-28T09:30:00Z",
        status: "read",
      },
      {
        id: "msg7",
        senderId: "inst2",
        senderType: "instructor",
        content: "Sure, I'll post the code examples in the resources section.",
        timestamp: "2024-12-28T10:15:00Z",
        status: "read",
      },
    ],
  },
  {
    id: "conv3",
    instructorId: "inst3",
    instructorName: "James Wilson",
    instructorAvatar: "https://i.pravatar.cc/150?img=8",
    courseTitle: "Node.js & Express - Backend Development",
    lastMessage: "The assignment is due next Friday. Take your time!",
    lastMessageTime: "2024-12-27T16:45:00Z",
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: "msg8",
        senderId: "student1",
        senderType: "student",
        content:
          "Hi James! Quick question - when is the assignment for Module 3 due?",
        timestamp: "2024-12-27T16:30:00Z",
        status: "read",
      },
      {
        id: "msg9",
        senderId: "inst3",
        senderType: "instructor",
        content: "The assignment is due next Friday. Take your time!",
        timestamp: "2024-12-27T16:45:00Z",
        status: "read",
      },
    ],
  },
];

export const getConversationById = conversationId => {
  return mockConversations.find(conv => conv.id === conversationId);
};

export const getConversationByInstructorId = instructorId => {
  return mockConversations.find(conv => conv.instructorId === instructorId);
};

export const addMessageToConversation = (conversationId, message) => {
  const conversation = mockConversations.find(
    conv => conv.id === conversationId
  );
  if (conversation) {
    conversation.messages.push(message);
    conversation.lastMessage = message.content;
    conversation.lastMessageTime = message.timestamp;
  }
};

// course group chat rooms
export const mockCourseRooms = [
  {
    id: "room1",
    courseId: "course1",
    courseTitle: "Complete Web Development Bootcamp 2024",
    courseThumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
    type: "room",
    participantCount: 156,
    instructor: {
      id: "inst1",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    lastMessage: "Has anyone completed the React project?",
    lastMessageTime: "2026-01-31T00:30:00Z",
    unreadCount: 5,
    messages: [
      {
        id: "rm1",
        senderId: "student2",
        senderName: "Alex Kumar",
        senderAvatar: "https://i.pravatar.cc/150?img=3",
        senderType: "student",
        content: "Hey everyone! Just joined the course 🎉",
        timestamp: "2026-01-30T10:00:00Z",
      },
      {
        id: "rm2",
        senderId: "inst1",
        senderName: "Sarah Johnson",
        senderAvatar: "https://i.pravatar.cc/150?img=5",
        senderType: "instructor",
        content: "Welcome Alex! Feel free to ask any questions here.",
        timestamp: "2026-01-30T10:05:00Z",
      },
      {
        id: "rm3",
        senderId: "student3",
        senderName: "Priya Sharma",
        senderAvatar: "https://i.pravatar.cc/150?img=9",
        senderType: "student",
        content: "I'm stuck on the CSS flexbox section. Any tips?",
        timestamp: "2026-01-30T14:20:00Z",
      },
      {
        id: "rm4",
        senderId: "student4",
        senderName: "Rahul Dev",
        senderAvatar: "https://i.pravatar.cc/150?img=11",
        senderType: "student",
        content: "Check out the MDN docs, they have great examples!",
        timestamp: "2026-01-30T14:25:00Z",
      },
      {
        id: "rm5",
        senderId: "inst1",
        senderName: "Sarah Johnson",
        senderAvatar: "https://i.pravatar.cc/150?img=5",
        senderType: "instructor",
        content:
          "Great suggestion Rahul! I'll also post a cheat sheet in the resources.",
        timestamp: "2026-01-30T15:00:00Z",
      },
      {
        id: "rm6",
        senderId: "student5",
        senderName: "Amit Patel",
        senderAvatar: "https://i.pravatar.cc/150?img=15",
        senderType: "student",
        content: "Has anyone completed the React project?",
        timestamp: "2026-01-31T00:30:00Z",
      },
    ],
  },
  {
    id: "room2",
    courseId: "course2",
    courseTitle: "Advanced React Patterns & Best Practices",
    courseThumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    type: "room",
    participantCount: 89,
    instructor: {
      id: "inst2",
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    lastMessage: "The compound components pattern is amazing!",
    lastMessageTime: "2026-01-30T22:15:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "rm7",
        senderId: "student6",
        senderName: "Neha Gupta",
        senderAvatar: "https://i.pravatar.cc/150?img=20",
        senderType: "student",
        content: "Just learned about render props, mind blown! 🤯",
        timestamp: "2026-01-30T20:00:00Z",
      },
      {
        id: "rm8",
        senderId: "inst2",
        senderName: "Michael Chen",
        senderAvatar: "https://i.pravatar.cc/150?img=12",
        senderType: "instructor",
        content: "Wait till you see compound components in the next lesson!",
        timestamp: "2026-01-30T20:10:00Z",
      },
      {
        id: "rm9",
        senderId: "student7",
        senderName: "Vikram Singh",
        senderAvatar: "https://i.pravatar.cc/150?img=33",
        senderType: "student",
        content: "The compound components pattern is amazing!",
        timestamp: "2026-01-30T22:15:00Z",
      },
    ],
  },
  {
    id: "room3",
    courseId: "course3",
    courseTitle: "Node.js & Express - Backend Development",
    courseThumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    type: "room",
    participantCount: 234,
    instructor: {
      id: "inst3",
      name: "James Wilson",
      avatar: "https://i.pravatar.cc/150?img=8",
    },
    lastMessage: "MongoDB indexing really improved my query speed!",
    lastMessageTime: "2026-01-30T18:45:00Z",
    unreadCount: 12,
    messages: [
      {
        id: "rm10",
        senderId: "student8",
        senderName: "Arjun Reddy",
        senderAvatar: "https://i.pravatar.cc/150?img=52",
        senderType: "student",
        content: "How do you handle authentication in production?",
        timestamp: "2026-01-30T16:00:00Z",
      },
      {
        id: "rm11",
        senderId: "inst3",
        senderName: "James Wilson",
        senderAvatar: "https://i.pravatar.cc/150?img=8",
        senderType: "instructor",
        content:
          "Great question! We'll cover JWT with refresh tokens in Module 5.",
        timestamp: "2026-01-30T16:30:00Z",
      },
      {
        id: "rm12",
        senderId: "student9",
        senderName: "Kavya Menon",
        senderAvatar: "https://i.pravatar.cc/150?img=44",
        senderType: "student",
        content: "MongoDB indexing really improved my query speed!",
        timestamp: "2026-01-30T18:45:00Z",
      },
    ],
  },
];

export const getCourseRoomById = roomId => {
  return mockCourseRooms.find(room => room.id === roomId);
};

export const getCourseRoomByCourseId = courseId => {
  return mockCourseRooms.find(room => room.courseId === courseId);
};

export const addMessageToRoom = (roomId, message) => {
  const room = mockCourseRooms.find(r => r.id === roomId);
  if (room) {
    room.messages.push(message);
    room.lastMessage = message.content;
    room.lastMessageTime = message.timestamp;
  }
};
