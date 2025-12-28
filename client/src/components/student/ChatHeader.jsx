import React from 'react';
import { MoreVertical, Phone, Video } from 'lucide-react';

const ChatHeader = ({ instructor, courseTitle, isOnline }) => {
	return (
		<div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
			<div className="flex items-center gap-3 flex-1 min-w-0">
				<div className="relative flex-shrink-0">
					<img
						src={instructor.avatar}
						alt={instructor.name}
						className="w-10 h-10 rounded-full object-cover"
					/>
					{isOnline && (
						<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
					)}
				</div>
				
				<div className="flex-1 min-w-0">
					<h3 className="font-semibold text-gray-900 truncate">
						{instructor.name}
					</h3>
					<p className="text-xs text-gray-500 truncate">
						{courseTitle}
					</p>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
					<Video className="w-5 h-5" />
				</button>
				<button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
					<Phone className="w-5 h-5" />
				</button>
				<button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
					<MoreVertical className="w-5 h-5" />
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
