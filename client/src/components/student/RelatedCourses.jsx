import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CourseCard from "./CourseCard.jsx";
import api from "@/api/axiosConfig.js";

const RelatedCourses = ({ currentCourse, category }) => {
  const [relatedCourses, setRelatedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedCourses = async () => {
      if (!currentCourse?.category?._id) return;

      try {
        setLoading(true);
        const response = await api.get(
          `/public/courses?category=${currentCourse.category._id}&limit=4`
        );

        if (response.data.success) {
          // Filter out the current course
          const filtered = response.data.data.filter(
            course => course._id !== currentCourse._id
          );
          setRelatedCourses(filtered.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching related courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedCourses();
  }, [currentCourse]);

  // Transform courses for CourseCard component
  const transformedCourses = relatedCourses.map(course => ({
    id: course._id,
    title: course.title,
    instructor: course.instructor,
    rating: course.rating || 0,
    hours: course.duration || 0,
    price: `₹${course.price}`,
    thumbnail: course.thumbnail,
    description: course.description,
    category: course.category?.name,
  }));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          More Courses Like This
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse rounded-lg h-64"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (transformedCourses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          More Courses Like This
        </h2>
        {category && (
          <Link
            to={`/courses?category=${currentCourse.category._id}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {transformedCourses.map(course => (
          <Link key={course.id} to={`/course/${course.id}`}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>

      {/* Category Suggestion */}
      {category && transformedCourses.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">
            Explore More in {category}
          </h3>
          <p className="text-gray-600 mb-3">
            Discover other courses in the {category} category to expand your
            skills.
          </p>
          <Link
            to={`/courses?category=${currentCourse.category._id}`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse {category} Courses
          </Link>
        </div>
      )}
    </div>
  );
};

export default RelatedCourses;
