import React, { useRef, useEffect } from 'react';
import { Users, MoreVertical } from 'lucide-react';
import ChatInputWithMentions from '@/components/student/ChatInputWithMentions';
import { useInstructorRoomMessages, useGetInstructorRoomParticipants, useInstructorTypingIndicator } from '@/hooks/useInstructorChat';

const InstructorRoomWindow = ({ room }) => {
	const messagesEndRef = useRef(null);
	const { messages, sendMessage } = useInstructorRoomMessages(room?._id);
	const { data: participantsData } = useGetInstructorRoomParticipants(room?._id);
	const typingUsers = useInstructorTypingIndicator();
	
	const participants = participantsData?.data || [];

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = (content, mentions = []) => {
		if (!room) return;
		sendMessage(content, mentions);
	};

	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	// render message with mentions highlighted
	const renderMessage = (content) => {
		const parts = content.split(/(@\w+(?:\s\w+)?)/g);
		return parts.map((part, i) => {
			if (part.startsWith('@')) {
				return (
					<span key={i} className="text-blue-600 font-medium bg-blue-50 px-1 rounded">
						{part}
					</span>
				);
			}
			return part;
		});
	};

	if (!room) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
				<div className="text-center">
					<div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<Users className="w-10 h-10 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Select a course room
					</h3>
					<p className="text-gray-500">
						Engage with your students
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
							src={room.courseThumbnail}
							alt={room.courseTitle}
							className="w-10 h-10 rounded-lg object-cover"
						/>
						<div>
							<h3 className="font-semibold text-gray-900 text-sm">
								{room.courseTitle}
							</h3>
							<div className="flex items-center gap-2 text-xs text-gray-500">
								<Users className="w-3 h-3" />
								<span>{room.participantCount} students</span>
							</div>
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
					const isOwn = message.senderType === 'instructor';
					return (
						<div
							key={message._id}
							className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
						>
							{!isOwn && (
								<img
									src={message.senderAvatar || 'https://i.pravatar.cc/150'}
									alt={message.senderName}
									className="w-8 h-8 rounded-full object-cover flex-shrink-0"
								/>
							)}
							<div className={`max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
								{!isOwn && (
									<span className="text-xs font-medium text-gray-700 mb-1 block">
										{message.senderName}
									</span>
								)}
								<div
									className={`px-4 py-2 rounded-2xl ${
										isOwn
											? 'bg-blue-600 text-white rounded-br-md'
											: 'bg-white text-gray-900 shadow-sm rounded-bl-md'
									}`}
								>
									<p className="text-sm">
										{isOwn ? message.content : renderMessage(message.content)}
									</p>
								</div>
								<span className={`text-xs text-gray-400 mt-1 block ${isOwn ? 'text-right' : ''}`}>
									{formatTime(message.timestamp || message.createdAt)}
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
						<span>
							{typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
						</span>
					</div>
				</div>
			)}

			{/* input */}
			<div className="flex-shrink-0">
				<ChatInputWithMentions 
					onSendMessage={handleSendMessage} 
					placeholder="Message your students... (type @ to mention)" 
					participants={participants}
					showMentions={true}
					roomId={room?._id}
				/>
			</div>
		</div>
	);
};

export default InstructorRoomWindow;
