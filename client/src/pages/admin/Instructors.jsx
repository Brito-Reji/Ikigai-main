import api from "@/api/axiosConfig";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Instructors = () => {
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/instructors");
        console.log(response.data.data);
        setInstructors(response.data.data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  const handleBlockToggle = async (instructorId) => {
    const instructor = instructors.find(i => i._id === instructorId);
    const action = instructor.isBlocked ? 'unblock' : 'block';
    
    const result = await Swal.fire({
      title: `${action === 'block' ? 'Block' : 'Unblock'} Instructor?`,
      html: `
        <p>Are you sure you want to ${action} <strong>${instructor.fullName || instructor.username}</strong>?</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 'block' ? '#dc2626' : '#16a34a',
      cancelButtonColor: '#6b7280',
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/admin/instructors/${instructorId}/toggle-block`);

        // Update local state
        setInstructors(
          instructors.map((i) =>
            i._id === instructorId
              ? { ...i, isBlocked: !i.isBlocked }
              : i
          )
        );
        
        Swal.fire({
          title: 'Success!',
          text: `Instructor has been ${action}ed successfully.`,
          icon: 'success',
          confirmButtonColor: '#3b82f6',
          timer: 2000
        });
      } catch (error) {
        console.error("Error toggling block status:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update instructor status.',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const handleViewDetails = (instructorId) => {
    navigate(`/admin/instructors/${instructorId}`);
  };

  // Filter instructors based on search
  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instructor._id?.toString().includes(searchQuery)
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredInstructors.length / itemsPerPage);
  const indexOfLastInstructor = currentPage * itemsPerPage;
  const indexOfFirstInstructor = indexOfLastInstructor - itemsPerPage;
  const currentInstructors = filteredInstructors.slice(
    indexOfFirstInstructor,
    indexOfLastInstructor
  );

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
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Loading instructors...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">
        instructors Management
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-blue-800">
            {instructors.length}
          </div>
          <div className="text-blue-600 mt-2">Total instructors</div>
        </div>
        <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-green-800">
            {instructors.filter((s) => !s.isBlocked).length}
          </div>
          <div className="text-green-600 mt-2">Active instructors</div>
        </div>
        <div className="bg-gradient-to-br from-red-100 to-red-200 rounded-lg p-6 shadow">
          <div className="text-3xl font-bold text-red-800">
            {instructors.filter((s) => s.isBlocked).length}
          </div>
          <div className="text-red-600 mt-2">Blocked instructors</div>
        </div>
      </div>

      {/* Search Bar and Items Per Page */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, username, or ID..."
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

      {/* instructors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">All instructors</h2>
          <p className="text-sm text-gray-600">
            Showing {filteredInstructors.length > 0 ? indexOfFirstInstructor + 1 : 0}{" "}
            to {Math.min(indexOfLastInstructor, filteredInstructors.length)} of{" "}
            {filteredInstructors.length} instructors
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
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
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
                  <tr key={instructor._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{instructor._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {instructor.fullName || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {instructor.username || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {instructor.email || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(instructor.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          instructor.isBlocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {instructor.isBlocked ? "Blocked" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(instructor._id)}
                          className="px-4 py-1.5 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleBlockToggle(instructor._id)}
                          className={`px-4 py-1.5 rounded transition-colors ${
                            instructor.isBlocked
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-red-500 text-white hover:bg-red-600"
                          }`}
                        >
                          {instructor.isBlocked ? "Unblock" : "Block"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-8 text-center text-gray-500"
                  >
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
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((pageNum, index) =>
                    pageNum === "..." ? (
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
                            ? "bg-teal-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
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
