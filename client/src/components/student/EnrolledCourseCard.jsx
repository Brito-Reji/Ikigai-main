import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayCircle, Clock, Calendar, TrendingUp } from 'lucide-react';

const EnrolledCourseCard = ({ course }) => {
	const navigate = useNavigate();

	const formatDate = (dateString) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now - date);
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;
		if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
		return date.toLocaleDateString();
	};

	const handleContinueLearning = () => {
		navigate(`/my-courses/${course._id}`, { 
			state: { lessonId: course.currentLesson } 
		});
	};

	return (
		<div className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
			<div className="relative overflow-hidden h-48">
				<img
					src={course.thumbnail}
					alt={course.title}
					className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div className="absolute bottom-4 left-4 right-4">
						<button
							onClick={handleContinueLearning}
							className="w-full bg-white text-gray-900 py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
						>
							<PlayCircle className="w-5 h-5" />
							Continue Learning
						</button>
					</div>
				</div>
				
				<div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
					<span className="text-sm font-semibold text-gray-900">{course.progress}% Complete</span>
				</div>
			</div>

			<div className="p-5">
				<div className="mb-3">
					<span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full">
						{course.category}
					</span>
				</div>

				<h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
					{course.title}
				</h3>

				<div className="flex items-center gap-2 mb-4">
				{course.instructor?.avatar && (
					<img
						src={course.instructor.avatar}
						alt={course.instructor?.name || 'Instructor'}
						className="w-6 h-6 rounded-full"
					/>
				)}
				<span className="text-sm text-gray-600">{course.instructor?.name || 'Instructor'}</span>
			</div>

				<div className="mb-4">
					<div className="flex justify-between items-center mb-2">
						<span className="text-xs text-gray-600 font-medium">Progress</span>
						<span className="text-xs text-gray-600">
							{course.completedLessons} / {course.totalLessons} lessons
						</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
						<div
							className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
							style={{ width: `${course.progress}%` }}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
					<div className="flex items-center gap-2 text-gray-600">
						<Calendar className="w-4 h-4" />
						<span className="text-xs">{formatDate(course.lastAccessed)}</span>
					</div>
					<div className="flex items-center gap-2 text-gray-600">
						<Clock className="w-4 h-4" />
						<span className="text-xs">{course.totalDuration}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EnrolledCourseCard;
