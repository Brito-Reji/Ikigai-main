export const mockEnrolledCourses = [
	{
		progress: { 
			completedLessons: ['lesson1_1', 'lesson1_2'], 
			completionPercentage: 45,
			lastAccessedLesson: 'lesson1_3',
			lastAccessedAt: '2024-12-27T10:30:00Z'
		},
		_id: '69504587a133911340f6c347',
		user: '6937b0d342ef919cbacb281c',
		course: {
			_id: '694a56a73114c9748230822f',
			category: '691ec6c213f4cb105f3113bd',
			title: 'Complete Web Development Bootcamp 2024',
			instructor: {
				_id: 'inst1',
				firstName: 'Sarah',
				lastName: 'Johnson'
			},
			price: 10,
			thumbnail: 'https://res.cloudinary.com/dyqdlodep/image/upload/v1766479518/ikigai/course-thumbnails/mxylhzq0lumxkjcd81kw.jpg'
		},
		payment: '6950456fa133911340f6c33d',
		status: 'active',
		certificateIssued: false,
		enrolledAt: '2024-12-01T08:00:00Z',
		createdAt: '2024-12-01T08:00:00Z',
		updatedAt: '2024-12-27T10:30:00Z',
		__v: 0
	},
	{
		progress: { 
			completedLessons: ['lesson3_1'], 
			completionPercentage: 78,
			lastAccessedLesson: 'lesson3_2',
			lastAccessedAt: '2024-12-28T14:20:00Z'
		},
		_id: '69504587a133911340f6c348',
		user: '6937b0d342ef919cbacb281c',
		course: {
			_id: '694a56a73114c9748230822e',
			category: '691ec6c213f4cb105f3113bc',
			title: 'Advanced React Patterns & Best Practices',
			instructor: {
				_id: 'inst2',
				firstName: 'Michael',
				lastName: 'Chen'
			},
			price: 15,
			thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80'
		},
		payment: '6950456fa133911340f6c33e',
		status: 'active',
		certificateIssued: false,
		enrolledAt: '2024-11-15T09:30:00Z',
		createdAt: '2024-11-15T09:30:00Z',
		updatedAt: '2024-12-28T14:20:00Z',
		__v: 0
	},
	{
		progress: { 
			completedLessons: ['lesson4_1'], 
			completionPercentage: 12,
			lastAccessedLesson: 'lesson4_1',
			lastAccessedAt: '2024-12-25T16:45:00Z'
		},
		_id: '69504587a133911340f6c349',
		user: '6937b0d342ef919cbacb281c',
		course: {
			_id: '694a56a73114c9748230822d',
			category: '691ec6c213f4cb105f3113bb',
			title: 'Node.js & Express - Backend Development',
			instructor: {
				_id: 'inst3',
				firstName: 'James',
				lastName: 'Wilson'
			},
			price: 12,
			thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80'
		},
		payment: '6950456fa133911340f6c33f',
		status: 'active',
		certificateIssued: false,
		enrolledAt: '2024-12-20T11:00:00Z',
		createdAt: '2024-12-20T11:00:00Z',
		updatedAt: '2024-12-25T16:45:00Z',
		__v: 0
	}
];

export const getEnrolledCourseById = (courseId) => {
	return mockEnrolledCourses.find(enrollment => enrollment.course._id === courseId);
};

// Get lesson by ID from enrolled course
export const getLessonById = (courseId, lessonId) => {
	const enrollment = getEnrolledCourseById(courseId);
	if (!enrollment || !enrollment.course.chapters) return null;
	
	for (const chapter of enrollment.course.chapters) {
		const lesson = chapter.lessons?.find(l => l._id === lessonId);
		if (lesson) {
			return { lesson, chapter };
		}
	}
	return null;
};
