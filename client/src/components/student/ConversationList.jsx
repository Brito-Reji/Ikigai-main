import React from 'react';
import { Search } from 'lucide-react';

const ConversationList = ({ conversations, selectedConversationId, onSelectConversation }) => {
	const formatTime = (timestamp) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString();
	};

	return (
		<div className="w-full lg:w-96 bg-white border-r border-gray-200 flex flex-col h-full">
			<div className="flex-shrink-0 p-4 border-b border-gray-200">
				<h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search conversations..."
						className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{conversations.map((conversation) => (
					<button
						key={conversation.id}
						onClick={() => onSelectConversation(conversation.id)}
						className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
							selectedConversationId === conversation.id ? 'bg-blue-50' : ''
						}`}
					>
						<div className="relative flex-shrink-0">
							<img
								src={conversation.instructorAvatar}
								alt={conversation.instructorName}
								className="w-12 h-12 rounded-full object-cover"
							/>
							{conversation.isOnline && (
								<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
							)}
						</div>

						<div className="flex-1 min-w-0 text-left">
							<div className="flex items-baseline justify-between mb-1">
								<h3 className="font-semibold text-gray-900 truncate">
									{conversation.instructorName}
								</h3>
								<span className="text-xs text-gray-500 ml-2 flex-shrink-0">
									{formatTime(conversation.lastMessageTime)}
								</span>
							</div>
							<p className="text-sm text-gray-500 truncate mb-1">
								{conversation.courseTitle}
							</p>
							<div className="flex items-center justify-between">
								<p className="text-sm text-gray-600 truncate flex-1">
									{conversation.lastMessage}
								</p>
								{conversation.unreadCount > 0 && (
									<span className="ml-2 flex-shrink-0 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
										{conversation.unreadCount}
									</span>
								)}
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

export default ConversationList;
