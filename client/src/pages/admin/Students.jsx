import React, { useState } from 'react';

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      fullName: 'Rajesh Kumar',
      email: 'rajesh.kumar@example.com',
      enrollmentDate: '15 Jan 2025',
      coursesEnrolled: 3,
      isBlocked: false,
    },
    {
      id: 2,
      fullName: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      enrollmentDate: '20 Jan 2025',
      coursesEnrolled: 5,
      isBlocked: false,
    },
    {
      id: 3,
      fullName: 'Amit Patel',
      email: 'amit.patel@example.com',
      enrollmentDate: '12 Feb 2025',
      coursesEnrolled: 2,
      isBlocked: true,
    },
    {
      id: 4,
      fullName: 'Sneha Gupta',
      email: 'sneha.gupta@example.com',
      enrollmentDate: '05 Mar 2025',
      coursesEnrolled: 4,
      isBlocked: false,
    },
    {
      id: 5,
      fullName: 'Vikram Singh',
      email: 'vikram.singh@example.com',
      enrollmentDate: '18 Mar 2025',
      coursesEnrolled: 6,
      isBlocked: false,
    },
    {
      id: 6,
      fullName: 'Ananya Reddy',
      email: 'ananya.reddy@example.com',
      enrollmentDate: '22 Mar 2025',
      coursesEnrolled: 3,
      isBlocked: false,
    },
    {
      id: 7,
      fullName: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      enrollmentDate: '28 Mar 2025',
      coursesEnrolled: 7,
      isBlocked: true,
    },
    {
      id: 8,
      fullName: 'Kavya Nair',
      email: 'kavya.nair@example.com',
      enrollmentDate: '01 Apr 2025',
      coursesEnrolled: 2,
      isBlocked: false,
    },
    {
      id: 9,
      fullName: 'Arjun Malhotra',
      email: 'arjun.malhotra@example.com',
      enrollmentDate: '05 Apr 2025',
      coursesEnrolled: 4,
      isBlocked: false,
    },
    {
      id: 10,
      fullName: 'Ishita Joshi',
      email: 'ishita.joshi@example.com',
      enrollmentDate: '10 Apr 2025',
      coursesEnrolled: 5,
      isBlocked: false,
    },
    {
      id: 11,
      fullName: 'Siddharth Rao',
      email: 'siddharth.rao@example.com',
      enrollmentDate: '15 Apr 2025',
      coursesEnrolled: 3,
      isBlocked: false,
    },
    {
      id: 12,
      fullName: 'Meera Kapoor',
      email: 'meera.kapoor@example.com',
      enrollmentDate: '20 Apr 2025',
      coursesEnrolled: 6,
      isBlocked: true,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleBlockToggle = (studentId) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, isBlocked: !student.isBlocked }
        : student
    ));
  };

  const handleViewDetails = (studentId) => {
    console.log('View student details:', studentId);
    // Add navigation to student detail page or open modal
  };

  // Filter students based on search
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.id.toString().includes(searchQuery)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Students Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-blue-800">{students.length}</div>
          <div className="text-blue-600 mt-2">Total Students</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-green-800">
            {students.filter(s => !s.isBlocked).length}
          </div>
          <div className="text-green-600 mt-2">Active Students</div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-red-800">
            {students.filter(s => s.isBlocked).length}
          </div>
          <div className="text-red-600 mt-2">Blocked Students</div>
        </div>
      </div>

      {/* Search Bar and Items Per Page */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={15}>15 per page</option>
            <option value={20}>20 per page</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Students</h2>
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Full Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentStudents.length > 0 ? (
                currentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.enrollmentDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {student.coursesEnrolled}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          student.isBlocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {student.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(student.id)}
                          className="px-4 py-1.5 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBlockToggle(student.id)}
                          className={`px-4 py-1.5 rounded transition-colors ${
                            student.isBlocked
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {student.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No students found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredStudents.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, index) => (
                    pageNum === '...' ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-3 py-2 text-gray-500"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === pageNum
                            ? 'bg-teal-500 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
