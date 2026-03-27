import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig.js";

// login
export const loginStudent = createAsyncThunk(
  "studentAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/student/login", { email, password });
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("studentAccessToken", accessToken);
        if (refreshToken) localStorage.setItem("studentRefreshToken", refreshToken);
        sessionStorage.removeItem("studentRefreshFailed");
        return { user: response.data.user || { email, role: "student" }, accessToken };
      }
      return rejectWithValue({ message: response.data?.message || "Login failed" });
    } catch (error) {
      if (error.response?.status === 403 && error.response?.data?.requiresVerification) {
        return rejectWithValue({
          message: error.response.data.message,
          requiresVerification: true,
          email,
        });
      }
      if (error.response?.data?.isBlocked || error.response?.data?.message?.toLowerCase().includes("blocked")) {
        return rejectWithValue({
          message: error.response?.data?.message || "Your account has been blocked",
          isBlocked: true,
        });
      }
      return rejectWithValue({ message: error.response?.data?.message || "Login failed" });
    }
  }
);

// register
export const registerStudent = createAsyncThunk(
  "studentAuth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/student/register", userData);
      if (response.data.success) {
        return { message: response.data.message, email: userData.email, requiresVerification: true };
      }
      return rejectWithValue({ message: response.data?.message || "Registration failed" });
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || "Registration failed" });
    }
  }
);

// verify otp
export const verifyStudentOTP = createAsyncThunk(
  "studentAuth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });
      if (response.data.success) {
        localStorage.setItem("studentAccessToken", response.data.accessToken);
        sessionStorage.removeItem("studentRefreshFailed");
        return {
          message: response.data.message,
          verified: true,
          accessToken: response.data.accessToken,
          user: response.data.user || null,
        };
      }
      return rejectWithValue({ message: response.data?.message || "OTP verification failed" });
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || "OTP verification failed" });
    }
  }
);

// refresh token
export const refreshStudentToken = createAsyncThunk(
  "studentAuth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh");
      if (response.data.success && response.data.accessToken) {
        localStorage.setItem("studentAccessToken", response.data.accessToken);
        return response.data.accessToken;
      }
      return rejectWithValue({ message: "Failed to refresh token" });
    } catch (error) {
      localStorage.removeItem("studentAccessToken");
      return rejectWithValue({ message: "Failed to refresh token" });
    }
  }
);

// fetch current student
export const fetchCurrentStudent = createAsyncThunk(
  "studentAuth/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success && response.data.user) {
        if (response.data.user.isBlocked) {
          localStorage.removeItem("studentAccessToken");
          return rejectWithValue({ message: "Your account has been blocked.", isBlocked: true });
        }
        return response.data.user;
      }
      return rejectWithValue({ message: "Failed to fetch user data" });
    } catch (error) {
      if (error.response?.data?.isBlocked) {
        localStorage.removeItem("studentAccessToken");
        return rejectWithValue({ message: error.response.data.message || "Your account has been blocked.", isBlocked: true });
      }
      return rejectWithValue({ message: "Failed to fetch user data", shouldRetry: error.response?.status === 401 });
    }
  }
);

// google auth
export const googleStudentAuth = createAsyncThunk(
  "studentAuth/google",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/student/google", { token });
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("studentAccessToken", accessToken);
        if (refreshToken) localStorage.setItem("studentRefreshToken", refreshToken);
        sessionStorage.removeItem("studentRefreshFailed");
        return { user: response.data.user || { role: "student" }, accessToken };
      }
      return rejectWithValue({ message: "Google authentication failed" });
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || "Google authentication failed" });
    }
  }
);

const getValidToken = () => {
  const token = localStorage.getItem("studentAccessToken");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

const initialState = {
  user: null,
  accessToken: getValidToken(),
  isAuthenticated: !!getValidToken(),
  loading: false,
  error: null,
  requiresVerification: false,
  verificationEmail: null,
};

const studentAuthSlice = createSlice({
  name: "studentAuth",
  initialState,
  reducers: {
    logoutStudent: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.requiresVerification = false;
      state.verificationEmail = null;
      localStorage.removeItem("studentAccessToken");
      localStorage.removeItem("studentRefreshToken");
      api.post("/auth/logout").catch(() => {});
    },
    clearStudentError: state => {
      state.error = null;
    },
    setStudentRequiresVerification: (state, action) => {
      state.requiresVerification = true;
      state.verificationEmail = action.payload.email;
    },
    clearStudentVerificationState: state => {
      state.requiresVerification = false;
      state.verificationEmail = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginStudent.pending, state => { state.loading = true; state.error = null; })
      .addCase(loginStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        state.user = null;
        state.accessToken = null;
        state.isAuthenticated = false;
        if (action.payload?.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        }
      })

      .addCase(registerStudent.pending, state => { state.loading = true; state.error = null; })
      .addCase(registerStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        }
      })
      .addCase(registerStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      .addCase(verifyStudentOTP.pending, state => { state.loading = true; state.error = null; })
      .addCase(verifyStudentOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.requiresVerification = false;
        state.verificationEmail = null;
        state.error = null;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken || localStorage.getItem("studentAccessToken");
        if (action.payload.user) state.user = action.payload.user;
      })
      .addCase(verifyStudentOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      .addCase(refreshStudentToken.fulfilled, (state, action) => { state.accessToken = action.payload; })
      .addCase(refreshStudentToken.rejected, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        localStorage.removeItem("studentAccessToken");
      })

      .addCase(fetchCurrentStudent.pending, state => { state.loading = true; })
      .addCase(fetchCurrentStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentStudent.rejected, (state, action) => {
        state.loading = false;
        if (!action.payload?.shouldRetry) {
          state.user = null;
          state.isAuthenticated = false;
          state.accessToken = null;
          localStorage.removeItem("studentAccessToken");
        }
      })

      .addCase(googleStudentAuth.pending, state => { state.loading = true; state.error = null; })
      .addCase(googleStudentAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleStudentAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Google authentication failed";
      });
  },
});

export const { logoutStudent, clearStudentError, setStudentRequiresVerification, clearStudentVerificationState } = studentAuthSlice.actions;
export default studentAuthSlice.reducer;
