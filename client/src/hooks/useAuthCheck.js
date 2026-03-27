import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentStudent, logoutStudent } from "@/store/slices/studentAuthSlice.js";

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.studentAuth.accessToken);

  useEffect(() => {
    let isMounted = true;

    const checkUserStatus = async () => {
      const tokenLocal = localStorage.getItem("studentAccessToken");

      if (!tokenLocal || tokenLocal === "null" || tokenLocal === "undefined") {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const resultAction = await dispatch(fetchCurrentStudent()).unwrap();

        if (resultAction?.isBlocked) {
          dispatch(logoutStudent());
          window.location.href = "/login";
        }
      } catch (error) {
        if (error?.isBlocked) {
          dispatch(logoutStudent());
          window.location.href = "/login";
        } else if (!error?.shouldRetry) {
          dispatch(logoutStudent());
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    checkUserStatus();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return { isLoading };
};
