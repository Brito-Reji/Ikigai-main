import React from 'react';
import { Search, MessageSquare } from 'lucide-react';

const ConversationList = ({ conversations, selectedConversationId, onSelectConversation }) => {
	const formatTime = (timestamp) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return date.toLocaleDateString();
	};

	return (
		<div className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
			<div className="flex-shrink-0 p-4 border-b border-gray-200">
				<h2 className="text-lg font-bold text-gray-900 mb-3">Instructor Messages</h2>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<input
						type="text"
						placeholder="Search..."
						className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{conversations.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full p-8 text-center">
						<MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
						<p className="text-gray-500">No instructor messages yet</p>
						<p className="text-sm text-gray-400 mt-1">Messages from your course instructors will appear here</p>
					</div>
				) : (
					conversations.map((conversation) => (
						<button
							key={conversation._id}
							onClick={() => onSelectConversation(conversation._id)}
							className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
								selectedConversationId === conversation._id ? 'bg-blue-50' : ''
							}`}
						>
							<div className="relative flex-shrink-0">
								<img
									src={conversation.instructorAvatar || 'https://i.pravatar.cc/150'}
									alt={conversation.instructorName}
									className="w-10 h-10 rounded-full object-cover"
								/>
								{conversation.isOnline && (
									<div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
								)}
							</div>

							<div className="flex-1 min-w-0 text-left">
								<div className="flex items-baseline justify-between mb-1">
									<h3 className="font-medium text-gray-900 truncate text-sm">
										{conversation.instructorName}
									</h3>
									<span className="text-xs text-gray-500 ml-2 flex-shrink-0">
										{formatTime(conversation.lastMessageTime)}
									</span>
								</div>
								<p className="text-xs text-gray-500 truncate">
									{conversation.courseTitle}
								</p>
								<div className="flex items-center justify-between mt-1">
									<p className="text-sm text-gray-600 truncate flex-1">
										{conversation.lastMessage || 'No messages yet'}
									</p>
									{conversation.unreadCount > 0 && (
										<span className="ml-2 flex-shrink-0 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
											{conversation.unreadCount}
										</span>
									)}
								</div>
							</div>
						</button>
					))
				)}
			</div>
		</div>
	);
};

export default ConversationList;
