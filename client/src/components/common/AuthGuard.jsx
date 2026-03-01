import React, { useEffect } from "react";
import { useAuth } from "@/hooks/useRedux.js";
import { fetchCurrentUser } from "@/store/slices/authSlice.js";
import ThreeDotLoader from "./ThreeDotLoader.jsx";
import { useNavigate } from "react-router-dom";

const AuthGuard = ({ children, requireAuth = false, roles = [] }) => {
  const { isAuthenticated, user, loading, dispatch } = useAuth();
  const [fetchAttempted, setFetchAttempted] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);
  const isAdminRoute = roles.includes("admin");
  const hasToken = isAdminRoute
    ? !!localStorage.getItem("adminAccessToken")
    : !!localStorage.getItem("accessToken");
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      if (!user && !loading && !fetchAttempted && hasToken) {
        setFetchAttempted(true);
        setIsValidating(true);
        await dispatch(fetchCurrentUser());
        setIsValidating(false);
      }
    };

    initAuth();

    if (!hasToken && fetchAttempted && !isValidating) {
      setFetchAttempted(false);
    }

    // redirect if auth required but not authenticated
    if (requireAuth && !isAuthenticated && !loading && !isValidating && !hasToken) {
      navigate("/");
    }

    // role check
    if (requireAuth && isAuthenticated && roles.length > 0 && user && !roles.includes(user.role)) {
      navigate("/");
    }
  }, [dispatch, user, loading, hasToken, fetchAttempted, requireAuth, isAuthenticated, roles, navigate, isValidating]);

  if (loading || (hasToken && !user && isValidating)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThreeDotLoader size="lg" color="indigo" />
      </div>
    );
  }

  // blocked user
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

  return children;
};

export default AuthGuard;
