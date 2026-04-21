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
		const parts = content.split(/(@[\w\s]+?(?=\s@|$|\s\W|$))/g);
		return parts.map((part, i) => {
			if (part.startsWith('@')) {
				const isAI = part.toLowerCase().includes('ai');
				return (
					<span 
						key={i} 
						className={`font-medium px-1.5 py-0.5 rounded-md ${
							isAI 
								? 'text-purple-700 bg-purple-100 border border-purple-200' 
								: 'text-amber-800 bg-amber-100 border border-amber-300 shadow-sm'
						}`}
					>
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
		<div className="flex flex-col bg-gray-50 h-full min-h-0 overflow-hidden w-full max-w-full">
			{/* header */}
			<div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 z-10 shadow-sm">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<img
							src={room.courseThumbnail}
							alt={room.courseTitle}
							className="w-10 h-10 rounded-lg object-cover shadow-sm"
						/>
						<div className="min-w-0">
							<h3 className="font-semibold text-gray-900 text-sm truncate">
								{room.courseTitle}
							</h3>
							<div className="flex items-center gap-2 text-[11px] text-gray-500">
								<Users className="w-3 h-3" />
								<span>{room.participantCount} students</span>
							</div>
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
									className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-1 shadow-sm"
								/>
							)}
							<div className={`max-w-[85%] lg:max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
								{!isOwn && (
									<span className="text-[11px] font-semibold text-gray-600 mb-1 block px-1">
										{message.senderName}
									</span>
								)}
								<div
									className={`px-4 py-2.5 rounded-2xl shadow-sm ${
										isOwn
											? 'bg-blue-600 text-white rounded-br-none'
											: 'bg-white text-gray-900 rounded-bl-none border border-gray-100'
									}`}
								>
									<p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
										{isOwn ? message.content : renderMessage(message.content)}
									</p>
								</div>
								<span className={`text-[10px] font-medium text-gray-400 mt-1 block ${isOwn ? 'text-right' : 'text-left'}`}>
									{formatTime(message.timestamp || message.createdAt)}
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
						<span className="font-medium">
							{typingUsers.map(u => u.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
						</span>
					</div>
				</div>
			)}

			{/* input */}
			<div className="flex-shrink-0 bg-white border-t border-gray-100">
				<ChatInputWithMentions 
					onSendMessage={handleSendMessage} 
					placeholder="Message your students..." 
					participants={participants}
					showMentions={true}
					roomId={room?._id}
				/>
			</div>
		</div>
	);
};

export default InstructorRoomWindow;
