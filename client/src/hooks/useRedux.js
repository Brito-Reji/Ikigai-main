import { useDispatch, useSelector } from "react-redux";

// Custom hooks for better type safety and convenience
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth hooks
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);
  console.log("useAuth state:", auth);

  return {
    ...auth,
    dispatch,
  };
};


export const useCourses = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses);

  return {
    ...courses,
    dispatch,
  };
};



export const useCart = () => {
  const dispatch = useAppDispatch()
  const cart = useAppDispatch((state) => state.cart) 
  return {
    ...cart,
    dispatch
  }
}
