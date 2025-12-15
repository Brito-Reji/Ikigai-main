import React, { useState } from "react";
import { ChevronDown, ChevronRight, Play, FileText, Clock } from "lucide-react";

const CourseSyllabus = ({ course, chapters = [], isLoading = false }) => {
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getTotalLessons = () => {
    return chapters.reduce((total, chapter) => total + (chapter.lessons?.length || 0), 0);
  };

  const getTotalDuration = () => {
    let totalMinutes = 0;
    chapters.forEach(chapter => {
      chapter.lessons?.forEach(lesson => {
        if (lesson.duration) {
          totalMinutes += lesson.duration;
        }
      });
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "resource":
        return <FileText className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "0 min";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const getChapterDuration = (lessons) => {
    const totalMinutes = lessons?.reduce((sum, lesson) => sum + (lesson.duration || 0), 0) || 0;
    return formatDuration(totalMinutes);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!chapters || chapters.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
        <p className="text-gray-600">No chapters available yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
        <div className="flex items-center text-gray-600 space-x-6">
          <span>{chapters.length} sections</span>
          <span>{getTotalLessons()} lectures</span>
          <span>{getTotalDuration()} total length</span>
        </div>
      </div>

      <div className="space-y-2">
        {chapters.map((chapter) => (
          <div key={chapter._id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection(chapter._id)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                {expandedSections[chapter._id] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500 mr-3" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500 mr-3" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{chapter.title}</h3>
                  <p className="text-sm text-gray-600">
                    {chapter.lessons?.length || 0} lectures • {getChapterDuration(chapter.lessons)}
                  </p>
                </div>
              </div>
            </button>

            {expandedSections[chapter._id] && (
              <div className="border-t border-gray-200">
                {chapter.lessons && chapter.lessons.length > 0 ? (
                  chapter.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-3">
                          {getIcon(lesson.resources?.length > 0 ? "resource" : "video")}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{lesson.title}</p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{formatDuration(lesson.duration)}</span>
                            {lesson.isFree && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Free
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {lesson.isFree && (
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                          Preview
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No lessons in this chapter yet.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">What you'll learn</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">Master the fundamentals of UX design</span>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">Create user personas and journey maps</span>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">Build wireframes and prototypes</span>
          </div>
          <div className="flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">Apply visual design principles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSyllabus;