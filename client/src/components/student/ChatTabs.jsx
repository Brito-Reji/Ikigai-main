import React from 'react';
import { MessageCircle, Users } from 'lucide-react';

const ChatTabs = ({ activeTab, onTabChange, directUnread = 0, roomsUnread = 0 }) => {
	const tabs = [
		{ id: 'direct', label: 'Messages', icon: MessageCircle, unread: directUnread },
		{ id: 'rooms', label: 'Course Rooms', icon: Users, unread: roomsUnread }
	];

	return (
		<div className="flex border-b border-gray-200 bg-white">
			{tabs.map(tab => (
				<button
					key={tab.id}
					onClick={() => onTabChange(tab.id)}
					className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
						activeTab === tab.id
							? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
							: 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
					}`}
				>
					<tab.icon className="w-4 h-4" />
					<span>{tab.label}</span>
					{tab.unread > 0 && (
						<span className="absolute top-2 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
							{tab.unread > 9 ? '9+' : tab.unread}
						</span>
					)}
				</button>
			))}
		</div>
	);
};

export default ChatTabs;
