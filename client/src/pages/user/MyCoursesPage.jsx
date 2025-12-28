import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, Clock, Search, GraduationCap } from 'lucide-react';
import EnrolledCourseCard from '@/components/student/EnrolledCourseCard';
import Footer from '@/components/layout/Footer';
import { mockEnrolledCourses } from '@/data/mockEnrolledCourses';

const MyCoursesPage = () => {
	const [filter, setFilter] = useState('all');
	const [searchQuery, setSearchQuery] = useState('');

	const courses = mockEnrolledCourses;

	const filteredCourses = courses.filter((course) => {
		const matchesSearch = course.title
			.toLowerCase()
			.includes(searchQuery.toLowerCase());

		if (filter === 'in-progress') {
			return matchesSearch && course.progress > 0 && course.progress < 100;
		} else if (filter === 'completed') {
			return matchesSearch && course.progress === 100;
		}
		return matchesSearch;
	});

	const totalCourses = courses.length;
	const completedCourses = courses.filter((c) => c.progress === 100).length;
	const inProgressCourses = courses.filter(
		(c) => c.progress > 0 && c.progress < 100
	).length;
	const avgProgress = Math.round(
		courses.reduce((sum, c) => sum + c.progress, 0) / courses.length
	);

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
			<div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="flex items-center gap-3 mb-4">
						<GraduationCap className="w-10 h-10" />
						<h1 className="text-4xl font-bold">My Courses</h1>
					</div>
					<p className="text-blue-100 text-lg mb-8">
						Continue your learning journey and track your progress
					</p>

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<div className="flex items-center gap-3 mb-2">
								<BookOpen className="w-6 h-6 text-blue-200" />
								<span className="text-blue-100 text-sm">Total Courses</span>
							</div>
							<div className="text-3xl font-bold">{totalCourses}</div>
						</div>

						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<div className="flex items-center gap-3 mb-2">
								<TrendingUp className="w-6 h-6 text-green-200" />
								<span className="text-blue-100 text-sm">In Progress</span>
							</div>
							<div className="text-3xl font-bold">{inProgressCourses}</div>
						</div>

						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<div className="flex items-center gap-3 mb-2">
								<GraduationCap className="w-6 h-6 text-purple-200" />
								<span className="text-blue-100 text-sm">Completed</span>
							</div>
							<div className="text-3xl font-bold">{completedCourses}</div>
						</div>

						<div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
							<div className="flex items-center gap-3 mb-2">
								<Clock className="w-6 h-6 text-yellow-200" />
								<span className="text-blue-100 text-sm">Avg Progress</span>
							</div>
							<div className="text-3xl font-bold">{avgProgress}%</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex flex-col sm:flex-row gap-4 mb-8">
					<div className="flex-1 relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input
							type="text"
							placeholder="Search courses..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
						/>
					</div>

					<div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-200">
						<button
							onClick={() => setFilter('all')}
							className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
								filter === 'all'
									? 'bg-blue-600 text-white'
									: 'text-gray-600 hover:bg-gray-100'
							}`}
						>
							All
						</button>
						<button
							onClick={() => setFilter('in-progress')}
							className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
								filter === 'in-progress'
									? 'bg-blue-600 text-white'
									: 'text-gray-600 hover:bg-gray-100'
							}`}
						>
							In Progress
						</button>
						<button
							onClick={() => setFilter('completed')}
							className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${
								filter === 'completed'
									? 'bg-blue-600 text-white'
									: 'text-gray-600 hover:bg-gray-100'
							}`}
						>
							Completed
						</button>
					</div>
				</div>

				{filteredCourses.length > 0 ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredCourses.map((course) => (
							<EnrolledCourseCard key={course._id} course={course} />
						))}
					</div>
				) : (
					<div className="text-center py-16">
						<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<BookOpen className="w-12 h-12 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-900 mb-2">
							{searchQuery
								? 'No courses found'
								: filter === 'completed'
								? 'No completed courses yet'
								: filter === 'in-progress'
								? 'No courses in progress'
								: 'No enrolled courses'}
						</h3>
						<p className="text-gray-600 mb-6">
							{searchQuery
								? 'Try adjusting your search'
								: 'Start learning by enrolling in a course'}
						</p>
						<Link
							to="/courses"
							className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<BookOpen className="w-5 h-5" />
							Browse Courses
						</Link>
					</div>
				)}
			</div>

			<Footer />
		</div>
	);
};

export default MyCoursesPage;
