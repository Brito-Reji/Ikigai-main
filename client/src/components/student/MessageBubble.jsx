import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
	const formatTime = (timestamp) => {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', { 
			hour: 'numeric', 
			minute: '2-digit',
			hour12: true 
		});
	};

	return (
		<div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
			<div
				className={`max-w-[75%] sm:max-w-[60%] rounded-2xl px-4 py-2 ${
					isOwn
						? 'bg-blue-600 text-white rounded-br-sm'
						: 'bg-gray-100 text-gray-900 rounded-bl-sm'
				}`}
			>
				<p className="text-sm sm:text-base leading-relaxed break-words">
					{message.content}
				</p>
				<div className={`flex items-center justify-end gap-1 mt-1 ${
					isOwn ? 'text-blue-100' : 'text-gray-500'
				}`}>
					<span className="text-xs">
						{formatTime(message.timestamp)}
					</span>
					{isOwn && (
						<span>
							{message.status === 'read' ? (
								<CheckCheck className="w-4 h-4 text-blue-200" />
							) : message.status === 'delivered' ? (
								<CheckCheck className="w-4 h-4" />
							) : (
								<Check className="w-4 h-4" />
							)}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default MessageBubble;
