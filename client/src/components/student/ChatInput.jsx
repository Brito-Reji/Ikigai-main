import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Send, Smile } from 'lucide-react';
import { startTyping, stopTyping } from '@/lib/socket';
import EmojiPicker from 'emoji-picker-react';

const ChatInput = ({ onSendMessage, placeholder = "Type a message...", conversationId = null }) => {
	const [message, setMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const typingTimeoutRef = useRef(null);
	const emojiPickerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
				setShowEmojiPicker(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const onEmojiClick = (emojiObject) => {
		setMessage(prev => prev + emojiObject.emoji);
		if (!isTyping && conversationId) handleTypingStart();
	};

	const handleTypingStart = useCallback(() => {
		if (!conversationId) return;
		if (!isTyping) {
			setIsTyping(true);
			startTyping({ conversationId });
		}
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
		typingTimeoutRef.current = setTimeout(() => {
			setIsTyping(false);
			stopTyping({ conversationId });
		}, 2000);
	}, [isTyping, conversationId]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (message.trim()) {
			onSendMessage(message.trim());
			setMessage('');
			if (conversationId) {
				setIsTyping(false);
				stopTyping({ conversationId });
				if (typingTimeoutRef.current) {
					clearTimeout(typingTimeoutRef.current);
				}
			}
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			// On mobile, Enter adds a new line. On desktop, Enter sends the message.
			if (window.innerWidth < 768) return;
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleChange = (e) => {
		setMessage(e.target.value);
		if (e.target.value.trim()) {
			handleTypingStart();
		}
	};

	return (
		<form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4">
			<div className="flex items-end gap-2">
				<div className="relative hidden sm:block" ref={emojiPickerRef}>
					<button
						type="button"
						onClick={() => setShowEmojiPicker(!showEmojiPicker)}
						className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100 focus:outline-none"
						title="Add emoji"
					>
						<Smile className="w-6 h-6" />
					</button>

					{showEmojiPicker && (
						<div 
							className="absolute bottom-full left-0 mb-2 z-50 shadow-xl rounded-lg bg-white" 
							style={{ width: 'min(350px, calc(100vw - 32px))' }}
						>
							<EmojiPicker onEmojiClick={onEmojiClick} theme="light" width="100%" height={350} />
						</div>
					)}
				</div>

				<div className="flex-1 relative">
					<textarea
						value={message}
						onChange={handleChange}
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
