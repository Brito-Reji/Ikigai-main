import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/api/axiosConfig';
import { 
  ArrowLeft, 
  Mail, 
  User, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Home
} from 'lucide-react';
import ThreeDotLoader from '@/components/ThreeDotLoader';
import Swal from 'sweetalert2';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/students/${id}`);
      console.log(response)
      setStudent(response.data.data);
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    const action = student.isBlocked ? 'unblock' : 'block';
    const result = await Swal.fire({
      title: `${action === 'block' ? 'Block' : 'Unblock'} Student?`,
      html: `
        <p>Are you sure you want to ${action} <strong>${student.fullName || student.username}</strong>?</p>
        ${action === 'block' ? '<p class="text-sm text-gray-600 mt-2">This student will not be able to access their account.</p>' : '<p class="text-sm text-gray-600 mt-2">This student will regain access to their account.</p>'}
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
        await api.patch(`/admin/students/${id}/toggle-block`);
        setStudent({ ...student, isBlocked: !student.isBlocked });
        
        Swal.fire({
          title: `Student ${action === 'block' ? 'Blocked' : 'Unblocked'}!`,
          text: `${student.fullName || student.username} has been ${action}ed successfully.`,
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });
      } catch (error) {
        console.error('Error toggling block status:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update student status. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ThreeDotLoader size="lg" color="indigo" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-600 mb-4">Student not found</p>
        <button
          onClick={() => navigate('/admin/students')}
          className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/admin/dashboard" className="hover:text-teal-600 flex items-center">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/admin/students" className="hover:text-teal-600">
          Students
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">
          {student.fullName || student.username}
        </span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/students')}
        className="flex items-center text-teal-600 hover:text-teal-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Students
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {student.fullName?.charAt(0) || student.username?.charAt(0) || 'S'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {student.fullName || 'N/A'}
              </h1>
              <p className="text-gray-600 text-lg mb-3">@{student.username || 'N/A'}</p>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                    student.isBlocked
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {student.isBlocked ? 'Blocked' : 'Active'}
                </span>
                <span
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                    student.isVerified
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {student.isVerified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleBlockToggle}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              student.isBlocked
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {student.isBlocked ? 'Unblock Student' : 'Block Student'}
          </button>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Contact Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-teal-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-gray-800 font-medium">{student.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-teal-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-gray-800 font-medium">{student.username || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Account Information
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-teal-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Student ID</p>
                <p className="text-gray-800 font-medium font-mono">#{student._id}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-teal-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="text-gray-800 font-medium">{formatDate(student.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              {student.isVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-1" />
              )}
              <div>
                <p className="text-sm text-gray-500">Email Verification</p>
                <p className="text-gray-800 font-medium">
                  {student.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      {(student.firstName || student.lastName) && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.firstName && (
              <div>
                <p className="text-sm text-gray-500 mb-1">First Name</p>
                <p className="text-gray-800 font-medium">{student.firstName}</p>
              </div>
            )}
            {student.lastName && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Name</p>
                <p className="text-gray-800 font-medium">{student.lastName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Activity Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Activity Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Enrolled Courses</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Completed Courses</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">
              {student.isBlocked ? 'Blocked' : 'Active'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Account Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
