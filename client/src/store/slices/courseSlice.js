import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axiosConfig.js';

// Async thunks for course operations
export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async ({ page = 1, limit = 10, search = '', category = '' }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                ...(search && { search }),
                ...(category && { category })
            });

            const response = await api.get(`/courses?${params}`);
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch courses'
            });
        }
    }
);

export const fetchCourseById = createAsyncThunk(
    'courses/fetchCourseById',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to fetch course'
            });
        }
    }
);

export const createCourse = createAsyncThunk(
    'courses/createCourse',
    async (courseData, { rejectWithValue }) => {
        try {
            const response = await api.post('/courses', courseData);
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to create course'
            });
        }
    }
);

export const updateCourse = createAsyncThunk(
    'courses/updateCourse',
    async ({ courseId, courseData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/courses/${courseId}`, courseData);
            return response.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to update course'
            });
        }
    }
);

export const deleteCourse = createAsyncThunk(
    'courses/deleteCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            await api.delete(`/courses/${courseId}`);
            return courseId;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to delete course'
            });
        }
    }
);

const initialState = {
    courses: [],
    currentCourse: null,
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        totalPages: 1,
        totalCourses: 0,
        limit: 10
    },
    filters: {
        search: '',
        category: '',
        priceRange: { min: 0, max: 1000 },
        rating: 0,
        level: ''
    },
    cart: [],
    wishlist: []
};

const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                search: '',
                category: '',
                priceRange: { min: 0, max: 1000 },
                rating: 0,
                level: ''
            };
        },
        addToCart: (state, action) => {
            const courseId = action.payload;
            if (!state.cart.includes(courseId)) {
                state.cart.push(courseId);
            }
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(id => id !== action.payload);
        },
        clearCart: (state) => {
            state.cart = [];
        },
        addToWishlist: (state, action) => {
            const courseId = action.payload;
            if (!state.wishlist.includes(courseId)) {
                state.wishlist.push(courseId);
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlist = state.wishlist.filter(id => id !== action.payload);
        },
        clearCurrentCourse: (state) => {
            state.currentCourse = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch courses cases
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses || [];
                state.pagination = {
                    currentPage: action.payload.currentPage || 1,
                    totalPages: action.payload.totalPages || 1,
                    totalCourses: action.payload.totalCourses || 0,
                    limit: action.payload.limit || 10
                };
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Fetch course by ID cases
            .addCase(fetchCourseById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload.course;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Create course cases
            .addCase(createCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses.unshift(action.payload.course);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Update course cases
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.courses.findIndex(course => course._id === action.payload.course._id);
                if (index !== -1) {
                    state.courses[index] = action.payload.course;
                }
                if (state.currentCourse?._id === action.payload.course._id) {
                    state.currentCourse = action.payload.course;
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })

            // Delete course cases
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = state.courses.filter(course => course._id !== action.payload);
                if (state.currentCourse?._id === action.payload) {
                    state.currentCourse = null;
                }
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

export const {
    clearError,
    setFilters,
    clearFilters,
    addToCart,
    removeFromCart,
    clearCart,
    addToWishlist,
    removeFromWishlist,
    clearCurrentCourse
} = courseSlice.actions;

export default courseSlice.reducer;