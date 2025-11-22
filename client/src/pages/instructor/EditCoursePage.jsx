import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useCourse } from '@/hooks/useRedux.js';
import { fetchCourseById, updateCourse } from '@/store/slices/courseSlice.js';
import ChapterManager from '@/components/instructor/ChapterManager.jsx';

const EditCoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { currentCourse, courseLoading, updateLoading, dispatch } = useCourse();
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [courseId, dispatch]);

  if (courseLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Course Details' },
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'settings', label: 'Settings' }
  ];

  return (
    <div className="flex-1 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/instructor/courses')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentCourse.title}</h1>
              <p className="text-gray-600 mt-2">Edit your course content and settings</p>
            </div>
            <button
              disabled={updateLoading}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {updateLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Details</h2>
                <p className="text-gray-600">Course details editing coming soon...</p>
              </div>
            )}

            {activeTab === 'curriculum' && (
              <ChapterManager courseId={courseId} />
            )}

            {activeTab === 'pricing' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pricing</h2>
                <p className="text-gray-600">Pricing settings coming soon...</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Course Settings</h2>
                <p className="text-gray-600">Course settings coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoursePage;
