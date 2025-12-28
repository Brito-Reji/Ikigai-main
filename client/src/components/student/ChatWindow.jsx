import React, { useState, useRef, useEffect } from 'react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

const ChatWindow = ({ conversation, currentUserId = 'student1' }) => {
	const [messages, setMessages] = useState(conversation?.messages || []);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	useEffect(() => {
		if (conversation) {
			setMessages(conversation.messages);
		}
	}, [conversation]);

	const handleSendMessage = (content) => {
		const newMessage = {
			id: `msg${Date.now()}`,
			senderId: currentUserId,
			senderType: 'student',
			content,
			timestamp: new Date().toISOString(),
			status: 'sent'
		};

		setMessages([...messages, newMessage]);
	};

	if (!conversation) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<svg
							className="w-12 h-12 text-gray-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Select a conversation
					</h3>
					<p className="text-gray-500">
						Choose a chat to start messaging
					</p>
				</div>
			</div>
		);
	}

	const instructor = {
		name: conversation.instructorName,
		avatar: conversation.instructorAvatar
	};

	return (
		<div className="flex flex-col bg-gray-50 h-full">
			<div className="flex-shrink-0">
				<ChatHeader
					instructor={instructor}
					courseTitle={conversation.courseTitle}
					isOnline={conversation.isOnline}
				/>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-2">
				<div className="flex justify-center mb-4">
					<div className="bg-yellow-50 text-yellow-800 text-xs px-3 py-1 rounded-full border border-yellow-200">
						Messages are end-to-end encrypted
					</div>
				</div>

				{messages.map((message) => (
					<MessageBubble
						key={message.id}
						message={message}
						isOwn={message.senderId === currentUserId}
					/>
				))}
				<div ref={messagesEndRef} />
			</div>

			<div className="flex-shrink-0">
				<ChatInput onSendMessage={handleSendMessage} />
			</div>
		</div>
	);
};

export default ChatWindow;
