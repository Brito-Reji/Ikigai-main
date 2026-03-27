import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux.js";
import { fetchCurrentStudent } from "@/store/slices/studentAuthSlice.js";
import { fetchCurrentInstructor } from "@/store/slices/instructorAuthSlice.js";
import { fetchCurrentAdmin } from "@/store/slices/adminAuthSlice.js";
import ThreeDotLoader from "./ThreeDotLoader.jsx";
import { useNavigate } from "react-router-dom";

// token key per role
const TOKEN_KEYS = {
  student: "studentAccessToken",
  instructor: "instructorAccessToken",
  admin: "adminAccessToken",
};

// fetch action per role
const FETCH_ACTIONS = {
  student: fetchCurrentStudent,
  instructor: fetchCurrentInstructor,
  admin: fetchCurrentAdmin,
};

// slice selector per role
const SELECTORS = {
  student: state => state.studentAuth,
  instructor: state => state.instructorAuth,
  admin: state => state.adminAuth,
};

const AuthGuard = ({ children, requireAuth = false, roles = [] }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [fetchAttempted, setFetchAttempted] = React.useState(false);
  const [isValidating, setIsValidating] = React.useState(false);

  // pick the first required role (routes only have one)
  const role = roles[0] || "student";
  const tokenKey = TOKEN_KEYS[role] || "studentAccessToken";
  const selector = SELECTORS[role] || SELECTORS.student;
  const fetchAction = FETCH_ACTIONS[role] || fetchCurrentStudent;

  const { isAuthenticated, user, loading } = useAppSelector(selector);
  const hasToken = !!localStorage.getItem(tokenKey);

  useEffect(() => {
    const initAuth = async () => {
      if (!user && !loading && !fetchAttempted && hasToken) {
        setFetchAttempted(true);
        setIsValidating(true);
        await dispatch(fetchAction());
        setIsValidating(false);
      }
    };
    initAuth();

    if (!hasToken && fetchAttempted && !isValidating) {
      setFetchAttempted(false);
    }

    if (requireAuth && !isAuthenticated && !loading && !isValidating && !hasToken) {
      navigate("/");
    }

    if (requireAuth && isAuthenticated && roles.length > 0 && user && !roles.includes(user.role)) {
      navigate("/");
    }
  }, [dispatch, user, loading, hasToken, fetchAttempted, requireAuth, isAuthenticated, roles, navigate, isValidating, fetchAction]);

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
          <h2 className="text-2xl font-bold text-red-600 mb-4">Account Blocked</h2>
          <p className="text-gray-600 mb-6">Your account has been blocked. Please contact support.</p>
          <button
            onClick={() => {
              localStorage.removeItem(tokenKey);
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
