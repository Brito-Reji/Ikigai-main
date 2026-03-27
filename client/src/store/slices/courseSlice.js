import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/api/axiosConfig.js";
import adminApi from "@/api/adminAxiosConfig.js";
import instructorApi from "@/api/instructorAxiosConfig.js";

// fetch courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get("/courses", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch courses" }
      );
    }
  }
);

// create course (instructor)
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await instructorApi.post("/instructor/courses", courseData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to create course" }
      );
    }
  }
);

// fetch instructor courses
export const fetchInstructorCourses = createAsyncThunk(
  "courses/fetchInstructorCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instructorApi.get("/instructor/courses");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch courses" }
      );
    }
  }
);

// fetch public courses
export const fetchPublicCourses = createAsyncThunk(
  "courses/fetchPublicCourses",
  async ({ limit = 8, category, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (limit) params.append("limit", limit);
      if (category) params.append("category", category);
      if (search) params.append("search", search);

      const response = await api.get(`/public/courses?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch public courses" }
      );
    }
  }
);

// fetch featured courses
export const fetchFeaturedCourses = createAsyncThunk(
  "courses/fetchFeaturedCourses",
  async ({ limit = 4 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/public/courses/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch featured courses" }
      );
    }
  }
);

// fetch course by id
export const fetchCourseById = createAsyncThunk(
  "courses/fetchCourseById",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await instructorApi.get(`/instructor/courses/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch course" }
      );
    }
  }
);

// update course
export const updateCourse = createAsyncThunk(
  "courses/updateCourse",
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const response = await instructorApi.put(
        `/instructor/courses/${courseId}`,
        courseData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update course" }
      );
    }
  }
);

// fetch public course details
export const fetchPublicCourseDetails = createAsyncThunk(
  "courses/fetchPublicCourseDetails",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/public/courses/${courseId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Course not found or unavailable" }
      );
    }
  }
);

// admin: fetch courses
export const fetchAdminCourses = createAsyncThunk(
  "courses/fetchAdminCourses",
  async (
    { page = 1, limit = 12, search, category, status },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (status) params.append("status", status);

      const response = await adminApi.get(
        `/admin/courses?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch courses" }
      );
    }
  }
);

// admin: fetch stats
export const fetchCourseStatistics = createAsyncThunk(
  "courses/fetchCourseStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApi.get("/admin/courses/statistics");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch statistics" }
      );
    }
  }
);

// admin: toggle block
export const toggleCourseBlock = createAsyncThunk(
  "courses/toggleCourseBlock",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await adminApi.patch(
        `/admin/courses/${courseId}/toggle-block`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update course status" }
      );
    }
  }
);

// admin: delete course
export const deleteAdminCourse = createAsyncThunk(
  "courses/deleteAdminCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await adminApi.delete(`/admin/courses/${courseId}`);
      return { ...response.data, courseId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete course" }
      );
    }
  }
);

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    instructorCourses: [],
    publicCourses: [],
    featuredCourses: [],
    adminCourses: [],
    currentCourse: null,
    publicCourseDetails: null,
    statistics: {},
    pagination: {},
    loading: false,
    createLoading: false,
    updateLoading: false,
    publicLoading: false,
    featuredLoading: false,
    courseLoading: false,
    publicDetailsLoading: false,
    adminLoading: false,
    statisticsLoading: false,
    error: null,
    createError: null,
    updateError: null,
    publicError: null,
    featuredError: null,
    courseError: null,
    publicDetailsError: null,
    adminError: null,
    currentPage: 1,
    totalPages: 1,
    createSuccess: false,
    updateSuccess: false,
  },
  reducers: {
    clearCreateState: state => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    clearUpdateState: state => {
      state.updateLoading = false;
      state.updateError = null;
      state.updateSuccess = false;
    },
    clearPublicDetailsState: state => {
      state.publicDetailsLoading = false;
      state.publicDetailsError = null;
      state.publicCourseDetails = null;
    },
    clearError: state => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.publicError = null;
      state.featuredError = null;
      state.courseError = null;
      state.publicDetailsError = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCourses.pending, state => {
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
        state.error = action.payload?.message || "Failed to fetch courses";
      })

      .addCase(createCourse.pending, state => {
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
        state.createError =
          action.payload?.message || "Failed to create course";
      })

      .addCase(fetchInstructorCourses.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorCourses = action.payload.data || [];
      })
      .addCase(fetchInstructorCourses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to fetch instructor courses";
      })

      .addCase(fetchPublicCourses.pending, state => {
        state.publicLoading = true;
        state.publicError = null;
      })
      .addCase(fetchPublicCourses.fulfilled, (state, action) => {
        state.publicLoading = false;
        state.publicCourses = action.payload.data || [];
      })
      .addCase(fetchPublicCourses.rejected, (state, action) => {
        state.publicLoading = false;
        state.publicError =
          action.payload?.message || "Failed to fetch public courses";
      })

      .addCase(fetchFeaturedCourses.pending, state => {
        state.featuredLoading = true;
        state.featuredError = null;
      })
      .addCase(fetchFeaturedCourses.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredCourses = action.payload.data || [];
      })
      .addCase(fetchFeaturedCourses.rejected, (state, action) => {
        state.featuredLoading = false;
        state.featuredError =
          action.payload?.message || "Failed to fetch featured courses";
      })

      .addCase(fetchCourseById.pending, state => {
        state.courseLoading = true;
        state.courseError = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.courseLoading = false;
        state.currentCourse = action.payload.data;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.courseLoading = false;
        state.courseError = action.payload?.message || "Failed to fetch course";
      })

      .addCase(updateCourse.pending, state => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        state.currentCourse = action.payload.data;
        const index = state.instructorCourses.findIndex(
          course => course._id === action.payload.data._id
        );
        if (index !== -1) {
          state.instructorCourses[index] = action.payload.data;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError =
          action.payload?.message || "Failed to update course";
      })

      .addCase(fetchPublicCourseDetails.pending, state => {
        state.publicDetailsLoading = true;
        state.publicDetailsError = null;
      })
      .addCase(fetchPublicCourseDetails.fulfilled, (state, action) => {
        state.publicDetailsLoading = false;
        state.publicCourseDetails = action.payload.data;
      })
      .addCase(fetchPublicCourseDetails.rejected, (state, action) => {
        state.publicDetailsLoading = false;
        state.publicDetailsError =
          action.payload?.message || "Course not found or unavailable";
      })

      .addCase(fetchAdminCourses.pending, state => {
        state.adminLoading = true;
        state.adminError = null;
      })
      .addCase(fetchAdminCourses.fulfilled, (state, action) => {
        state.adminLoading = false;
        state.adminCourses = action.payload.data || [];
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchAdminCourses.rejected, (state, action) => {
        state.adminLoading = false;
        state.adminError = action.payload?.message || "Failed to fetch courses";
      })

      .addCase(fetchCourseStatistics.pending, state => {
        state.statisticsLoading = true;
      })
      .addCase(fetchCourseStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload.data || {};
      })
      .addCase(fetchCourseStatistics.rejected, state => {
        state.statisticsLoading = false;
      })

      .addCase(toggleCourseBlock.fulfilled, (state, action) => {
        const updatedCourse = action.payload.data;
        const index = state.adminCourses.findIndex(
          course => course._id === updatedCourse._id
        );
        if (index !== -1) {
          state.adminCourses[index] = updatedCourse;
        }
      })

      .addCase(deleteAdminCourse.fulfilled, (state, action) => {
        state.adminCourses = state.adminCourses.filter(
          course => course._id !== action.payload.courseId
        );
      });
  },
});

export const {
  clearCreateState,
  clearUpdateState,
  clearPublicDetailsState,
  clearError,
} = courseSlice.actions;
export default courseSlice.reducer;
