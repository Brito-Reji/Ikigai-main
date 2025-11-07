import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Users,
  DollarSign,
  Star,
  BookOpen,
  Video,
  FileText,
  Plus,
  MoreVertical,
  Eye,
  EyeOff,
} from "lucide-react";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course] = useState({
    id: courseId,
    title: "Complete Web Development Bootcamp",
    description:
      "Master web development from scratch. Learn HTML, CSS, JavaScript, React, Node.js, and more in this comprehensive bootcamp.",
    price: "₹2,999",
    status: "Published",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    rating: 4.8,
    totalReviews: 342,
    totalStudents: 1254,
    totalRevenue: "₹37,54,746",
    chapters: [
      {
        id: 1,
        title: "Introduction to Web Development",
        lessons: 5,
        duration: "45 min",
        isPublished: true,
      },
      {
        id: 2,
        title: "HTML Fundamentals",
        lessons: 8,
        duration: "1h 20min",
        isPublished: true,
      },
      {
        id: 3,
        title: "CSS Styling",
        lessons: 10,
        duration: "1h 45min",
        isPublished: true,
      },
      {
        id: 4,
        title: "JavaScript Basics",
        lessons: 12,
        duration: "2h 10min",
        isPublished: false,
      },
    ],
    recentStudents: [
      { id: 1, name: "John Doe", avatar: "https://i.pravatar.cc/150?img=1", enrolledDate: "2 days ago" },
      { id: 2, name: "Jane Smith", avatar: "https://i.pravatar.cc/150?img=2", enrolledDate: "3 days ago" },
      { id: 3, name: "Mike Johnson", avatar: "https://i.pravatar.cc/150?img=3", enrolledDate: "5 days ago" },
    ],
  });

  const handleBack = () => {
    navigate("/instructor/courses");
  };

  const handleEditCourse = () => {
    navigate(`/instructor/courses/${courseId}/edit`);
  };

  const handleAddChapter = () => {
    console.log("Add chapter");
  };

  return (
    <div className="flex-1 bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    course.status === "Published"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {course.status}
                </span>
              </div>
              <p className="text-gray-600">{course.description}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={handleEditCourse}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{course.totalStudents}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">{course.totalRevenue}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{course.rating}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{course.totalReviews}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
                  <button
                    onClick={handleAddChapter}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Chapter
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {course.chapters.map((chapter, index) => (
                  <div key={chapter.id} className="p-6 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full font-semibold text-sm mr-4">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {chapter.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Video className="w-4 h-4 mr-1" />
                              {chapter.lessons} lessons
                            </span>
                            <span>{chapter.duration}</span>
                            <span
                              className={`flex items-center ${
                                chapter.isPublished ? "text-green-600" : "text-gray-400"
                              }`}
                            >
                              {chapter.isPublished ? (
                                <>
                                  <Eye className="w-4 h-4 mr-1" />
                                  Published
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-4 h-4 mr-1" />
                                  Draft
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Thumbnail */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium">
                  Change Thumbnail
                </button>
              </div>
            </div>

            {/* Recent Students */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Students</h3>
              <div className="space-y-3">
                {course.recentStudents.map((student) => (
                  <div key={student.id} className="flex items-center">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.enrolledDate}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View All Students
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  View Analytics
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  Manage Students
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition">
                  View Reviews
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                  Delete Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
