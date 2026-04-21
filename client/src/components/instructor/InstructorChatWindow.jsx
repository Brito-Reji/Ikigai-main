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
		<div className="flex flex-col bg-gray-50 h-full min-h-0 overflow-hidden w-full max-w-full">
			{/* header */}
			<div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 z-10 shadow-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img
							src={conversation.studentAvatar || 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'}
							alt={conversation.studentName}
							className="w-10 h-10 rounded-full object-cover shadow-sm"
						/>
						<div className="min-w-0">
							<h3 className="font-semibold text-gray-900 text-sm truncate">
								{conversation.studentName}
							</h3>
							<p className="text-[11px] text-gray-500 truncate" title={conversation.courses?.map(c => c.title).join(', ')}>
								{conversation.courses?.[0]?.title || 'No courses'}
							</p>
						</div>
					</div>
					<button className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0">
						<MoreVertical className="w-5 h-5 text-gray-500" />
					</button>
				</div>
			</div>

			{/* messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
				{messages.map((message) => {
					const isOwn = message.senderModel === 'Instructor';
					return (
						<div
							key={message._id}
							className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
						>
							<div className={`max-w-[85%] lg:max-w-[70%] ${isOwn ? 'order-2' : ''}`}>
								<div
									className={`px-4 py-2.5 rounded-2xl shadow-sm ${
										isOwn
											? 'bg-blue-600 text-white rounded-br-none'
											: 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
									}`}
								>
									<p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
								</div>
								<span className={`text-[10px] font-medium text-gray-400 mt-1 block ${isOwn ? 'text-right' : 'text-left'}`}>
									{formatTime(message.createdAt)}
								</span>
							</div>
						</div>
					);
				})}
				<div ref={messagesEndRef} className="h-2" />
			</div>

			{/* typing indicator */}
			{typingUsers.length > 0 && (
				<div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-t border-gray-100 flex-shrink-0">
					<div className="flex items-center gap-2 text-[11px] text-gray-500">
						<div className="flex gap-1">
							<span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
							<span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
							<span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
						</div>
						<span className="font-medium">{typingUsers[0]?.userName} is typing...</span>
					</div>
				</div>
			)}

			{/* input */}
			<div className="flex-shrink-0 bg-white border-t border-gray-100">
				<ChatInput onSendMessage={handleSendMessage} conversationId={conversation?._id} />
			</div>
		</div>
	);
};

export default InstructorChatWindow;
