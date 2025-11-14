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
  Home,
  Award,
  BookOpen
} from 'lucide-react';
import ThreeDotLoader from '@/components/ThreeDotLoader';
import Swal from 'sweetalert2';

const InstructorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructorDetails();
  }, [id]);

  const fetchInstructorDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/instructors/${id}`);
      setInstructor(response.data.data);
    } catch (error) {
      console.error('Error fetching instructor details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockToggle = async () => {
    const action = instructor.isBlocked ? 'unblock' : 'block';
    const result = await Swal.fire({
      title: `${action === 'block' ? 'Block' : 'Unblock'} Instructor?`,
      html: `
        <p>Are you sure you want to ${action} <strong>${getFullName(instructor)}</strong>?</p>
        ${action === 'block' ? '<p class="text-sm text-gray-600 mt-2">This instructor will not be able to access their account and manage courses.</p>' : '<p class="text-sm text-gray-600 mt-2">This instructor will regain access to their account and courses.</p>'}
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
        await api.patch(`/admin/instructors/${id}/toggle-block`);
        setInstructor({ ...instructor, isBlocked: !instructor.isBlocked });
        
        Swal.fire({
          title: `Instructor ${action === 'block' ? 'Blocked' : 'Unblocked'}!`,
          text: `${getFullName(instructor)} has been ${action}ed successfully.`,
          icon: 'success',
          confirmButtonColor: '#3b82f6'
        });
      } catch (error) {
        console.error('Error toggling block status:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update instructor status. Please try again.',
          icon: 'error',
          confirmButtonColor: '#dc2626'
        });
      }
    }
  };

  const getFullName = (instructor) => {
    if (!instructor) return 'N/A';
    if (instructor.fullName) return instructor.fullName;
    if (instructor.firstName && instructor.lastName) {
      return `${instructor.firstName} ${instructor.lastName}`;
    }
    if (instructor.firstName) return instructor.firstName;
    return instructor.username || 'N/A';
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

  if (!instructor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-xl text-gray-600 mb-4">Instructor not found</p>
        <button
          onClick={() => navigate('/admin/instructors')}
          className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
        >
          Back to Instructors
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/admin/dashboard" className="hover:text-indigo-600 flex items-center">
          <Home className="w-4 h-4" />
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/admin/instructors" className="hover:text-indigo-600">
          Instructors
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">
          {getFullName(instructor)}
        </span>
      </nav>

      {/* Back Button */}
      <button
        onClick={() => navigate('/admin/instructors')}
        className="flex items-center text-indigo-600 hover:text-indigo-700 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Instructors
      </button>

      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-linear-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {getFullName(instructor).charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">
                  {getFullName(instructor)}
                </h1>
                <Award className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-gray-600 text-lg mb-3">@{instructor.username || 'N/A'}</p>
              <div className="flex items-center space-x-3">
                <span
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                    instructor.isBlocked
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {instructor.isBlocked ? 'Blocked' : 'Active'}
                </span>
                <span
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full ${
                    instructor.isVerified
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {instructor.isVerified ? 'Verified' : 'Not Verified'}
                </span>
                <span className="px-4 py-1.5 text-sm font-semibold rounded-full bg-purple-100 text-purple-800">
                  Instructor
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleBlockToggle}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              instructor.isBlocked
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {instructor.isBlocked ? 'Unblock Instructor' : 'Block Instructor'}
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
              <Mail className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-gray-800 font-medium">{instructor.email || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-gray-800 font-medium">{instructor.username || 'N/A'}</p>
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
              <Shield className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Instructor ID</p>
                <p className="text-gray-800 font-medium font-mono">#{instructor._id}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-indigo-500 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Joined Date</p>
                <p className="text-gray-800 font-medium">{formatDate(instructor.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              {instructor.isVerified ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-1" />
              )}
              <div>
                <p className="text-sm text-gray-500">Email Verification</p>
                <p className="text-gray-800 font-medium">
                  {instructor.isVerified ? 'Verified' : 'Not Verified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      {(instructor.firstName || instructor.lastName) && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {instructor.firstName && (
              <div>
                <p className="text-sm text-gray-500 mb-1">First Name</p>
                <p className="text-gray-800 font-medium">{instructor.firstName}</p>
              </div>
            )}
            {instructor.lastName && (
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Name</p>
                <p className="text-gray-800 font-medium">{instructor.lastName}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Teaching Statistics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Teaching Statistics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-indigo-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Total Courses</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-600 mt-1">Total Students</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Award className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-600">0.0</p>
            <p className="text-sm text-gray-600 mt-1">Average Rating</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-600">
              {instructor.isBlocked ? 'Blocked' : 'Active'}
            </p>
            <p className="text-sm text-gray-600 mt-1">Account Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetail;
