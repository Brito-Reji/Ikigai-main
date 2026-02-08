import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Users, Search, GraduationCap, MoreVertical } from 'lucide-react';
import { useGetInstructorConversations, useGetInstructorRooms } from '@/hooks/useInstructorChat';
import InstructorChatWindow from '@/components/instructor/InstructorChatWindow';
import InstructorRoomWindow from '@/components/instructor/InstructorRoomWindow';

const InstructorChatPage = () => {
	const { conversationId, roomId } = useParams();
	const navigate = useNavigate();
	
	const [activeTab, setActiveTab] = useState(roomId ? 'rooms' : 'direct');
	const [selectedConversation, setSelectedConversation] = useState(null);
	const [selectedRoom, setSelectedRoom] = useState(null);
	const [showChatOnMobile, setShowChatOnMobile] = useState(!!conversationId || !!roomId);

	const { data: conversationsData, isLoading: loadingConversations } = useGetInstructorConversations();
	const { data: roomsData, isLoading: loadingRooms } = useGetInstructorRooms();

	const conversations = conversationsData?.data || [];
	const rooms = roomsData?.data || [];

	const directUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
	const roomsUnread = rooms.reduce((sum, r) => sum + (r.unreadCount || 0), 0);

	// set conversation/room from URL param
	useEffect(() => {
		if (conversationId && conversations.length > 0) {
			const conv = conversations.find(c => c._id === conversationId);
			if (conv) {
				setSelectedConversation(conv);
				setActiveTab('direct');
				setShowChatOnMobile(true);
			}
		}
	}, [conversationId, conversations]);

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

	const handleSelectConversation = (conv) => {
		setSelectedConversation(conv);
		setSelectedRoom(null);
		setShowChatOnMobile(true);
		navigate(`/instructor/communication/conversation/${conv._id}`);
	};

	const handleSelectRoom = (room) => {
		setSelectedRoom(room);
		setSelectedConversation(null);
		setShowChatOnMobile(true);
		navigate(`/instructor/communication/room/${room._id}`);
	};

	const handleBackToList = () => {
		setShowChatOnMobile(false);
		navigate('/instructor/communication');
	};

	const formatTime = (timestamp) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffMs = now - date;
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m`;
		if (diffHours < 24) return `${diffHours}h`;
		if (diffDays < 7) return `${diffDays}d`;
		return date.toLocaleDateString();
	};

	const isLoading = activeTab === 'direct' ? loadingConversations : loadingRooms;

	return (
		<div className="h-[calc(100vh-64px)] flex flex-col bg-white overflow-hidden">
			{/* tabs */}
			<div className="flex-shrink-0 bg-white border-b border-gray-200 px-4">
				<div className="flex gap-4">
					<button
						onClick={() => { setActiveTab('direct'); setSelectedConversation(null); setSelectedRoom(null); navigate('/instructor/communication'); }}
						className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
							activeTab === 'direct' 
								? 'border-blue-600 text-blue-600' 
								: 'border-transparent text-gray-500 hover:text-gray-700'
						}`}
					>
						<MessageSquare className="w-4 h-4" />
						Student Messages
						{directUnread > 0 && (
							<span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
								{directUnread}
							</span>
						)}
					</button>
					<button
						onClick={() => { setActiveTab('rooms'); setSelectedConversation(null); setSelectedRoom(null); navigate('/instructor/communication'); }}
						className={`py-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
							activeTab === 'rooms' 
								? 'border-blue-600 text-blue-600' 
								: 'border-transparent text-gray-500 hover:text-gray-700'
						}`}
					>
						<Users className="w-4 h-4" />
						Course Rooms
						{roomsUnread > 0 && (
							<span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
								{roomsUnread}
							</span>
						)}
					</button>
				</div>
			</div>

			<div className="flex-1 flex overflow-hidden">
				{/* list panel */}
				<div className={`${showChatOnMobile ? 'hidden' : 'block'} lg:block w-full lg:w-96 h-full bg-white border-r border-gray-200`}>
					<div className="p-4 border-b border-gray-200">
						<h2 className="text-lg font-bold text-gray-900 mb-3">
							{activeTab === 'direct' ? 'Student Conversations' : 'Your Course Rooms'}
						</h2>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search..."
								className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					{isLoading ? (
						<div className="flex items-center justify-center h-40">
							<div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
						</div>
					) : (
						<div className="overflow-y-auto h-[calc(100%-100px)]">
							{activeTab === 'direct' ? (
								conversations.length === 0 ? (
									<div className="p-8 text-center text-gray-500">
										<MessageSquare className="w-10 h-10 mx-auto mb-2 text-gray-300" />
										<p>No student messages yet</p>
									</div>
								) : (
									conversations.map((conv) => (
										<button
											key={conv._id}
											onClick={() => handleSelectConversation(conv)}
											className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
												selectedConversation?._id === conv._id ? 'bg-blue-50' : ''
											}`}
										>
											<img
												src={conv.studentAvatar || 'https://i.pravatar.cc/150'}
												alt={conv.studentName}
												className="w-10 h-10 rounded-full object-cover"
											/>
											<div className="flex-1 min-w-0 text-left">
												<div className="flex items-baseline justify-between mb-1">
													<h3 className="font-medium text-gray-900 truncate text-sm">{conv.studentName}</h3>
													<span className="text-xs text-gray-500 ml-2">{formatTime(conv.lastMessageTime)}</span>
												</div>
												<p className="text-xs text-gray-500 truncate">{conv.courseTitle}</p>
												<div className="flex items-center justify-between mt-1">
													<p className="text-sm text-gray-600 truncate">{conv.lastMessage || 'No messages'}</p>
													{conv.unreadCount > 0 && (
														<span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
															{conv.unreadCount}
														</span>
													)}
												</div>
											</div>
										</button>
									))
								)
							) : (
								rooms.length === 0 ? (
									<div className="p-8 text-center text-gray-500">
										<Users className="w-10 h-10 mx-auto mb-2 text-gray-300" />
										<p>No course rooms yet</p>
										<p className="text-sm mt-1">Publish a course to create a room</p>
									</div>
								) : (
									rooms.map((room) => (
										<button
											key={room._id}
											onClick={() => handleSelectRoom(room)}
											className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
												selectedRoom?._id === room._id ? 'bg-blue-50' : ''
											}`}
										>
											<img
												src={room.courseThumbnail}
												alt={room.courseTitle}
												className="w-10 h-10 rounded-lg object-cover"
											/>
											<div className="flex-1 min-w-0 text-left">
												<div className="flex items-baseline justify-between mb-1">
													<h3 className="font-medium text-gray-900 truncate text-sm">{room.courseTitle}</h3>
													<span className="text-xs text-gray-500 ml-2">{formatTime(room.lastMessageTime)}</span>
												</div>
												<p className="text-xs text-gray-500 flex items-center gap-1">
													<Users className="w-3 h-3" />
													{room.participantCount} students
												</p>
												<div className="flex items-center justify-between mt-1">
													<p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
													{room.unreadCount > 0 && (
														<span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
															{room.unreadCount}
														</span>
													)}
												</div>
											</div>
										</button>
									))
								)
							)}
						</div>
					)}
				</div>

				{/* chat panel */}
				<div className={`${showChatOnMobile ? 'block' : 'hidden'} lg:block flex-1 h-full`}>
					{showChatOnMobile && (
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
						<InstructorChatWindow conversation={selectedConversation} />
					) : (
						<InstructorRoomWindow room={selectedRoom} />
					)}
				</div>
			</div>
		</div>
	);
};

export default InstructorChatPage;
