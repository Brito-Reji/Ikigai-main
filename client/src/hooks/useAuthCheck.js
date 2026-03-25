import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, logout } from "@/store/slices/authSlice.js";

export const useAuthCheck = () => {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const accessToken = useSelector(state => state.auth.accessToken);

  useEffect(() => {
    let isMounted = true;

    const checkUserStatus = async () => {
      const tokenLocal = localStorage.getItem("accessToken");
      
      if (!tokenLocal || tokenLocal === "null" || tokenLocal === "undefined") {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const resultAction = await dispatch(fetchCurrentUser()).unwrap();
        
        if (resultAction?.isBlocked) {
          dispatch(logout());
          window.location.href = "/login";
        }
      } catch (error) {
        if (error?.isBlocked) {
           dispatch(logout());
           window.location.href = "/login";
        } else if (!error?.shouldRetry) {
           dispatch(logout());
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
