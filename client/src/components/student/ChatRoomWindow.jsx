import React, { useRef, useEffect } from 'react';
import { Users, GraduationCap, MoreVertical } from 'lucide-react';
import ChatInputWithMentions from './ChatInputWithMentions';
import { useGetRoomParticipants, useSendRoomMessage } from '@/hooks/useChat';

const ChatRoomWindow = ({ room, currentUserId = 'student1' }) => {
	const messagesEndRef = useRef(null);
	
	const { data: participantsData } = useGetRoomParticipants(room?.id);
	const sendMessageMutation = useSendRoomMessage();
	
	const participants = participantsData?.data || [];
	const messages = room?.messages || [];

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = (content, mentions = []) => {
		if (!room) return;
		
		const newMessage = {
			id: `msg${Date.now()}`,
			senderId: currentUserId,
			senderName: 'You',
			senderAvatar: 'https://i.pravatar.cc/150?img=1',
			senderType: 'student',
			content,
			timestamp: new Date().toISOString(),
			mentions
		};
		
		sendMessageMutation.mutate({ roomId: room.id, message: newMessage });
	};

	const formatTime = (timestamp) => {
		return new Date(timestamp).toLocaleTimeString('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		});
	};

	const formatDate = (timestamp) => {
		const date = new Date(timestamp);
		const today = new Date();
		const yesterday = new Date(today);
		yesterday.setDate(yesterday.getDate() - 1);

		if (date.toDateString() === today.toDateString()) return 'Today';
		if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	};

	// group messages by date
	const groupMessagesByDate = (msgs) => {
		const groups = {};
		msgs.forEach(msg => {
			const dateKey = new Date(msg.timestamp).toDateString();
			if (!groups[dateKey]) groups[dateKey] = [];
			groups[dateKey].push(msg);
		});
		return groups;
	};

	// render message content with highlighted mentions
	const renderMessageContent = (content) => {
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
			<div className="flex-1 flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
						<Users className="w-12 h-12 text-gray-400" />
					</div>
					<h3 className="text-lg font-semibold text-gray-900 mb-2">
						Select a course room
					</h3>
					<p className="text-gray-500">
						Join a discussion with fellow learners
					</p>
				</div>
			</div>
		);
	}

	const messageGroups = groupMessagesByDate(messages);

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
								<span>{room.participantCount} members</span>
								<span>•</span>
								<GraduationCap className="w-3 h-3" />
								<span>{room.instructor.name}</span>
							</div>
						</div>
					</div>
					<button className="p-2 hover:bg-gray-100 rounded-full">
						<MoreVertical className="w-5 h-5 text-gray-500" />
					</button>
				</div>
			</div>

			{/* messages */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				<div className="flex justify-center mb-4">
					<div className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200">
						Type @ to mention someone in the chat
					</div>
				</div>

				{Object.entries(messageGroups).map(([dateKey, msgs]) => (
					<div key={dateKey}>
						<div className="flex justify-center mb-4">
							<span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
								{formatDate(msgs[0].timestamp)}
							</span>
						</div>

						{msgs.map((message) => {
							const isOwn = message.senderId === currentUserId;
							const isInstructor = message.senderType === 'instructor';

							return (
								<div
									key={message.id}
									className={`flex gap-2 mb-3 ${isOwn ? 'flex-row-reverse' : ''}`}
								>
									{!isOwn && (
										<img
											src={message.senderAvatar}
											alt={message.senderName}
											className="w-8 h-8 rounded-full object-cover flex-shrink-0"
										/>
									)}
									<div className={`max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
										{!isOwn && (
											<div className="flex items-center gap-2 mb-1">
												<span className={`text-xs font-medium ${isInstructor ? 'text-blue-600' : 'text-gray-700'}`}>
													{message.senderName}
												</span>
												{isInstructor && (
													<span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
														Instructor
													</span>
												)}
											</div>
										)}
										<div
											className={`px-4 py-2 rounded-2xl ${
												isOwn
													? 'bg-blue-600 text-white rounded-br-md'
													: isInstructor
														? 'bg-blue-50 text-gray-900 border border-blue-200 rounded-bl-md'
														: 'bg-white text-gray-900 shadow-sm rounded-bl-md'
											}`}
										>
											<p className="text-sm">
												{isOwn ? message.content : renderMessageContent(message.content)}
											</p>
										</div>
										<span className={`text-xs text-gray-400 mt-1 block ${isOwn ? 'text-right' : ''}`}>
											{formatTime(message.timestamp)}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				))}
				<div ref={messagesEndRef} />
			</div>

			{/* input with mentions */}
			<div className="flex-shrink-0">
				<ChatInputWithMentions 
					onSendMessage={handleSendMessage} 
					placeholder="Message the group... (type @ to mention)" 
					participants={participants}
					showMentions={true}
				/>
			</div>
		</div>
	);
};

export default ChatRoomWindow;
