import { useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// auth hook
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(state => state.auth);

  return {
    ...auth,
    dispatch,
  };
};

// courses hook
export const useCourses = () => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector(state => state.courses);

  return {
    ...courses,
    dispatch,
  };
};

// cart hook
export const useCart = () => {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(state => state.cart);
  return {
    ...cart,
    dispatch,
  };
};

// category hook
export const useCategory = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector(state => state.category);
  return {
    ...categories,
    dispatch,
  };
};

// chapter hook
export const useChapter = () => {
  const dispatch = useAppDispatch();
  const chapters = useAppSelector(state => state.chapters);
  return {
    ...chapters,
    dispatch,
  };
};
