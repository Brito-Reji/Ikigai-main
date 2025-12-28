import React, { useState } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

const ChatInput = ({ onSendMessage, placeholder = "Type a message..." }) => {
	const [message, setMessage] = useState('');

	const handleSubmit = (e) => {
		e.preventDefault();
		if (message.trim()) {
			onSendMessage(message.trim());
			setMessage('');
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
			<div className="flex items-end gap-2">
				<button
					type="button"
					className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
				>
					<Smile className="w-6 h-6" />
				</button>
				
				<button
					type="button"
					className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
				>
					<Paperclip className="w-6 h-6" />
				</button>

				<div className="flex-1 relative">
					<textarea
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder={placeholder}
						rows={1}
						className="w-full px-4 py-2 bg-gray-100 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-32 overflow-y-auto"
						style={{
							minHeight: '40px',
							maxHeight: '128px'
						}}
					/>
				</div>

				<button
					type="submit"
					disabled={!message.trim()}
					className={`p-2 rounded-full transition-all ${
						message.trim()
							? 'bg-blue-600 text-white hover:bg-blue-700 scale-100'
							: 'bg-gray-200 text-gray-400 cursor-not-allowed scale-95'
					}`}
				>
					<Send className="w-6 h-6" />
				</button>
			</div>
		</form>
	);
};

export default ChatInput;
