import React from 'react';
import { Star, Clock, Users, Globe, Award } from 'lucide-react';

const CourseHero = ({ course }) => {
  if (!course) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {course.category?.name}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {course.title}
            </h1>
            
            <p className="text-xl text-blue-100 mb-6 leading-relaxed">
              {course.description}
            </p>
            
            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6">
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(course.rating || 4.5)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-yellow-400 font-semibold mr-2">
                  {course.rating || 4.5}
                </span>
                <span className="text-blue-200">
                  ({course.reviews || 234} reviews)
                </span>
              </div>
              
              <div className="flex items-center text-blue-200">
                <Users className="w-5 h-5 mr-2" />
                <span>{course.students || 1254} students</span>
              </div>
              
              <div className="flex items-center text-blue-200">
                <Clock className="w-5 h-5 mr-2" />
                <span>{course.duration || 24} hours</span>
              </div>
              
              <div className="flex items-center text-blue-200">
                <Globe className="w-5 h-5 mr-2" />
                <span>English</span>
              </div>
            </div>
            
            {/* Instructor */}
            <div className="flex items-center">
              <img 
                src={course.instructor?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80"} 
                alt={`${course.instructor?.firstName} ${course.instructor?.lastName}`}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <p className="text-blue-100">Created by</p>
                <p className="font-semibold text-lg">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
              </div>
            </div>
          </div>
          
          {/* Course Preview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="relative group cursor-pointer">
                <img
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80'}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&q=80';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 flex items-center justify-center transition-all">
                  <button className="bg-white bg-opacity-90 hover:bg-opacity-100 hover:scale-110 rounded-full p-5 transition-all shadow-lg">
                    <svg className="w-10 h-10 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                    </svg>
                  </button>
                </div>
                <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                  Preview
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-gray-900">₹{course.price}</span>
                  <span className="text-gray-500 line-through ml-2">₹{Math.round(course.price * 1.5)}</span>
                </div>
                
                <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mb-3">
                  Add to Cart
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Buy Now
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>30-Day Money-Back Guarantee</p>
                  <p>Full Lifetime Access</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;