import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/api/axiosConfig.js';

// Fetch courses from an API with pagination support
export const fetchCourses = createAsyncThunk(
    'courses/fetchCourses',
    async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await api.get('/courses', {
                params: { page, limit }
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Create a new course (instructor)
export const createCourse = createAsyncThunk(
    'courses/createCourse',
    async (courseData, { rejectWithValue }) => {
        try {
            console.log('Creating course with data:', courseData);
            const response = await api.post('/instructor/courses', courseData);
            console.log('Course creation response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Course creation error:', error);
            console.error('Error response:', error.response?.data);
            return rejectWithValue(error.response?.data || { message: 'Failed to create course' });
        }
    }
);

// Fetch instructor's courses
export const fetchInstructorCourses = createAsyncThunk(
    'courses/fetchInstructorCourses',
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching instructor courses from API...');
            const response = await api.get('/instructor/courses');
            console.log('Instructor courses response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching instructor courses:', error);
            console.error('Error response:', error.response?.data);
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch courses' });
        }
    }
);

// Fetch public courses for landing page
export const fetchPublicCourses = createAsyncThunk(
    'courses/fetchPublicCourses',
    async ({ limit = 8, category, search } = {}, { rejectWithValue }) => {
        try {
            console.log('Fetching public courses from API...');
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit);
            if (category) params.append('category', category);
            if (search) params.append('search', search);

            const response = await api.get(`/public/courses?${params.toString()}`);
            console.log('Public courses response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching public courses:', error);
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch public courses' });
        }
    }
);

// Fetch featured courses
export const fetchFeaturedCourses = createAsyncThunk(
    'courses/fetchFeaturedCourses',
    async ({ limit = 4 } = {}, { rejectWithValue }) => {
        try {
            console.log('Fetching featured courses from API...');
            const response = await api.get(`/public/courses/featured?limit=${limit}`);
            console.log('Featured courses response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching featured courses:', error);
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch featured courses' });
        }
    }
);

const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        instructorCourses: [],
        publicCourses: [],
        featuredCourses: [],
        loading: false,
        createLoading: false,
        publicLoading: false,
        featuredLoading: false,
        error: null,
        createError: null,
        publicError: null,
        featuredError: null,
        currentPage: 1,
        totalPages: 1,
        createSuccess: false,
    },
    reducers: {
        clearCreateState: (state) => {
            state.createLoading = false;
            state.createError = null;
            state.createSuccess = false;
        },
        clearError: (state) => {
            state.error = null;
            state.createError = null;
            state.publicError = null;
            state.featuredError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch courses
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload.courses;
                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch courses';
            })

            // Create course
            .addCase(createCourse.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
                state.createSuccess = false;
            })
            .addCase(createCourse.fulfilled, (state, action) => {
                state.createLoading = false;
                state.createSuccess = true;
                state.instructorCourses.unshift(action.payload.data);
            })
            .addCase(createCourse.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload?.message || 'Failed to create course';
            })

            // Fetch instructor courses
            .addCase(fetchInstructorCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.instructorCourses = action.payload.data || [];
            })
            .addCase(fetchInstructorCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch instructor courses';
            })

            // Fetch public courses
            .addCase(fetchPublicCourses.pending, (state) => {
                state.publicLoading = true;
                state.publicError = null;
            })
            .addCase(fetchPublicCourses.fulfilled, (state, action) => {
                state.publicLoading = false;
                state.publicCourses = action.payload.data || [];
            })
            .addCase(fetchPublicCourses.rejected, (state, action) => {
                state.publicLoading = false;
                state.publicError = action.payload?.message || 'Failed to fetch public courses';
            })

            // Fetch featured courses
            .addCase(fetchFeaturedCourses.pending, (state) => {
                state.featuredLoading = true;
                state.featuredError = null;
            })
            .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
                state.featuredLoading = false;
                state.featuredCourses = action.payload.data || [];
            })
            .addCase(fetchFeaturedCourses.rejected, (state, action) => {
                state.featuredLoading = false;
                state.featuredError = action.payload?.message || 'Failed to fetch featured courses';
            });
    },
});

export const { clearCreateState, clearError } = courseSlice.actions;
export default courseSlice.reducer;