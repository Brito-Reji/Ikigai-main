import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentStudent, logoutStudent } from "@/store/slices/studentAuthSlice.js";
import { queryClient } from "@/lib/queryClient.js";

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
          queryClient.clear();
          window.location.href = "/login";
        }
      } catch (error) {
        if (error?.isBlocked) {
          dispatch(logoutStudent());
          queryClient.clear();
          window.location.href = "/login";
        } else if (!error?.shouldRetry) {
          dispatch(logoutStudent());
          queryClient.clear();
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
