import React, { useEffect } from "react";
// Changed import to use Redux hook instead of Context
import { useAuth } from "../hooks/useRedux.js";
import { fetchCurrentUser } from "../store/slices/authSlice.js";

const AuthGuard = ({ children, requireAuth = false, roles = [] }) => {
  // Changed to use Redux hook instead of Context
  const { isAuthenticated, user, loading, dispatch } = useAuth();
  const [fetchAttempted, setFetchAttempted] = React.useState(false);
  const hasToken = !!localStorage.getItem("accessToken");
  // Check authentication status - use token as fallback if Redux state isn't updated yet
  const authenticated = isAuthenticated || hasToken;
  

  console.log("AuthGuard state:", { isAuthenticated, user, loading, hasToken, authenticated });

  useEffect(() => {
    // Fetch current user if token exists but no user data and haven't tried yet
    if (hasToken && !user && !loading && !fetchAttempted) {
      console.log("Fetching current user...");
      setFetchAttempted(true);
      dispatch(fetchCurrentUser());
    }
    
    // Reset fetch attempted if token is removed
    if (!hasToken && fetchAttempted) {
      setFetchAttempted(false);
    }
  }, [dispatch, user, loading, hasToken, fetchAttempted]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not 
  // authenticated
  console.log("requireAuth",requireAuth)
  console.log("authenticated",authenticated)
  if (requireAuth && !authenticated) {
    console.log("User not authenticated, showing login prompt");
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this page.
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If specific roles are required but user doesn't have the right role
  if (requireAuth && authenticated && roles.length > 0 && user && !roles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  if (requireAuth && authenticated && user?.isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Account Blocked
          </h2>
          <p className="text-gray-600 mb-6">
            Your account has been blocked. Please contact support.
          </p>
          <button
            onClick={() => {
                 console.log('this was tiggered')
              // localStorage.removeItem("accessToken");
              window.location.href = "/login";
            }}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  console.log("User authenticated, rendering children");
  return children;
};

export default AuthGuard;
