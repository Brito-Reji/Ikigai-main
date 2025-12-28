import React, { useState } from 'react';
import {
	ChevronLeft,
	ChevronRight,
	CheckCircle,
	FileText,
	Download,
	BookOpen
} from 'lucide-react';
import VideoPlayer from './VideoPlayer';

const LessonViewer = ({ lesson, chapter, onPrevious, onNext, hasPrevious, hasNext, onMarkComplete }) => {
	const [activeTab, setActiveTab] = useState('overview');

	const handleMarkComplete = () => {
		if (onMarkComplete) {
			onMarkComplete(lesson._id);
		}
	};

	return (
		<div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
			<div className="flex-shrink-0">
				<VideoPlayer
					videoUrl={lesson.videoUrl}
					onEnded={() => {
						if (!lesson.isCompleted) {
							handleMarkComplete();
						}
					}}
				/>
			</div>

			<div className="flex-1 overflow-y-auto">
				<div className="p-6">
					<div className="flex items-start justify-between mb-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-2">
								<span className="text-sm text-gray-500">
									{chapter.title}
								</span>
							</div>
							<h1 className="text-2xl font-bold text-gray-900 mb-2">
								{lesson.title}
							</h1>
							<p className="text-gray-600">
								{lesson.description}
							</p>
						</div>
						{!lesson.isCompleted && (
							<button
								onClick={handleMarkComplete}
								className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
							>
								<CheckCircle className="w-5 h-5" />
								Mark Complete
							</button>
						)}
					</div>

					<div className="border-b border-gray-200 mb-6">
						<nav className="flex gap-6">
							{['overview', 'resources'].map((tab) => (
								<button
									key={tab}
									onClick={() => setActiveTab(tab)}
									className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
										activeTab === tab
											? 'border-blue-600 text-blue-600'
											: 'border-transparent text-gray-500 hover:text-gray-700'
									}`}
								>
									{tab === 'overview' ? (
										<span className="flex items-center gap-2">
											<BookOpen className="w-4 h-4" />
											Overview
										</span>
									) : (
										<span className="flex items-center gap-2">
											<FileText className="w-4 h-4" />
											Resources
										</span>
									)}
								</button>
							))}
						</nav>
					</div>

					{activeTab === 'overview' && (
						<div className="space-y-4">
							<div>
								<h3 className="font-semibold text-gray-900 mb-2">
									About This Lesson
								</h3>
								<p className="text-gray-700 leading-relaxed">
									{lesson.description}
								</p>
							</div>

							<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
								<h4 className="font-semibold text-blue-900 mb-2">
									What You'll Learn
								</h4>
								<ul className="space-y-2 text-blue-800">
									<li className="flex items-start gap-2">
										<CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
										<span>Key concepts and fundamentals</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
										<span>Practical examples and demonstrations</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
										<span>Best practices and tips</span>
									</li>
								</ul>
							</div>
						</div>
					)}

					{activeTab === 'resources' && (
						<div className="space-y-4">
							{lesson.resources && lesson.resources.length > 0 ? (
								<div>
									<h3 className="font-semibold text-gray-900 mb-4">
										Downloadable Resources
									</h3>
									<div className="space-y-3">
										{lesson.resources.map((resource, index) => (
											<a
												key={index}
												href={resource.url}
												className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
											>
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
														<FileText className="w-5 h-5 text-blue-600" />
													</div>
													<div>
														<h4 className="font-medium text-gray-900 group-hover:text-blue-600">
															{resource.name}
														</h4>
														<p className="text-sm text-gray-500">
															{resource.type.toUpperCase()}
														</p>
													</div>
												</div>
												<Download className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
											</a>
										))}
									</div>
								</div>
							) : (
								<div className="text-center py-8">
									<FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
									<p className="text-gray-500">No resources available for this lesson</p>
								</div>
							)}
						</div>
					)}
				</div>

				<div className="border-t border-gray-200 p-4 bg-gray-50 flex items-center justify-between">
					<button
						onClick={onPrevious}
						disabled={!hasPrevious}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
							hasPrevious
								? 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
								: 'bg-gray-200 text-gray-400 cursor-not-allowed'
						}`}
					>
						<ChevronLeft className="w-5 h-5" />
						Previous
					</button>

					<button
						onClick={onNext}
						disabled={!hasNext}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
							hasNext
								? 'bg-blue-600 text-white hover:bg-blue-700'
								: 'bg-gray-200 text-gray-400 cursor-not-allowed'
						}`}
					>
						Next
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default LessonViewer;
