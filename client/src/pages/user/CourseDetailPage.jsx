import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { usePublicCourse } from "@/hooks/useCourses.js";
import { useStudentChapters } from "@/hooks/useChapters.js";

// Components
import CourseHero from "@/components/student/CourseHero.jsx";
import CourseSyllabus from "@/components/student/CourseSyllabus.jsx";
import CourseReviews from "@/components/student/CourseReviews.jsx";
import InstructorInfo from "@/components/student/InstructorInfo.jsx";
import RelatedCourses from "@/components/student/RelatedCourses.jsx";
import Footer from "@/components/layout/Footer.jsx";

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const { data: courseData, isLoading: publicDetailsLoading, error: publicDetailsError } = usePublicCourse(courseId);
  console.log("course dataaa-->", courseData)
  const [activeTab, setActiveTab] = useState("overview");

  const publicCourseDetails = courseData?.data;
  const chapters = courseData?.data?.chapters || [];

  if (publicDetailsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (publicDetailsError || !publicCourseDetails) {
    const errorMessage = publicDetailsError?.response?.data?.message || publicDetailsError?.message || "The course you are looking for does not exist or is no longer available.";
    const isBlocked = errorMessage.includes("blocked by the administrator");
    const isNotPublished = errorMessage.includes("not yet published");

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-6">
              {isBlocked ? (
                <div className="w-24 h-24 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636 5.636 18.364" />
                  </svg>
                </div>
              ) : isNotPublished ? (
                <div className="w-24 h-24 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              ) : (
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 6.306a7.962 7.962 0 00-6 0m6 0V5a2 2 0 00-2-2H9a2 2 0 00-2 2v1.306m6 0V7a2 2 0 01-2 2H9a2 2 0 01-2-2V6.306" />
                  </svg>
                </div>
              )}
            </div>

            <h1 className={`text-2xl font-bold mb-4 ${isBlocked ? 'text-red-900' : isNotPublished ? 'text-yellow-900' : 'text-gray-900'}`}>
              {isBlocked ? 'Course Temporarily Unavailable' : isNotPublished ? 'Course Not Published' : 'Course Not Found'}
            </h1>

            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {errorMessage}
            </p>

            {isBlocked && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-sm text-red-800">
                  This course has been temporarily blocked for review. Please check back later or contact support if you have questions.
                </p>
              </div>
            )}

            <div className="space-x-4">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => window.location.href = '/courses'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "syllabus", label: "Syllabus" },
    { id: "instructor", label: "Instructor" },
    { id: "reviews", label: "Reviews" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Course Hero Section */}
      <CourseHero course={publicCourseDetails} />

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                  <p className="text-gray-700 leading-relaxed mb-6">{publicCourseDetails.overview}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 mb-2">24</div>
                      <div className="text-sm text-gray-600">Hours of Content</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">42</div>
                      <div className="text-sm text-gray-600">Lessons</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600 mb-2">8</div>
                      <div className="text-sm text-gray-600">Projects</div>
                    </div>
                  </div>
                </div>
                
                <CourseSyllabus course={publicCourseDetails} />
              </div>
            )}

            {activeTab === "syllabus" && <CourseSyllabus course={publicCourseDetails} chapters={chapters} isLoading={chaptersLoading} />}
            {activeTab === "instructor" && <InstructorInfo instructor={publicCourseDetails.instructor} />}
            {activeTab === "reviews" && <CourseReviews course={publicCourseDetails} />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">


              {/* Course Features */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">This Course Includes</h3>
                <ul className="space-y-3">
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    24 hours on-demand video
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    8 downloadable resources
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Full lifetime access
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Access on mobile and TV
                  </li>
                  <li className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Related Courses */}
        <div className="mt-12">
          <RelatedCourses currentCourse={publicCourseDetails} category={publicCourseDetails.category?.name} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetailPage;