import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instructorApi from "../../api/instructorAxiosConfig.js";

// login
export const loginInstructor = createAsyncThunk(
  "instructorAuth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await instructorApi.post("/auth/instructor/signin", { email, password });
      if (response.data.success) {
        const { accessToken } = response.data;
        localStorage.setItem("instructorAccessToken", accessToken);
        sessionStorage.removeItem("instructorRefreshFailed");
        return { user: response.data.user || { email, role: "instructor" }, accessToken };
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
export const registerInstructor = createAsyncThunk(
  "instructorAuth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await instructorApi.post("/auth/instructor/register", userData);
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
export const verifyInstructorOTP = createAsyncThunk(
  "instructorAuth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await instructorApi.post("/auth/verify-otp", { email, otp });
      if (response.data.success) {
        const { accessToken, user } = response.data.data || {};
        localStorage.setItem("instructorAccessToken", accessToken);
        sessionStorage.removeItem("instructorRefreshFailed");
        return {
          message: response.data.message,
          verified: true,
          accessToken: accessToken,
          user: user || null,
        };
      }
      return rejectWithValue({ message: response.data?.message || "OTP verification failed" });
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || "OTP verification failed" });
    }
  }
);

// fetch current instructor
export const fetchCurrentInstructor = createAsyncThunk(
  "instructorAuth/fetchCurrent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instructorApi.get("/auth/me");
      if (response.data.success && response.data.user) {
        if (response.data.user.isBlocked) {
          localStorage.removeItem("instructorAccessToken");
          return rejectWithValue({ message: "Your account has been blocked.", isBlocked: true });
        }
        return response.data.user;
      }
      return rejectWithValue({ message: "Failed to fetch user data" });
    } catch (error) {
      if (error.response?.data?.isBlocked) {
        localStorage.removeItem("instructorAccessToken");
        return rejectWithValue({ message: error.response.data.message || "Your account has been blocked.", isBlocked: true });
      }
      return rejectWithValue({ message: "Failed to fetch user data", shouldRetry: error.response?.status === 401 });
    }
  }
);

// google auth
export const googleInstructorAuth = createAsyncThunk(
  "instructorAuth/google",
  async ({ token }, { rejectWithValue }) => {
    try {
      const response = await instructorApi.post("/auth/instructor/google", { token });
      if (response.data.success) {
        const { accessToken } = response.data;
        localStorage.setItem("instructorAccessToken", accessToken);
        sessionStorage.removeItem("instructorRefreshFailed");
        return { user: response.data.user || { role: "instructor" }, accessToken };
      }
      return rejectWithValue({ message: "Google authentication failed" });
    } catch (error) {
      return rejectWithValue({ message: error.response?.data?.message || "Google authentication failed" });
    }
  }
);

const getValidToken = () => {
  const token = localStorage.getItem("instructorAccessToken");
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

const instructorAuthSlice = createSlice({
  name: "instructorAuth",
  initialState,
  reducers: {
    logoutInstructor: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.requiresVerification = false;
      state.verificationEmail = null;
      localStorage.removeItem("instructorAccessToken");
      instructorApi.post("/auth/logout").catch(() => {});
    },
    clearInstructorError: state => {
      state.error = null;
    },
    setInstructorRequiresVerification: (state, action) => {
      state.requiresVerification = true;
      state.verificationEmail = action.payload.email;
    },
    clearInstructorVerificationState: state => {
      state.requiresVerification = false;
      state.verificationEmail = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginInstructor.pending, state => { state.loading = true; state.error = null; })
      .addCase(loginInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginInstructor.rejected, (state, action) => {
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

      .addCase(registerInstructor.pending, state => { state.loading = true; state.error = null; })
      .addCase(registerInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        }
      })
      .addCase(registerInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      .addCase(verifyInstructorOTP.pending, state => { state.loading = true; state.error = null; })
      .addCase(verifyInstructorOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.requiresVerification = false;
        state.verificationEmail = null;
        state.error = null;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken || localStorage.getItem("instructorAccessToken");
        if (action.payload.user) state.user = action.payload.user;
      })
      .addCase(verifyInstructorOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      .addCase(fetchCurrentInstructor.pending, state => { state.loading = true; })
      .addCase(fetchCurrentInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentInstructor.rejected, (state, action) => {
        state.loading = false;
        if (!action.payload?.shouldRetry) {
          state.user = null;
          state.isAuthenticated = false;
          state.accessToken = null;
          localStorage.removeItem("instructorAccessToken");
        }
      })

      .addCase(googleInstructorAuth.pending, state => { state.loading = true; state.error = null; })
      .addCase(googleInstructorAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleInstructorAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Google authentication failed";
      });
  },
});

export const {
  logoutInstructor,
  clearInstructorError,
  setInstructorRequiresVerification,
  clearInstructorVerificationState,
} = instructorAuthSlice.actions;
export default instructorAuthSlice.reducer;
