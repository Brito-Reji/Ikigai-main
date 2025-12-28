import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
	Menu,
	X,
	Home,
	ChevronRight,
	Award,
	MessageCircle,
	Star
} from 'lucide-react';
import ChapterList from '@/components/student/ChapterList';
import LessonViewer from '@/components/student/LessonViewer';
import ChatWindow from '@/components/student/ChatWindow';
import { getEnrolledCourseById, getLessonById } from '@/data/mockEnrolledCourses';
import { getConversationByInstructorId } from '@/data/mockChatData';

const CourseViewerPage = () => {
	const { courseId } = useParams();
	const navigate = useNavigate();
	const location = useLocation();

	const course = getEnrolledCourseById(courseId);

	const initialLessonId = location.state?.lessonId || course?.currentLesson || course?.chapters[0]?.lessons[0]?._id;

	const [currentLessonId, setCurrentLessonId] = useState(initialLessonId);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [completedLessons, setCompletedLessons] = useState(
		new Set(
			course?.chapters.flatMap(ch =>
				ch.lessons.filter(l => l.isCompleted).map(l => l._id)
			) || []
		)
	);

	useEffect(() => {
		const handleResize = () => {
			setIsSidebarOpen(window.innerWidth >= 1024);
		};

		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

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

	const currentLessonData = getLessonById(courseId, currentLessonId);
	if (!currentLessonData) {
		return <div>Lesson not found</div>;
	}

	const { lesson: currentLesson, chapter: currentChapter } = currentLessonData;

	const getAllLessons = () => {
		return course.chapters.flatMap((chapter) =>
			chapter.lessons.map((lesson) => ({
				...lesson,
				chapterId: chapter._id,
				chapterTitle: chapter.title
			}))
		);
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

	const courseProgress = Math.round(
		(completedLessons.size / course.totalLessons) * 100
	);

	return (
		<div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
			<div className="flex-shrink-0 bg-white border-b border-gray-200 shadow-sm">
				<div className="px-4 py-3">
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

						<button
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="hidden lg:block p-2 hover:bg-gray-100 rounded-lg transition-colors"
						>
							{isSidebarOpen ? (
								<X className="w-5 h-5" />
							) : (
								<Menu className="w-5 h-5" />
							)}
						</button>

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
									{completedLessons.size} / {course.totalLessons} lessons
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
							{course.chapters.length} chapters • {course.totalLessons} lessons
						</p>
					</div>

					<div className="flex-1 overflow-y-auto p-4">
						<ChapterList
							chapters={course.chapters.map((chapter) => ({
								...chapter,
								lessons: chapter.lessons.map((lesson) => ({
									...lesson,
									isCompleted: completedLessons.has(lesson._id)
								}))
							}))}
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

				<main className="flex-1 overflow-hidden">
					<div className="h-full p-4 lg:p-6">
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

			{/* Floating Chat Button */}
			<button
				onClick={() => setIsChatOpen(!isChatOpen)}
				className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center"
			>
				{isChatOpen ? (
					<X className="w-6 h-6" />
				) : (
					<MessageCircle className="w-6 h-6" />
				)}
			</button>

			{/* Chat Modal */}
			{isChatOpen && (
				<>
					<div
						className="fixed inset-0 bg-black/50 z-40"
						onClick={() => setIsChatOpen(false)}
					/>
					<div className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl overflow-hidden animate-fade-in">
						<ChatWindow
							conversation={getConversationByInstructorId(course.instructor._id)}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default CourseViewerPage;
