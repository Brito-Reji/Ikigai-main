import React from 'react';
import { Search, Users } from 'lucide-react';

const CourseRoomList = ({ rooms, selectedRoomId, onSelectRoom }) => {
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
				<h2 className="text-xl font-bold text-gray-900 mb-4">Course Rooms</h2>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						type="text"
						placeholder="Search rooms..."
						className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto">
				{rooms.map((room) => (
					<button
						key={room._id || room.id}
						onClick={() => onSelectRoom(room)}
						className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
							selectedRoomId === (room._id || room.id) ? 'bg-blue-50' : ''
						}`}
					>
						<div className="relative flex-shrink-0">
							<img
								src={room.courseThumbnail}
								alt={room.courseTitle}
								className="w-12 h-12 rounded-lg object-cover"
							/>
							<div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
								<Users className="w-3 h-3" />
							</div>
						</div>

						<div className="flex-1 min-w-0 text-left">
							<div className="flex items-baseline justify-between mb-1">
								<h3 className="font-semibold text-gray-900 truncate text-sm">
									{room.courseTitle}
								</h3>
								<span className="text-xs text-gray-500 ml-2 flex-shrink-0">
									{formatTime(room.lastMessageTime)}
								</span>
							</div>
							<p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
								<Users className="w-3 h-3" />
								{room.participantCount} members
							</p>
							<div className="flex items-center justify-between">
								<p className="text-sm text-gray-600 truncate flex-1">
									{room.lastMessage}
								</p>
								{room.unreadCount > 0 && (
									<span className="ml-2 flex-shrink-0 bg-blue-600 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
										{room.unreadCount > 9 ? '9+' : room.unreadCount}
									</span>
								)}
							</div>
						</div>
					</button>
				))}

				{rooms.length === 0 && (
					<div className="p-8 text-center text-gray-500">
						<Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
						<p>No course rooms yet</p>
						<p className="text-sm mt-1">Enroll in courses to join their discussion rooms</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default CourseRoomList;
