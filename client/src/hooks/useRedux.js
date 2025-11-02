import { useDispatch, useSelector } from 'react-redux';

// Custom hooks for better type safety and convenience
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Auth hooks
export const useAuth = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector((state) => state.auth);

    return {
        ...auth,
        dispatch
    };
};

// UI hooks
export const useUI = () => {
    const dispatch = useAppDispatch();
    const ui = useAppSelector((state) => state.ui);

    return {
        ...ui,
        dispatch
    };
};

// Course hooks
export const useCourses = () => {
    const dispatch = useAppDispatch();
    const courses = useAppSelector((state) => state.courses);

    return {
        ...courses,
        dispatch
    };
};