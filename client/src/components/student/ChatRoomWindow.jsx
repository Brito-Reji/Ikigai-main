import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Users, GraduationCap, MoreVertical } from 'lucide-react';
import ChatInputWithMentions from './ChatInputWithMentions';
import { useRoomMessages, useGetRoomParticipants, useTypingIndicator } from '@/hooks/useChat';

const ChatRoomWindow = ({ room }) => {
	const messagesEndRef = useRef(null);
	const { user } = useSelector(state => state.auth);
	const currentUserId = user?.id || user?._id;
	
	// use real-time hooks
	const { messages, sendMessage } = useRoomMessages(room?._id);
	const { data: participantsData } = useGetRoomParticipants(room?._id);
	const typingUsers = useTypingIndicator();
	
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
			const ts = msg.createdAt || msg.timestamp;
			const dateKey = new Date(ts).toDateString();
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
								<span>{room.instructor?.name}</span>
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
								{formatDate(msgs[0].createdAt || msgs[0].timestamp)}
							</span>
						</div>

						{msgs.map((message) => {
							const senderId = message.sender || message.senderId;
							// compare as strings to handle ObjectId vs string
							const isOwn = currentUserId && senderId && String(senderId) === String(currentUserId);
							const isInstructor = message.senderType === 'instructor' || message.senderModel === 'Instructor';

							return (
						<div
  key={message._id || message.id}
  className={`flex gap-2 mb-3 ${isOwn ? 'flex-row-reverse' : ''}`}
>
  {!isOwn && (
    <img
      src={message.senderAvatar || 'https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png'}
      alt={message.senderName}
      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
    />
  )}
  <div className={`max-w-[70%] ${isOwn ? 'flex flex-col items-end' : 'flex flex-col'}`}>
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
    <span className={`text-xs text-gray-400 mt-1 ${isOwn ? 'text-right' : ''}`}>
      {formatTime(message.createdAt || message.timestamp)}
    </span>
  </div>
</div>
							);
						})}
					</div>
				))}
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

			{/* input with mentions */}
			<div className="flex-shrink-0">
				<ChatInputWithMentions 
					onSendMessage={handleSendMessage} 
					placeholder="Message the group... (type @ to mention)" 
					participants={participants}
					showMentions={true}
					roomId={room?._id}
				/>
			</div>
		</div>
	);
};

export default ChatRoomWindow;
