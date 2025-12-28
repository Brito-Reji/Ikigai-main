export const mockEnrolledCourses = [
	{
		_id: "course1",
		title: "Complete Web Development Bootcamp 2024",
		description: "Master web development from scratch with HTML, CSS, JavaScript, React, Node.js and more",
		thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
		instructor: {
			_id: "inst1",
			name: "Sarah Johnson",
			avatar: "https://i.pravatar.cc/150?img=5",
			bio: "Senior Full Stack Developer with 10+ years of experience"
		},
		progress: 45,
		lastAccessed: "2024-12-27T10:30:00Z",
		totalLessons: 156,
		completedLessons: 70,
		totalDuration: "24 hours",
		category: "Web Development",
		enrolledAt: "2024-12-01T08:00:00Z",
		currentLesson: "lesson1_3",
		chapters: [
			{
				_id: "chapter1_1",
				title: "Getting Started with Web Development",
				description: "Introduction to web development fundamentals",
				order: 1,
				duration: "2 hours",
				lessonCount: 8,
				lessons: [
					{
						_id: "lesson1_1",
						title: "Welcome to the Course",
						description: "Course overview and what you'll learn",
						duration: "5:30",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
						order: 1,
						isCompleted: true,
						resources: [
							{ name: "Course Syllabus.pdf", url: "#", type: "pdf" },
							{ name: "Setup Guide.pdf", url: "#", type: "pdf" }
						]
					},
					{
						_id: "lesson1_2",
						title: "Setting Up Your Development Environment",
						description: "Install VS Code, Node.js, and other essential tools",
						duration: "15:45",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
						order: 2,
						isCompleted: true,
						resources: [
							{ name: "Installation Checklist.pdf", url: "#", type: "pdf" }
						]
					},
					{
						_id: "lesson1_3",
						title: "HTML Basics - Structure and Semantics",
						description: "Learn HTML tags, elements, and semantic markup",
						duration: "22:15",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
						order: 3,
						isCompleted: false,
						resources: [
							{ name: "HTML Cheat Sheet.pdf", url: "#", type: "pdf" },
							{ name: "Starter Code.zip", url: "#", type: "zip" }
						]
					}
				]
			},
			{
				_id: "chapter1_2",
				title: "CSS Fundamentals",
				description: "Master CSS for styling beautiful websites",
				order: 2,
				duration: "4 hours",
				lessonCount: 12,
				lessons: [
					{
						_id: "lesson2_1",
						title: "CSS Selectors and Properties",
						description: "Understanding CSS syntax and selectors",
						duration: "18:30",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
						order: 1,
						isCompleted: false,
						resources: []
					}
				]
			}
		]
	},
	{
		_id: "course2",
		title: "Advanced React Patterns & Best Practices",
		description: "Take your React skills to the next level with advanced patterns, hooks, and performance optimization",
		thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
		instructor: {
			_id: "inst2",
			name: "Michael Chen",
			avatar: "https://i.pravatar.cc/150?img=12",
			bio: "React Core Team Member & Tech Lead at Meta"
		},
		progress: 78,
		lastAccessed: "2024-12-28T14:20:00Z",
		totalLessons: 89,
		completedLessons: 69,
		totalDuration: "16 hours",
		category: "React",
		enrolledAt: "2024-11-15T09:30:00Z",
		currentLesson: "lesson3_2",
		chapters: [
			{
				_id: "chapter2_1",
				title: "Advanced Hooks",
				description: "Deep dive into React hooks and custom hooks",
				order: 1,
				duration: "3 hours",
				lessonCount: 15,
				lessons: [
					{
						_id: "lesson3_1",
						title: "useCallback and useMemo",
						description: "Performance optimization with memoization",
						duration: "25:40",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
						order: 1,
						isCompleted: true,
						resources: [
							{ name: "Code Examples.zip", url: "#", type: "zip" }
						]
					},
					{
						_id: "lesson3_2",
						title: "Building Custom Hooks",
						description: "Create reusable custom hooks for your applications",
						duration: "32:15",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
						order: 2,
						isCompleted: false,
						resources: [
							{ name: "Custom Hooks Library.zip", url: "#", type: "zip" }
						]
					}
				]
			}
		]
	},
	{
		_id: "course3",
		title: "Node.js & Express - Backend Development",
		description: "Build scalable backend applications with Node.js, Express, MongoDB and REST APIs",
		thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
		instructor: {
			_id: "inst3",
			name: "James Wilson",
			avatar: "https://i.pravatar.cc/150?img=8",
			bio: "Backend Architect & Author of 'Node.js Mastery'"
		},
		progress: 12,
		lastAccessed: "2024-12-25T16:45:00Z",
		totalLessons: 124,
		completedLessons: 15,
		totalDuration: "20 hours",
		category: "Backend Development",
		enrolledAt: "2024-12-20T11:00:00Z",
		currentLesson: "lesson4_1",
		chapters: [
			{
				_id: "chapter3_1",
				title: "Node.js Fundamentals",
				description: "Understanding Node.js runtime and core modules",
				order: 1,
				duration: "2.5 hours",
				lessonCount: 10,
				lessons: [
					{
						_id: "lesson4_1",
						title: "Introduction to Node.js",
						description: "What is Node.js and why use it?",
						duration: "12:20",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
						order: 1,
						isCompleted: true,
						resources: [
							{ name: "Node.js Overview.pdf", url: "#", type: "pdf" }
						]
					},
					{
						_id: "lesson4_2",
						title: "Working with Modules",
						description: "CommonJS and ES6 modules in Node.js",
						duration: "18:55",
						videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
						order: 2,
						isCompleted: false,
						resources: []
					}
				]
			}
		]
	}
];

export const getEnrolledCourseById = (courseId) => {
	return mockEnrolledCourses.find(course => course._id === courseId);
};

export const getLessonById = (courseId, lessonId) => {
	const course = getEnrolledCourseById(courseId);
	if (!course) return null;
	
	for (const chapter of course.chapters) {
		const lesson = chapter.lessons.find(l => l._id === lessonId);
		if (lesson) {
			return { lesson, chapter };
		}
	}
	return null;
};
