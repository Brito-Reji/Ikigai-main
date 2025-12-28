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
				content: "Hi Sarah! I'm having trouble understanding the async/await concept from lesson 5.",
				timestamp: "2024-12-28T14:00:00Z",
				status: "read"
			},
			{
				id: "msg2",
				senderId: "inst1",
				senderType: "instructor",
				content: "Hi! I'd be happy to help. Can you tell me which specific part is confusing?",
				timestamp: "2024-12-28T14:05:00Z",
				status: "read"
			},
			{
				id: "msg3",
				senderId: "student1",
				senderType: "student",
				content: "I don't understand when to use async/await vs promises. They seem to do the same thing?",
				timestamp: "2024-12-28T14:10:00Z",
				status: "read"
			},
			{
				id: "msg4",
				senderId: "inst1",
				senderType: "instructor",
				content: "That's a great question! Let me explain...",
				timestamp: "2024-12-28T15:30:00Z",
				status: "delivered"
			},
			{
				id: "msg5",
				senderId: "inst1",
				senderType: "instructor",
				content: "Async/await is actually syntactic sugar built on top of promises. It makes asynchronous code look and behave more like synchronous code, which is easier to read and understand.",
				timestamp: "2024-12-28T15:31:00Z",
				status: "delivered"
			}
		]
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
				content: "Hey Michael! Thanks for the great lesson on custom hooks. Do you have any code examples I can reference?",
				timestamp: "2024-12-28T09:30:00Z",
				status: "read"
			},
			{
				id: "msg7",
				senderId: "inst2",
				senderType: "instructor",
				content: "Sure, I'll post the code examples in the resources section.",
				timestamp: "2024-12-28T10:15:00Z",
				status: "read"
			}
		]
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
				content: "Hi James! Quick question - when is the assignment for Module 3 due?",
				timestamp: "2024-12-27T16:30:00Z",
				status: "read"
			},
			{
				id: "msg9",
				senderId: "inst3",
				senderType: "instructor",
				content: "The assignment is due next Friday. Take your time!",
				timestamp: "2024-12-27T16:45:00Z",
				status: "read"
			}
		]
	}
];

export const getConversationById = (conversationId) => {
	return mockConversations.find(conv => conv.id === conversationId);
};

export const getConversationByInstructorId = (instructorId) => {
	return mockConversations.find(conv => conv.instructorId === instructorId);
};

export const addMessageToConversation = (conversationId, message) => {
	const conversation = mockConversations.find(conv => conv.id === conversationId);
	if (conversation) {
		conversation.messages.push(message);
		conversation.lastMessage = message.content;
		conversation.lastMessageTime = message.timestamp;
	}
};
