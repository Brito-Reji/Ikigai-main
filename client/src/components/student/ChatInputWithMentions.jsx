import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Smile, Paperclip, AtSign, X } from 'lucide-react';
import { startTyping, stopTyping } from '@/lib/socket';

const ChatInputWithMentions = ({ 
	onSendMessage, 
	placeholder = "Type a message...",
	participants = [],
	showMentions = false,
	conversationId = null,
	roomId = null
}) => {
	const [message, setMessage] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [mentionSearch, setMentionSearch] = useState('');
	const [cursorPosition, setCursorPosition] = useState(0);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	const inputRef = useRef(null);
	const typingTimeoutRef = useRef(null);

	// filter participants based on search
	const filteredParticipants = participants.filter(p => 
		p.name.toLowerCase().includes(mentionSearch.toLowerCase())
	);

	// handle typing indicator
	const handleTypingStart = useCallback(() => {
		if (!isTyping) {
			setIsTyping(true);
			startTyping({ conversationId, roomId });
		}
		
		// clear existing timeout
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}
		
		// stop typing after 2 seconds of no input
		typingTimeoutRef.current = setTimeout(() => {
			setIsTyping(false);
			stopTyping({ conversationId, roomId });
		}, 2000);
	}, [isTyping, conversationId, roomId]);

	// cleanup on unmount
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
			if (isTyping) {
				stopTyping({ conversationId, roomId });
			}
		};
	}, [isTyping, conversationId, roomId]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		const cursor = e.target.selectionStart;
		setMessage(value);
		setCursorPosition(cursor);

		// emit typing
		if (value.trim()) {
			handleTypingStart();
		}

		// check for @ trigger
		if (showMentions) {
			const textBeforeCursor = value.slice(0, cursor);
			const lastAtIndex = textBeforeCursor.lastIndexOf('@');
			
			if (lastAtIndex !== -1) {
				const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
				// no space after @ means we're in mention mode
				if (!textAfterAt.includes(' ')) {
					setMentionSearch(textAfterAt);
					setShowSuggestions(true);
					setSelectedIndex(0);
					return;
				}
			}
		}
		setShowSuggestions(false);
	};

	const insertMention = (participant) => {
		const textBeforeCursor = message.slice(0, cursorPosition);
		const lastAtIndex = textBeforeCursor.lastIndexOf('@');
		const textAfterCursor = message.slice(cursorPosition);
		
		const newText = 
			message.slice(0, lastAtIndex) + 
			`@${participant.name} ` + 
			textAfterCursor;
		
		setMessage(newText);
		setShowSuggestions(false);
		setMentionSearch('');
		
		// focus back on input
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleKeyDown = (e) => {
		if (showSuggestions && filteredParticipants.length > 0) {
			if (e.key === 'ArrowDown') {
				e.preventDefault();
				setSelectedIndex(prev => 
					prev < filteredParticipants.length - 1 ? prev + 1 : 0
				);
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				setSelectedIndex(prev => 
					prev > 0 ? prev - 1 : filteredParticipants.length - 1
				);
			} else if (e.key === 'Enter' || e.key === 'Tab') {
				e.preventDefault();
				insertMention(filteredParticipants[selectedIndex]);
			} else if (e.key === 'Escape') {
				setShowSuggestions(false);
			}
		} else if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (message.trim()) {
			// extract mentions from message
			const mentionRegex = /@(\w+(?:\s\w+)?)/g;
			const mentions = [];
			let match;
			while ((match = mentionRegex.exec(message)) !== null) {
				const mentionedParticipant = participants.find(p => 
					p.name.toLowerCase() === match[1].toLowerCase()
				);
				if (mentionedParticipant) {
					mentions.push(mentionedParticipant.id);
				}
			}
			
			onSendMessage(message.trim(), mentions);
			setMessage('');
		}
	};

	// render message with highlighted mentions
	const renderMessagePreview = () => {
		if (!message) return null;
		
		const parts = message.split(/(@\w+(?:\s\w+)?)/g);
		return parts.map((part, i) => {
			if (part.startsWith('@')) {
				const name = part.slice(1);
				const isValid = participants.some(p => 
					p.name.toLowerCase() === name.toLowerCase()
				);
				return (
					<span 
						key={i} 
						className={isValid ? 'text-blue-600 font-medium' : 'text-gray-500'}
					>
						{part}
					</span>
				);
			}
			return part;
		});
	};

	return (
		<form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-4 relative">
			{/* mention suggestions dropdown */}
			{showSuggestions && filteredParticipants.length > 0 && (
				<div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-48 overflow-y-auto">
					<div className="p-2 border-b border-gray-100 flex items-center gap-2 text-xs text-gray-500">
						<AtSign className="w-3 h-3" />
						<span>Mention someone</span>
					</div>
					{filteredParticipants.map((participant, index) => (
						<button
							key={participant.id}
							type="button"
							onClick={() => insertMention(participant)}
							className={`w-full px-3 py-2 flex items-center gap-3 transition-colors ${
								index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
							}`}
						>
							<img 
								src={participant.avatar} 
								alt={participant.name}
								className="w-8 h-8 rounded-full object-cover"
							/>
							<div className="text-left">
								<p className="font-medium text-gray-900 text-sm">{participant.name}</p>
								<p className="text-xs text-gray-500 capitalize">{participant.type}</p>
							</div>
							{participant.type === 'instructor' && (
								<span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
									Instructor
								</span>
							)}
						</button>
					))}
				</div>
			)}

			<div className="flex items-end gap-2">
				<button
					type="button"
					className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
				>
					<Smile className="w-6 h-6" />
				</button>
				
				{showMentions && (
					<button
						type="button"
						onClick={() => {
							setMessage(prev => prev + '@');
							setShowSuggestions(true);
							setMentionSearch('');
							inputRef.current?.focus();
						}}
						className="p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50"
						title="Mention someone"
					>
						<AtSign className="w-6 h-6" />
					</button>
				)}

				<button
					type="button"
					className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
				>
					<Paperclip className="w-6 h-6" />
				</button>

				<div className="flex-1 relative">
					<textarea
						ref={inputRef}
						value={message}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
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

export default ChatInputWithMentions;
