import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Eye } from 'lucide-react';
import api from '@/api/axiosConfig.js';

const CategoryDetail = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategoryDetails();
    fetchCategoryCourses();
  }, [categoryId]);

  const fetchCategoryDetails = async () => {
    try {
      const response = await api.get(`/public`);
      if (response.data.success) {
        const cat = response.data.categories.find(c => c._id === categoryId);
        setCategory(cat);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setError('Failed to fetch category details');
    }
  };

  const fetchCategoryCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/courses?category=${categoryId}&limit=100`);
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !category) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/admin/categories')}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/categories')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Categories
        </button>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{category?.name}</h1>
          <p className="text-gray-600">{category?.description}</p>
          <div className="mt-4 flex items-center text-sm text-gray-500">
            <BookOpen className="w-4 h-4 mr-2" />
            {courses.length} {courses.length === 1 ? 'course' : 'courses'} in this category
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80'}
                  alt={course.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  {course.blocked ? (
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Blocked
                    </span>
                  ) : course.published ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Published
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                      Draft
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  by {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-teal-600">₹{course.price}</span>
                  {course.actualPrice > course.price && (
                    <span className="text-sm text-gray-500 line-through">₹{course.actualPrice}</span>
                  )}
                </div>
                <Link
                  to={`/admin/courses/${course._id}`}
                  className="w-full px-4 py-2 bg-teal-600 text-white text-sm rounded hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses in this category</h3>
          <p className="text-gray-500">Courses will appear here once instructors create them</p>
        </div>
      )}
    </div>
  );
};

export default CategoryDetail;
