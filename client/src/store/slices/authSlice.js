import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig.js";

// Async thunks for API calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const endpoint =
        role === "instructor"
          ? "/auth/instructor/signin"
          : "/auth/student/login";
      const response = await api.post(endpoint, { email, password });

      if (response.data.success) {
        const token = response.data.data?.token || response.data.accessToken;
        localStorage.setItem("accessToken", token);
        console.log("Login successful, token stored:", token);
        return {
          user: response.data.user || { email, role },
          token,
          role,
        };
      }
    } catch (error) {
      if (
        error.response?.status === 403 &&
        error.response?.data?.requiresVerification
      ) {
        return rejectWithValue({
          message: error.response.data.message,
          requiresVerification: true,
          email,
        });
      }
      return rejectWithValue({
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ userData, role }, { rejectWithValue }) => {
    try {
      const endpoint =
        role === "instructor"
          ? "/auth/instructor/register"
          : "/auth/student/register";
      const response = await api.post(endpoint, userData);

      if (response.data.success) {
        return {
          message: response.data.message,
          email: userData.email,
          requiresVerification: true,
        };
      }
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Registration failed",
      });
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });

      if (response.data.success) {
        return {
          message: response.data.message,
          verified: true,
        };
      }
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "OTP verification failed",
      });
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      console.log("Current user fetched:", response.data);
      return response.data.user;
    } catch (error) {
      console.log("Error fetching current user:", error);
      localStorage.removeItem("accessToken");
      return rejectWithValue({
        message: "Failed to fetch user data",
      });
    }
  }
);

export const googleAuth = createAsyncThunk(
  "auth/googleAuth",
  async ({ token, role }, { rejectWithValue }) => {
    try {
      const endpoint =
        role === "instructor"
          ? "/auth/instructor/google"
          : "/auth/student/google";
      const response = await api.post(endpoint, { token });

      if (response.data.success) {
        const token = response.data.data?.token || response.data.accessToken;
        localStorage.setItem("accessToken", token);
        console.log("Google auth successful, token stored:", token);
        return {
          user: response.data.user || { role },
          token,
          role,
        };
      }
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.message || "Google authentication failed",
      });
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem("accessToken"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
  requiresVerification: false,
  verificationEmail: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.requiresVerification = false;
      state.verificationEmail = null;
      localStorage.removeItem("accessToken");
      console.log("User logged out");
    },
    clearError: (state) => {
      state.error = null;
    },
    setRequiresVerification: (state, action) => {
      state.requiresVerification = true;
      state.verificationEmail = action.payload.email;
    },
    clearVerificationState: (state) => {
      state.requiresVerification = false;
      state.verificationEmail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.requiresVerification = false;
        console.log("Login fulfilled, state updated:", state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
        if (action.payload.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        }
      })

      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // OTP Verification cases
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.requiresVerification = false;
        state.verificationEmail = null;
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Fetch current user cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        console.log("Current user fulfilled, state updated:", state);
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("accessToken");
        console.log("Current user rejected, state updated:", state);
      })

      // Google Auth cases
      .addCase(googleAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        console.log("Google auth fulfilled, state updated:", state);
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const {
  logout,
  clearError,
  setRequiresVerification,
  clearVerificationState,
} = authSlice.actions;
export default authSlice.reducer;
