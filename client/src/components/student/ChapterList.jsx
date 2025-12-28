import React, { useState } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, Clock, CheckCircle, Circle } from 'lucide-react';

const ChapterList = ({ chapters, currentLessonId, onLessonSelect }) => {
	const [expandedChapters, setExpandedChapters] = useState(() => {
		const chapterWithCurrentLesson = chapters.findIndex(chapter =>
			chapter.lessons.some(lesson => lesson._id === currentLessonId)
		);
		return chapterWithCurrentLesson >= 0 ? [chapterWithCurrentLesson] : [0];
	});

	const toggleChapter = (index) => {
		setExpandedChapters(prev =>
			prev.includes(index)
				? prev.filter(i => i !== index)
				: [...prev, index]
		);
	};

	const getChapterProgress = (chapter) => {
		const completed = chapter.lessons.filter(l => l.isCompleted).length;
		const total = chapter.lessons.length;
		return Math.round((completed / total) * 100);
	};

	return (
		<div className="space-y-2">
			{chapters.map((chapter, chapterIndex) => {
				const isExpanded = expandedChapters.includes(chapterIndex);
				const progress = getChapterProgress(chapter);

				return (
					<div
						key={chapter._id}
						className="bg-white rounded-lg border border-gray-200 overflow-hidden"
					>
						<button
							onClick={() => toggleChapter(chapterIndex)}
							className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
						>
							<div className="flex-1 text-left">
								<div className="flex items-center gap-3 mb-1">
									<span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
										Chapter {chapter.order}
									</span>
									<h3 className="font-semibold text-gray-900 text-sm">
										{chapter.title}
									</h3>
								</div>
								<div className="flex items-center gap-4 text-xs text-gray-600 mt-2">
									<span className="flex items-center gap-1">
										<PlayCircle className="w-3 h-3" />
										{chapter.lessonCount} lessons
									</span>
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{chapter.duration}
									</span>
									<span className="text-blue-600 font-medium">
										{progress}% complete
									</span>
								</div>
							</div>
							<div className="ml-4">
								{isExpanded ? (
									<ChevronUp className="w-5 h-5 text-gray-500" />
								) : (
									<ChevronDown className="w-5 h-5 text-gray-500" />
								)}
							</div>
						</button>

						<div
							className={`overflow-hidden transition-all duration-300 ${
								isExpanded ? 'max-h-[2000px]' : 'max-h-0'
							}`}
						>
							<div className="border-t border-gray-200">
								{chapter.lessons.map((lesson, lessonIndex) => {
									const isActive = lesson._id === currentLessonId;
									const isCompleted = lesson.isCompleted;

									return (
										<button
											key={lesson._id}
											onClick={() => onLessonSelect(lesson._id, chapter._id)}
											className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
												isActive
													? 'bg-blue-50 border-l-4 border-blue-600'
													: 'hover:bg-gray-50 border-l-4 border-transparent'
											}`}
										>
											<div className="flex-shrink-0">
												{isCompleted ? (
													<CheckCircle className="w-5 h-5 text-green-600" />
												) : isActive ? (
													<PlayCircle className="w-5 h-5 text-blue-600" />
												) : (
													<Circle className="w-5 h-5 text-gray-400" />
												)}
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2 mb-1">
													<span className="text-xs text-gray-500">
														{chapterIndex + 1}.{lessonIndex + 1}
													</span>
													<h4
														className={`text-sm font-medium truncate ${
															isActive
																? 'text-blue-900'
																: isCompleted
																? 'text-gray-700'
																: 'text-gray-900'
														}`}
													>
														{lesson.title}
													</h4>
												</div>
												<div className="flex items-center gap-2">
													<Clock className="w-3 h-3 text-gray-400" />
													<span className="text-xs text-gray-600">
														{lesson.duration}
													</span>
												</div>
											</div>
										</button>
									);
								})}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ChapterList;
