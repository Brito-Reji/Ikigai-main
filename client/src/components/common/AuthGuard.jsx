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
    const initAuth = async () => {
      // If we have a token or might have a refresh token cookie, try fetching user
      // The axios interceptor will handle token refresh automatically if needed
      if (!user && !loading && !fetchAttempted) {
        console.log("Attempting to fetch current user...");
        setFetchAttempted(true);
        setIsValidating(true);
        
        await dispatch(fetchCurrentUser());
        
        setIsValidating(false);
      }
    };

    initAuth();

    // Reset fetch attempted if token is removed
    if (!hasToken && fetchAttempted && !isValidating) {
      setFetchAttempted(false);
    }

    // handle navigation in useEffect
    if (requireAuth && !isAuthenticated && !loading && !isValidating) {
      console.log("User not authenticated, redirecting to home");
      navigate('/');
    }

    // check role-based access
    if (requireAuth && isAuthenticated && roles.length > 0 && user && !roles.includes(user.role)) {
      console.log("User doesn't have required role, redirecting to home");
      navigate('/');
    }
  }, [dispatch, user, loading, hasToken, fetchAttempted, requireAuth, isAuthenticated, roles, navigate, isValidating]);

  // Show loading spinner while checking authentication or validating token
  if (loading || (hasToken && !user && isValidating)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThreeDotLoader size="lg" color="indigo" />
      </div>
    );
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
