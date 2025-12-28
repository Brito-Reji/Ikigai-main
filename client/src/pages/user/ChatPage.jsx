import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import ConversationList from '@/components/student/ConversationList';
import ChatWindow from '@/components/student/ChatWindow';
import { mockConversations, getConversationById } from '@/data/mockChatData';

const ChatPage = () => {
	const [selectedConversationId, setSelectedConversationId] = useState(null);
	const [showChatOnMobile, setShowChatOnMobile] = useState(false);

	const selectedConversation = selectedConversationId
		? getConversationById(selectedConversationId)
		: null;

	const handleSelectConversation = (conversationId) => {
		setSelectedConversationId(conversationId);
		setShowChatOnMobile(true);
	};

	const handleBackToList = () => {
		setShowChatOnMobile(false);
	};

	return (
		<div className="h-[calc(100vh-64px)] flex flex-col bg-white overflow-hidden">
			<div className="flex-1 flex overflow-hidden">
				<div className={`${
					showChatOnMobile ? 'hidden' : 'block'
				} lg:block w-full lg:w-auto h-full`}>
					<ConversationList
						conversations={mockConversations}
						selectedConversationId={selectedConversationId}
						onSelectConversation={handleSelectConversation}
					/>
				</div>

				<div className={`${
					showChatOnMobile ? 'block' : 'hidden'
				} lg:block flex-1 h-full`}>
					{showChatOnMobile && selectedConversation && (
						<div className="lg:hidden bg-white border-b border-gray-200 p-4">
							<button
								onClick={handleBackToList}
								className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
							>
								<ArrowLeft className="w-5 h-5" />
								<span>Back</span>
							</button>
						</div>
					)}
					<ChatWindow conversation={selectedConversation} />
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
