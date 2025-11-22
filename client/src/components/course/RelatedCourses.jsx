import React from 'react';
import CourseCard from '../CourseCard.jsx';

const RelatedCourses = ({ currentCourse, category }) => {
  // Mock related courses data - in real app, this would come from API
  const relatedCourses = [
    {
      id: 1,
      title: "Advanced UX Research Methods",
      instructor: "Sarah Wilson",
      rating: 4.6,
      hours: 18,
      price: "₹1,999",
      thumbnail: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&q=80",
      category: "UX Design"
    },
    {
      id: 2,
      title: "UI Design Masterclass",
      instructor: "Mike Johnson",
      rating: 4.8,
      hours: 22,
      price: "₹2,499",
      thumbnail: "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=400&q=80",
      category: "UI Design"
    },
    {
      id: 3,
      title: "Design Systems from Scratch",
      instructor: "Emily Chen",
      rating: 4.7,
      hours: 16,
      price: "₹1,799",
      thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400&q=80",
      category: "Design Systems"
    },
    {
      id: 4,
      title: "Mobile App Design Fundamentals",
      instructor: "David Park",
      rating: 4.5,
      hours: 20,
      price: "₹2,199",
      thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80",
      category: "Mobile Design"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">More Courses Like This</h2>
        <button className="text-blue-600 hover:text-blue-700 font-medium">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      {/* Category Suggestion */}
      {category && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Explore More in {category}
          </h3>
          <p className="text-gray-600 mb-3">
            Discover other courses in the {category} category to expand your skills.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse {category} Courses
          </button>
        </div>
      )}
    </div>
  );
};

export default RelatedCourses;