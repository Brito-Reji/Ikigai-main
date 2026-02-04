import React, { useRef, useEffect, useState } from 'react';
import { MessageSquare, MoreVertical } from 'lucide-react';
import { useInstructorConversationMessages, useInstructorTypingIndicator } from '@/hooks/useInstructorChat';
import ChatInput from '@/components/student/ChatInput';

const InstructorChatWindow = ({ conversation }) => {
	const messagesEndRef = useRef(null);
	const { messages, sendMessage } = useInstructorConversationMessages(conversation?._id);
	const typingUsers = useInstructorTypingIndicator();

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

	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	if (!conversation) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
				<div className="text-center">
					<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<MessageSquare className="w-10 h-10 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Select a conversation
					</h3>
					<p className="text-gray-500">
						Choose a student to start chatting
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col bg-gray-50 h-full">
			{/* header */}
			<div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img
							src={conversation.studentAvatar || 'https://i.pravatar.cc/150'}
							alt={conversation.studentName}
							className="w-10 h-10 rounded-full object-cover"
						/>
						<div>
							<h3 className="font-semibold text-gray-900 text-sm">
								{conversation.studentName}
							</h3>
							<p className="text-xs text-gray-500">{conversation.courseTitle}</p>
						</div>
					</div>
					<button className="p-2 hover:bg-gray-100 rounded-full">
						<MoreVertical className="w-5 h-5 text-gray-500" />
					</button>
				</div>
			</div>

			{/* messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-3">
				{messages.map((message) => {
					const isOwn = message.senderModel === 'Instructor';
					return (
						<div
							key={message._id}
							className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
						>
							<div className={`max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
								<div
									className={`px-4 py-2 rounded-2xl ${
										isOwn
											? 'bg-blue-600 text-white rounded-br-md'
											: 'bg-white text-gray-900 shadow-sm rounded-bl-md'
									}`}
								>
									<p className="text-sm">{message.content}</p>
								</div>
								<span className={`text-xs text-gray-400 mt-1 block ${isOwn ? 'text-right' : ''}`}>
									{formatTime(message.createdAt)}
								</span>
							</div>
						</div>
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

			{/* input */}
			<div className="flex-shrink-0">
				<ChatInput onSendMessage={handleSendMessage} conversationId={conversation?._id} />
			</div>
		</div>
	);
};

export default InstructorChatWindow;
