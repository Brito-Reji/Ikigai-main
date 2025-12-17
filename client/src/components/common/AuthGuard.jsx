import React, { useEffect } from "react";
// Changed import to use Redux hook instead of Context
import { useAuth } from "@/hooks/useRedux.js";
import { fetchCurrentUser } from "@/store/slices/authSlice.js";
import ThreeDotLoader from "./ThreeDotLoader.jsx";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children, requireAuth = false, roles = [] }) => {
  // Changed to use Redux hook instead of Context
  const { isAuthenticated, user, loading, dispatch } = useAuth();
  const [fetchAttempted, setFetchAttempted] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const hasToken = !!localStorage.getItem("accessToken");
  const navigate = useNavigate()

  console.log("AuthGuard state:", { isAuthenticated, user, loading, hasToken, fetchAttempted, isValidating });

  useEffect(() => {
    // Fetch current user if token exists but no user data and haven't tried yet

   


    if (hasToken && !user && !loading && !fetchAttempted) {
      console.log("Fetching current user...");
      setFetchAttempted(true);
      setIsValidating(true);
      dispatch(fetchCurrentUser()).finally(() => {
        setIsValidating(false);
      });
    }

    // Reset fetch attempted if token is removed
    if (!hasToken && fetchAttempted) {
      setFetchAttempted(false);
      setIsValidating(false);
    }
  }, [dispatch, user, loading, hasToken, fetchAttempted]);

  // Show loading spinner while checking authentication or validating token
  if (loading || (hasToken && !user && isValidating)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThreeDotLoader size="lg" color="indigo" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  // Only trust isAuthenticated from Redux (not just token presence)
  console.log("requireAuth", requireAuth);
  console.log("isAuthenticated", isAuthenticated);
  if (requireAuth && !isAuthenticated) {
    console.log("User not authenticated, showing login prompt");
    navigate('/')
  }

  // If specific roles are required but user doesn't have the right role
  if (requireAuth && isAuthenticated && roles.length > 0 && user && !roles.includes(user.role)) {
    navigate('/')
  }
  if (requireAuth && isAuthenticated && user?.isBlocked) {
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
              console.log("this was tiggered")
              localStorage.removeItem("accessToken");
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
