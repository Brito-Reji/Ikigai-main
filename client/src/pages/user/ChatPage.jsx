import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import ChatTabs from '@/components/student/ChatTabs';
import ConversationList from '@/components/student/ConversationList';
import CourseRoomList from '@/components/student/CourseRoomList';
import ChatWindow from '@/components/student/ChatWindow';
import ChatRoomWindow from '@/components/student/ChatRoomWindow';
import { useGetConversations, useGetCourseRooms } from '@/hooks/useChat';

const ChatPage = () => {
	const { roomId } = useParams();
	const navigate = useNavigate();
	
	const [activeTab, setActiveTab] = useState(roomId ? 'rooms' : 'direct');
	const [selectedConversationId, setSelectedConversationId] = useState(null);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [showChatOnMobile, setShowChatOnMobile] = useState(!!roomId);

	// tanstack queries
	const { data: conversationsData, isLoading: loadingConversations } = useGetConversations();
	const { data: roomsData, isLoading: loadingRooms } = useGetCourseRooms();

	const conversations = conversationsData?.data || [];
	const rooms = roomsData?.data || [];

	// set room from URL param
	useEffect(() => {
		if (roomId && rooms.length > 0) {
			const room = rooms.find(r => r._id === roomId);
			if (room) {
				setSelectedRoom(room);
				setActiveTab('rooms');
				setShowChatOnMobile(true);
			}
		}
	}, [roomId, rooms]);

	// find selected conversation by _id
	const selectedConversation = selectedConversationId 
		? conversations.find(c => c._id === selectedConversationId)
		: null;

	// calc unread counts
	const directUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
	const roomsUnread = rooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);

	const handleSelectConversation = (conversationId) => {
		setSelectedConversationId(conversationId);
		setSelectedRoom(null);
		setShowChatOnMobile(true);
		navigate('/chat');
	};

	const handleSelectRoom = (room) => {
		setSelectedRoom(room);
		setSelectedConversationId(null);
		setShowChatOnMobile(true);
		navigate(`/chat/room/${room._id}`);
	};

	const handleBackToList = () => {
		setShowChatOnMobile(false);
		navigate('/chat');
	};

	const handleTabChange = (tab) => {
		setActiveTab(tab);
		setSelectedConversationId(null);
		setSelectedRoom(null);
		setShowChatOnMobile(false);
		navigate('/chat');
	};

	const isLoading = activeTab === 'direct' ? loadingConversations : loadingRooms;

	return (
		<div className="h-[calc(100vh-64px)] flex flex-col bg-white overflow-hidden">
			{/* tabs */}
			<ChatTabs 
				activeTab={activeTab} 
				onTabChange={handleTabChange}
				directUnread={directUnread}
				roomsUnread={roomsUnread}
			/>

			<div className="flex-1 flex overflow-hidden">
				{/* list panel */}
				<div className={`${
					showChatOnMobile ? 'hidden' : 'block'
				} lg:block w-full lg:w-auto h-full`}>
					{isLoading ? (
						<div className="w-full lg:w-96 h-full flex items-center justify-center bg-white border-r border-gray-200">
							<div className="text-center">
								<div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
								<p className="text-gray-500 text-sm">Loading...</p>
							</div>
						</div>
					) : activeTab === 'direct' ? (
						<ConversationList
							conversations={conversations}
							selectedConversationId={selectedConversationId}
							onSelectConversation={handleSelectConversation}
						/>
					) : (
						<CourseRoomList
							rooms={rooms}
							selectedRoomId={selectedRoom?._id}
							onSelectRoom={handleSelectRoom}
						/>
					)}
				</div>

				{/* chat panel */}
				<div className={`${
					showChatOnMobile ? 'block' : 'hidden'
				} lg:block flex-1 h-full`}>
					{showChatOnMobile && (selectedConversation || selectedRoom) && (
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
					
					{activeTab === 'direct' ? (
						<ChatWindow conversation={selectedConversation} />
					) : (
						<ChatRoomWindow room={selectedRoom} />
					)}
				</div>
			</div>
		</div>
	);
};

export default ChatPage;
