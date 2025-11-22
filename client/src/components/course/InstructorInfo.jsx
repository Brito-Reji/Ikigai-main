import React from 'react';
import { Star, Users, Award, PlayCircle } from 'lucide-react';

const InstructorInfo = ({ instructor }) => {
  if (!instructor) return null;

  // Combine firstName and lastName
  const fullName = `${instructor.firstName || ''} ${instructor.lastName || ''}`.trim() || "Instructor";
  
  // Use real instructor data with fallbacks
  const instructorData = {
    name: fullName,
    title: instructor.headline || "Course Instructor",
    avatar: instructor.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    email: instructor.email,
    rating: 4.8, // TODO: Calculate from reviews
    students: 12547, // TODO: Get from enrollments
    courses: 8, // TODO: Get from instructor's courses count
    reviews: 3421, // TODO: Get from reviews count
    bio: instructor.description || "An experienced instructor passionate about teaching and helping students achieve their goals.",
    social: instructor.social || {},
    experience: [
      "Senior UX Designer at Google (2018-2023)",
      "Lead Product Designer at Spotify (2015-2018)",
      "UX Designer at Apple (2012-2015)"
    ],
    achievements: [
      "Google Design Excellence Award 2022",
      "UX Mastery Instructor of the Year 2021",
      "Featured in Design Weekly Top 50 Designers"
    ]
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Instructor</h2>
      
      {/* Instructor Header */}
      <div className="flex items-start space-x-6 mb-6">
        <img
          src={instructorData.avatar}
          alt={instructorData.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{instructorData.name}</h3>
          <p className="text-gray-600 mb-3">{instructorData.title}</p>
          
          {/* Instructor Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 mr-2" />
              <div>
                <p className="font-semibold text-gray-900">{instructorData.rating}</p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="font-semibold text-gray-900">{instructorData.students.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Students</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <PlayCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="font-semibold text-gray-900">{instructorData.courses}</p>
                <p className="text-xs text-gray-600">Courses</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <Award className="w-5 h-5 text-purple-600 mr-2" />
              <div>
                <p className="font-semibold text-gray-900">{instructorData.reviews.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bio */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Biography</h4>
        <p className="text-gray-700 leading-relaxed">{instructorData.bio}</p>
      </div>
      
      {/* Experience */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Experience</h4>
        <ul className="space-y-2">
          {instructorData.experience.map((exp, index) => (
            <li key={index} className="flex items-start">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <span className="text-gray-700">{exp}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Achievements */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Achievements</h4>
        <ul className="space-y-2">
          {instructorData.achievements.map((achievement, index) => (
            <li key={index} className="flex items-start">
              <Award className="w-4 h-4 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{achievement}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {/* CTA */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-gray-900">Want to learn more?</p>
            <p className="text-sm text-gray-600">Check out all courses by {instructorData.name}</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructorInfo;