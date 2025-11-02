import React, { useState } from 'react';

const Instructors = () => {
  const [instructors, setInstructors] = useState([
    {
      id: 1,
      fullName: 'Dr. Amit Kumar',
      email: 'amit.kumar@ikigai.com',
      specialization: 'Web Development',
      joinDate: '10 Jan 2024',
      coursesCreated: 12,
      totalStudents: 450,
      rating: 4.8,
      isBlocked: false,
    },
    {
      id: 2,
      fullName: 'Prof. Neha Sharma',
      email: 'neha.sharma@ikigai.com',
      specialization: 'Data Science',
      joinDate: '15 Feb 2024',
      coursesCreated: 8,
      totalStudents: 320,
      rating: 4.9,
      isBlocked: false,
    },
    {
      id: 3,
      fullName: 'Ravi Patel',
      email: 'ravi.patel@ikigai.com',
      specialization: 'Mobile Development',
      joinDate: '20 Mar 2024',
      coursesCreated: 6,
      totalStudents: 280,
      rating: 4.5,
      isBlocked: true,
    },
    {
      id: 4,
      fullName: 'Priya Gupta',
      email: 'priya.gupta@ikigai.com',
      specialization: 'UI/UX Design',
      joinDate: '05 Apr 2024',
      coursesCreated: 10,
      totalStudents: 380,
      rating: 4.7,
      isBlocked: false,
    },
    {
      id: 5,
      fullName: 'Vikram Singh',
      email: 'vikram.singh@ikigai.com',
      specialization: 'Machine Learning',
      joinDate: '12 May 2024',
      coursesCreated: 15,
      totalStudents: 520,
      rating: 4.9,
      isBlocked: false,
    },
    {
      id: 6,
      fullName: 'Ananya Reddy',
      email: 'ananya.reddy@ikigai.com',
      specialization: 'Digital Marketing',
      joinDate: '18 Jun 2024',
      coursesCreated: 7,
      totalStudents: 290,
      rating: 4.6,
      isBlocked: false,
    },
    {
      id: 7,
      fullName: 'Rahul Verma',
      email: 'rahul.verma@ikigai.com',
      specialization: 'Cloud Computing',
      joinDate: '22 Jul 2024',
      coursesCreated: 9,
      totalStudents: 340,
      rating: 4.4,
      isBlocked: true,
    },
    {
      id: 8,
      fullName: 'Kavya Nair',
      email: 'kavya.nair@ikigai.com',
      specialization: 'Cybersecurity',
      joinDate: '28 Aug 2024',
      coursesCreated: 5,
      totalStudents: 220,
      rating: 4.8,
      isBlocked: false,
    },
    {
      id: 9,
      fullName: 'Arjun Malhotra',
      email: 'arjun.malhotra@ikigai.com',
      specialization: 'Blockchain',
      joinDate: '05 Sep 2024',
      coursesCreated: 4,
      totalStudents: 180,
      rating: 4.7,
      isBlocked: false,
    },
    {
      id: 10,
      fullName: 'Ishita Joshi',
      email: 'ishita.joshi@ikigai.com',
      specialization: 'Game Development',
      joinDate: '10 Oct 2024',
      coursesCreated: 11,
      totalStudents: 410,
      rating: 4.9,
      isBlocked: false,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleBlockToggle = (instructorId) => {
    setInstructors(instructors.map(instructor => 
      instructor.id === instructorId 
        ? { ...instructor, isBlocked: !instructor.isBlocked }
        : instructor
    ));
  };

  const handleViewDetails = (instructorId) => {
    console.log('View instructor details:', instructorId);
    // Add navigation to instructor detail page or open modal
  };

  const handleViewCourses = (instructorId) => {
    console.log('View courses by instructor:', instructorId);
    // Navigate to courses page filtered by this instructor
  };

  // Filter instructors based on search
  const filteredInstructors = instructors.filter(instructor =>
    instructor.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    instructor.id.toString().includes(searchQuery)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const indexOfLastInstructor = currentPage * itemsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - itemsPerPage;
  const currentInstructors = filteredInstructors.slice(indexOfFirstInstructor, indexOfLastInstructor);

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

  // Calculate total revenue (example: ₹500 per student)
  const totalRevenue = instructors.reduce((sum, instructor) => 
    sum + (instructor.totalStudents * 500), 0
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Instructors Management</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-purple-800">{instructors.length}</div>
          <div className="text-purple-600 mt-2">Total Instructors</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-green-800">
            {instructors.filter(i => !i.isBlocked).length}
          </div>
          <div className="text-green-600 mt-2">Active Instructors</div>
        </div>
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-blue-800">
            {instructors.reduce((sum, i) => sum + i.coursesCreated, 0)}
          </div>
          <div className="text-blue-600 mt-2">Total Courses</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-yellow-800">₹{(totalRevenue / 1000).toFixed(0)}K</div>
          <div className="text-yellow-600 mt-2">Revenue Generated</div>
        </div>
      </div>

      {/* Search Bar and Items Per Page */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, specialization, or ID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
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

      {/* Instructors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All Instructors</h2>
          <p className="text-sm text-gray-600">
            Showing {indexOfFirstInstructor + 1} to {Math.min(indexOfLastInstructor, filteredInstructors.length)} of {filteredInstructors.length} instructors
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
                  Specialization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
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
              {currentInstructors.length > 0 ? (
                currentInstructors.map((instructor) => (
                  <tr key={instructor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{instructor.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instructor.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {instructor.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {instructor.specialization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <button
                        onClick={() => handleViewCourses(instructor.id)}
                        className="text-teal-600 hover:text-teal-800 font-medium"
                      >
                        {instructor.coursesCreated}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {instructor.totalStudents}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                        <span className="font-medium">{instructor.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          instructor.isBlocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {instructor.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(instructor.id)}
                          className="px-4 py-1.5 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBlockToggle(instructor.id)}
                          className={`px-4 py-1.5 rounded transition-colors ${
                            instructor.isBlocked
                              ? 'bg-green-500 text-white hover:bg-green-600'
                              : 'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {instructor.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                    No instructors found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {filteredInstructors.length > 0 && (
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

export default Instructors;
