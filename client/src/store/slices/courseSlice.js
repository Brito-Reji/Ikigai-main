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
            const response = await api.get('/instructor/courses');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch courses' });
        }
    }
);

const courseSlice = createSlice({
    name: 'courses',
    initialState: {
        courses: [],
        instructorCourses: [],
        loading: false,
        createLoading: false,
        error: null,
        createError: null,
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
            });
    },
});

export const { clearCreateState, clearError } = courseSlice.actions;
export default courseSlice.reducer;