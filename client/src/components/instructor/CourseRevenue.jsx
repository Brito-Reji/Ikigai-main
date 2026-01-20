import React from "react";
import { BookOpen } from "lucide-react";

export default function CourseRevenue({ courses, loading }) {
  const formatCurrency = (amount) => `₹${(amount || 0).toLocaleString("en-IN")}`;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded mb-4 animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Course</h3>
      
      {courses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No courses with revenue yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Course</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Sales</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Revenue</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Held</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Released</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.courseId} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {course.thumbnail ? (
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900 truncate max-w-[200px]">
                        {course.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-gray-600">{course.salesCount}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-gray-900">{formatCurrency(course.totalRevenue)}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-yellow-600">{formatCurrency(course.heldAmount)}</span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-green-600">{formatCurrency(course.releasedAmount)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
