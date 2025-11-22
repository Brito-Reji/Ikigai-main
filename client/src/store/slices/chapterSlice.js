import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/api/axiosConfig.js';

// Fetch chapters for a course
export const fetchChapters = createAsyncThunk(
    'chapters/fetchChapters',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/instructor/courses/${courseId}/chapters`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch chapters' });
        }
    }
);

// Create a new chapter
export const createChapter = createAsyncThunk(
    'chapters/createChapter',
    async ({ courseId, chapterData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/instructor/courses/${courseId}/chapters`, chapterData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to create chapter' });
        }
    }
);

// Update a chapter
export const updateChapter = createAsyncThunk(
    'chapters/updateChapter',
    async ({ courseId, chapterId, chapterData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/instructor/courses/${courseId}/chapters/${chapterId}`, chapterData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update chapter' });
        }
    }
);

// Delete a chapter
export const deleteChapter = createAsyncThunk(
    'chapters/deleteChapter',
    async ({ courseId, chapterId }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/instructor/courses/${courseId}/chapters/${chapterId}`);
            return { ...response.data, chapterId };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to delete chapter' });
        }
    }
);

// Add a lesson to a chapter
export const addLesson = createAsyncThunk(
    'chapters/addLesson',
    async ({ courseId, chapterId, lessonData }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons`, lessonData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to add lesson' });
        }
    }
);

// Update a lesson
export const updateLesson = createAsyncThunk(
    'chapters/updateLesson',
    async ({ courseId, chapterId, lessonId, lessonData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`, lessonData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to update lesson' });
        }
    }
);

// Delete a lesson
export const deleteLesson = createAsyncThunk(
    'chapters/deleteLesson',
    async ({ courseId, chapterId, lessonId }, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/instructor/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to delete lesson' });
        }
    }
);

const chapterSlice = createSlice({
    name: 'chapters',
    initialState: {
        chapters: [],
        loading: false,
        error: null,
        createLoading: false,
        createError: null,
        createSuccess: false,
        updateLoading: false,
        updateError: null,
        updateSuccess: false,
        deleteLoading: false,
        deleteError: null,
    },
    reducers: {
        clearChapterState: (state) => {
            state.createLoading = false;
            state.createError = null;
            state.createSuccess = false;
            state.updateLoading = false;
            state.updateError = null;
            state.updateSuccess = false;
            state.deleteLoading = false;
            state.deleteError = null;
        },
        clearError: (state) => {
            state.error = null;
            state.createError = null;
            state.updateError = null;
            state.deleteError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch chapters
            .addCase(fetchChapters.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchChapters.fulfilled, (state, action) => {
                state.loading = false;
                state.chapters = action.payload.data || [];
            })
            .addCase(fetchChapters.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch chapters';
            })

            // Create chapter
            .addCase(createChapter.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
                state.createSuccess = false;
            })
            .addCase(createChapter.fulfilled, (state, action) => {
                state.createLoading = false;
                state.createSuccess = true;
                state.chapters.push(action.payload.data);
            })
            .addCase(createChapter.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload?.message || 'Failed to create chapter';
            })

            // Update chapter
            .addCase(updateChapter.pending, (state) => {
                state.updateLoading = true;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(updateChapter.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.updateSuccess = true;
                const index = state.chapters.findIndex(ch => ch._id === action.payload.data._id);
                if (index !== -1) {
                    state.chapters[index] = action.payload.data;
                }
            })
            .addCase(updateChapter.rejected, (state, action) => {
                state.updateLoading = false;
                state.updateError = action.payload?.message || 'Failed to update chapter';
            })

            // Delete chapter
            .addCase(deleteChapter.pending, (state) => {
                state.deleteLoading = true;
                state.deleteError = null;
            })
            .addCase(deleteChapter.fulfilled, (state, action) => {
                state.deleteLoading = false;
                state.chapters = state.chapters.filter(ch => ch._id !== action.payload.chapterId);
            })
            .addCase(deleteChapter.rejected, (state, action) => {
                state.deleteLoading = false;
                state.deleteError = action.payload?.message || 'Failed to delete chapter';
            })

            // Add lesson
            .addCase(addLesson.fulfilled, (state, action) => {
                const index = state.chapters.findIndex(ch => ch._id === action.payload.data._id);
                if (index !== -1) {
                    state.chapters[index] = action.payload.data;
                }
            })

            // Update lesson
            .addCase(updateLesson.fulfilled, (state, action) => {
                const index = state.chapters.findIndex(ch => ch._id === action.payload.data._id);
                if (index !== -1) {
                    state.chapters[index] = action.payload.data;
                }
            })

            // Delete lesson
            .addCase(deleteLesson.fulfilled, (state, action) => {
                const index = state.chapters.findIndex(ch => ch._id === action.payload.data._id);
                if (index !== -1) {
                    state.chapters[index] = action.payload.data;
                }
            });
    },
});

export const { clearChapterState, clearError } = chapterSlice.actions;
export default chapterSlice.reducer;
