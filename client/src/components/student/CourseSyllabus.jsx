import React, { useState } from "react";
import { ChevronDown, ChevronRight, Play, FileText, Clock } from "lucide-react";

const CourseSyllabus = ({ course }) => {
  const [expandedSections, setExpandedSections] = useState({});

  // Mock syllabus data - in real app, this would come from the course data
  const syllabus = [
    {
      id: 1,
      title: "Introduction to UX Design",
      duration: "2 hours",
      lessons: [
        { id: 1, title: "What is User Experience Design?", duration: "15 min", type: "video", free: true },
        { id: 2, title: "UX vs UI Design", duration: "12 min", type: "video", free: true },
        { id: 3, title: "Design Thinking Process", duration: "20 min", type: "video", free: false },
        { id: 4, title: "Course Resources", duration: "5 min", type: "resource", free: false }
      ]
    },
    {
      id: 2,
      title: "User Research Fundamentals",
      duration: "3 hours",
      lessons: [
        { id: 5, title: "Understanding Your Users", duration: "25 min", type: "video", free: false },
        { id: 6, title: "User Interviews", duration: "30 min", type: "video", free: false },
        { id: 7, title: "Creating User Personas", duration: "20 min", type: "video", free: false },
        { id: 8, title: "User Journey Mapping", duration: "35 min", type: "video", free: false }
      ]
    },
    {
      id: 3,
      title: "Wireframing and Prototyping",
      duration: "4 hours",
      lessons: [
        { id: 9, title: "Low-Fidelity Wireframes", duration: "30 min", type: "video", free: false },
        { id: 10, title: "High-Fidelity Prototypes", duration: "45 min", type: "video", free: false },
        { id: 11, title: "Interactive Prototyping", duration: "40 min", type: "video", free: false },
        { id: 12, title: "Prototyping Tools", duration: "25 min", type: "video", free: false }
      ]
    },
    {
      id: 4,
      title: "Visual Design Principles",
      duration: "3.5 hours",
      lessons: [
        { id: 13, title: "Color Theory", duration: "30 min", type: "video", free: false },
        { id: 14, title: "Typography in UX", duration: "25 min", type: "video", free: false },
        { id: 15, title: "Layout and Composition", duration: "35 min", type: "video", free: false },
        { id: 16, title: "Design Systems", duration: "40 min", type: "video", free: false }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getTotalLessons = () => {
    return syllabus.reduce((total, section) => total + section.lessons.length, 0);
  };

  const getTotalDuration = () => {
    // Calculate total duration from all sections
    return "24 hours"; // Mock data
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
        <div className="flex items-center text-gray-600 space-x-6">
          <span>{syllabus.length} sections</span>
          <span>{getTotalLessons()} lectures</span>
          <span>{getTotalDuration()} total length</span>
        </div>
      </div>

      <div className="space-y-2">
        {syllabus.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500 mr-3" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500 mr-3" />
                )}
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600">
                    {section.lessons.length} lectures • {section.duration}
                  </p>
                </div>
              </div>
            </button>

            {expandedSections[section.id] && (
              <div className="border-t border-gray-200">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="text-gray-500 mr-3">
                        {getIcon(lesson.type)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lesson.title}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{lesson.duration}</span>
                          {lesson.free && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              Free
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {lesson.free && (
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        Preview
                      </button>
                    )}
                  </div>
                ))}
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