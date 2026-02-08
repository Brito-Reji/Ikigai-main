import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { useConversationMessages, useTypingIndicator } from '@/hooks/useChat';

const ChatWindow = ({ conversation }) => {
	const messagesEndRef = useRef(null);
	const { user } = useSelector(state => state.auth);
	const currentUserId = user?.id || user?._id;

	// use real-time hooks
	const { messages, sendMessage } = useConversationMessages(conversation?._id);
	const typingUsers = useTypingIndicator();

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = (content) => {
		if (!conversation) return;
		sendMessage(content);
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

				{messages.map((message) => {
					const senderId = message.sender || message.senderId;
					const isOwn = senderId === currentUserId || senderId?.toString() === currentUserId;
					return (
						<MessageBubble
							key={message._id || message.id}
							message={message}
							isOwn={isOwn}
						/>
					);
				})}
				<div ref={messagesEndRef} />
			</div>

			{/* typing indicator */}
			{typingUsers.length > 0 && (
				<div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
					<div className="flex items-center gap-2 text-sm text-gray-500">
						<div className="flex gap-1">
							<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
							<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
							<span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
						</div>
						<span>{typingUsers[0]?.userName} is typing...</span>
					</div>
				</div>
			)}

			<div className="flex-shrink-0">
				<ChatInput onSendMessage={handleSendMessage} conversationId={conversation?._id} />
			</div>
		</div>
	);
};

export default ChatWindow;
