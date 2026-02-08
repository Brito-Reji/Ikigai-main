import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
	Menu,
	X,
	Home,
	ChevronRight,
	Award,
	MessageCircle,
	Star,
	Users
} from 'lucide-react';
import ChapterList from '@/components/student/ChapterList';
import LessonViewer from '@/components/student/LessonViewer';
import ChatWindow from '@/components/student/ChatWindow';
import ChatRoomWindow from '@/components/student/ChatRoomWindow';
import { useGetRoomByCourse, useCreateConversation } from '@/hooks/useChat';
import api from '@/api/axiosConfig';
import { useGetEnrolledCourseById } from '@/hooks/useEnrollment';

const CourseViewerPage = () => {
	const { courseId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const { data: enrollment, isLoading } = useGetEnrolledCourseById(courseId);
	console.log("enrollment", enrollment);
	const course = enrollment?.data?.course
	const initialLessonId = location.state?.lessonId || enrollment?.data?.progress?.lastAccessedLesson || course?.chapters?.[0]?.lessons?.[0]?._id;

	const [currentLessonId, setCurrentLessonId] = useState(initialLessonId);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [showChatMenu, setShowChatMenu] = useState(false);
	const [chatMode, setChatMode] = useState('room'); // 'instructor' or 'room'
	const [completedLessons, setCompletedLessons] = useState(
		new Set(enrollment?.data?.progress?.completedLessons || [])
	);
	const [conversation, setConversation] = useState(null);

	// chat hooks
	const { data: roomData, isLoading: roomLoading } = useGetRoomByCourse(courseId);
	const room = roomData?.data;
	const createConversation = useCreateConversation();


	useEffect(() => {
		const handleResize = () => {
			setIsSidebarOpen(window.innerWidth >= 1024);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		if (enrollment?.data) {
			// Set lesson ID when data loads
			const lessonId = location.state?.lessonId || 
							 enrollment.data.progress?.lastAccessedLesson || 
							 enrollment.data.course?.chapters?.[0]?.lessons?.[0]?._id;
			
			if (lessonId && !currentLessonId) {
				setCurrentLessonId(lessonId);
			}

			// Update completed lessons
			if (enrollment.data.progress?.completedLessons) {
				setCompletedLessons(new Set(enrollment.data.progress.completedLessons));
			}
		}
	}, [enrollment, location.state?.lessonId, currentLessonId]);


	console.log("course", course);
	
	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Loading...
					</h2>
				</div>
			</div>
		);
	}
	
	if (!course) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-gray-900 mb-4">
						Course not found
					</h2>
					<Link
						to="/my-courses"
						className="text-blue-600 hover:text-blue-700"
					>
						Back to My Courses
					</Link>
				</div>
			</div>
		);
	}

	const currentChapter = course?.chapters?.find((chapter) =>
		chapter.lessons?.some((lesson) => lesson._id === currentLessonId)
	);
	
	const currentLesson = currentChapter?.lessons?.find((lesson) => lesson._id === currentLessonId);

	if (!currentLesson) {
		return <div>Lesson not found</div>;
	}

	const getAllLessons = () => {
		return course?.chapters?.flatMap((chapter) =>
			chapter.lessons?.map((lesson) => ({
				...lesson,
				chapterId: chapter._id,
				chapterTitle: chapter.title
			})) || []
		) || [];
	};

	const allLessons = getAllLessons();
	const currentLessonIndex = allLessons.findIndex(
		(l) => l._id === currentLessonId
	);

	const handleLessonSelect = (lessonId) => {
		setCurrentLessonId(lessonId);
		if (window.innerWidth < 1024) {
			setIsSidebarOpen(false);
		}
	};

	const handlePrevious = () => {
		if (currentLessonIndex > 0) {
			setCurrentLessonId(allLessons[currentLessonIndex - 1]._id);
		}
	};

	const handleNext = () => {
		if (currentLessonIndex < allLessons.length - 1) {
			setCurrentLessonId(allLessons[currentLessonIndex + 1]._id);
		}
	};

	const handleMarkComplete = (lessonId) => {
		setCompletedLessons((prev) => new Set([...prev, lessonId]));
	};

	// open instructor chat
	const handleOpenInstructorChat = async () => {
		if (!course?.instructor?._id) return;
		try {
			const result = await createConversation.mutateAsync({
				instructorId: course.instructor._id,
				courseId: courseId
			});
			if (result?.data) {
				setConversation({
					_id: result.data._id,
					instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
					instructorAvatar: course.instructor.avatar,
					courseTitle: course.title
				});
				setChatMode('instructor');
				setIsChatOpen(true);
				setShowChatMenu(false);
			}
		} catch (err) {
			console.error('Failed to create conversation:', err);
		}
	};

	const totalLessons = course?.chapters?.reduce(
		(sum, chapter) => sum + (chapter.lessons?.length || 0), 
		0
	) || 0;

	const courseProgress = totalLessons > 0 
		? Math.round((completedLessons.size / totalLessons) * 100)
		: 0;

	return (
		<div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
			<div className="flex-shrink-0 bg-white border-b relative border-gray-200 shadow-sm">
				<div className="px-4 py-3 sticky top-10 z-10">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center gap-3">
							<button
								onClick={() => setIsSidebarOpen(!isSidebarOpen)}
								className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
							>
								{isSidebarOpen ? (
									<X className="w-5 h-5" />
								) : (
									<Menu className="w-5 h-5" />
								)}
							</button>

							<nav className="flex items-center gap-2 text-sm">
								<Link
									to="/"
									className="text-gray-500 hover:text-gray-700 transition-colors"
								>
									<Home className="w-4 h-4" />
								</Link>
								<ChevronRight className="w-4 h-4 text-gray-400" />
								<Link
									to="/my-courses"
									className="text-gray-500 hover:text-gray-700 transition-colors"
								>
									My Courses
								</Link>
								<ChevronRight className="w-4 h-4 text-gray-400" />
								<span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">
									{course.title}
								</span>
							</nav>
						</div>

						{/* Review button - always visible now */}
						<button
							onClick={() => setIsReviewModalOpen(true)}
							className="hidden lg:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Star className="w-4 h-4" />
							<span className="text-sm font-medium">Rate Course</span>
						</button>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex-1">
							<div className="flex items-center justify-between mb-1">
								<span className="text-xs font-medium text-gray-600">
									Course Progress
								</span>
								<span className="text-xs text-gray-600">
								{completedLessons.size} / {totalLessons} lessons
							</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
									style={{ width: `${courseProgress}%` }}
								/>
							</div>
						</div>

						{courseProgress === 100 && (
							<div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
								<Award className="w-4 h-4" />
								<span className="text-xs font-semibold">Completed!</span>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="flex-1 flex overflow-hidden">
				<aside
					className={`${
						isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
					} lg:translate-x-0 fixed lg:relative z-30 w-80 lg:w-96 h-full bg-white border-r border-gray-200 transition-transform duration-300 flex flex-col`}
				>
					<div className="p-4 border-b border-gray-200">
						<h2 className="font-bold text-gray-900 text-lg mb-1">
							Course Content
						</h2>
						<p className="text-sm text-gray-600">
							{course?.chapters?.length || 0} chapters • {totalLessons} lessons
						</p>
					</div>

					<div className="flex-1 overflow-y-auto p-4">
						<ChapterList
							chapters={course?.chapters?.map((chapter) => ({
								...chapter,
								lessons: chapter.lessons?.map((lesson) => ({
									...lesson,
									isCompleted: completedLessons.has(lesson._id)
								})) || []
							})) || []}
							currentLessonId={currentLessonId}
							onLessonSelect={handleLessonSelect}
						/>
					</div>
				</aside>

				{isSidebarOpen && (
					<div
						className="fixed inset-0 bg-black/50 z-20 lg:hidden"
						onClick={() => setIsSidebarOpen(false)}
					/>
				)}

				<main className="flex-1 overflow-y-auto">
					<div className="p-4 lg:p-6">
						<LessonViewer
							lesson={{
								...currentLesson,
								isCompleted: completedLessons.has(currentLesson._id)
							}}
							chapter={currentChapter}
							onPrevious={handlePrevious}
							onNext={handleNext}
							hasPrevious={currentLessonIndex > 0}
							hasNext={currentLessonIndex < allLessons.length - 1}
							onMarkComplete={handleMarkComplete}
						/>
					</div>
				</main>
			</div>

			{/* Floating Chat Button with Dropdown */}
			<div className="fixed bottom-6 right-6 z-40">
				{/* dropdown menu */}
				{showChatMenu && !isChatOpen && (
					<div className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden w-64 animate-fade-in">
						<button
							onClick={handleOpenInstructorChat}
							disabled={createConversation.isPending}
							className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-left disabled:opacity-50"
						>
							<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
								<MessageCircle className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<p className="font-medium text-gray-900">Chat with Instructor</p>
								<p className="text-xs text-gray-500">Direct message {course?.instructor?.firstName || 'instructor'}</p>
							</div>
						</button>
						<div className="border-t border-gray-100"></div>
						<button
							onClick={() => {
								setChatMode('room');
								setIsChatOpen(true);
								setShowChatMenu(false);
							}}
							className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors text-left"
						>
							<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
								<Users className="w-5 h-5 text-purple-600" />
							</div>
							<div>
								<p className="font-medium text-gray-900">Course Discussion</p>
								<p className="text-xs text-gray-500">Chat with all students</p>
							</div>
						</button>
					</div>
				)}

				{/* main button */}
				<button
					onClick={() => {
						if (isChatOpen) {
							setIsChatOpen(false);
							setShowChatMenu(false);
						} else {
							setShowChatMenu(!showChatMenu);
						}
					}}
					className={`w-14 h-14 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center ${
						isChatOpen 
							? 'bg-gray-700 text-white hover:bg-gray-800' 
							: 'bg-blue-600 text-white hover:bg-blue-700'
					}`}
				>
					{isChatOpen ? (
						<X className="w-6 h-6" />
					) : (
						<MessageCircle className="w-6 h-6" />
					)}
				</button>
			</div>

			{/* backdrop for chat menu */}
			{showChatMenu && !isChatOpen && (
				<div 
					className="fixed inset-0 z-30" 
					onClick={() => setShowChatMenu(false)}
				/>
			)}

			{/* Chat Modal */}
			{isChatOpen && (
				<>
					<div
						className="fixed inset-0 bg-black/50 z-40"
						onClick={() => setIsChatOpen(false)}
					/>
					<div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in flex flex-col">
						{/* mini chat header */}
						<div className="flex-shrink-0 flex items-center justify-between px-3 py-2 bg-gray-50 border-b">
							<span className="text-sm font-medium text-gray-700">
								{chatMode === 'instructor' ? 'Instructor Chat' : 'Course Discussion'}
							</span>
							<Link
								to="/chat"
								className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800"
							>
								<span>Open Full Chat</span>
								<ChevronRight className="w-3 h-3" />
							</Link>
						</div>
						<div className="flex-1 overflow-hidden">
							{chatMode === 'instructor' ? (
								<ChatWindow conversation={conversation} />
							) : roomLoading ? (
								<div className="flex items-center justify-center h-full">
									<div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
								</div>
							) : (
								<ChatRoomWindow room={room} />
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default CourseViewerPage;
