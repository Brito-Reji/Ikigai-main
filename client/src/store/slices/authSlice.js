import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig.js";

// login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      let endpoint;
      if (role === "instructor") {
        endpoint = "/auth/instructor/signin";
      } else if (role === "admin") {
        endpoint = "/auth/admin/login";
      } else {
        endpoint = "/auth/student/login";
      }
      const response = await api.post(endpoint, { email, password });

      if (response.data.success) {
        const accessToken = response.data.accessToken;
        const tokenKey = role === "admin" ? "adminAccessToken" : "accessToken";
        if (typeof accessToken === "object") {
          localStorage.setItem(
            tokenKey,
            accessToken.accessToken || JSON.stringify(accessToken)
          );
        } else {
          localStorage.setItem(tokenKey, accessToken);
        }
        sessionStorage.removeItem("refreshFailed");
        return {
          user: response.data.user || { email, role },
          accessToken: accessToken,
          role,
        };
      } else {
        return rejectWithValue({
          message: response.data?.message || "Login failed",
        });
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

      if (
        error.response?.data?.isBlocked ||
        error.response?.data?.message?.toLowerCase().includes("blocked")
      ) {
        return rejectWithValue({
          message:
            error.response?.data?.message || "Your account has been blocked",
          isBlocked: true,
        });
      }

      return rejectWithValue({
        message: error.response?.data?.message || "Login failed",
      });
    }
  }
);

// register
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
      return rejectWithValue({
        message: response.data?.message || "Registration failed",
      });
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "Registration failed",
      });
    }
  }
);

// verify otp
export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", { email, otp });

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.removeItem("refreshFailed");
        return {
          message: response.data.message,
          verified: true,
          accessToken: response.data.accessToken,
          user: response.data.user || null,
        };
      }
      return rejectWithValue({
        message: response.data?.message || "OTP verification failed",
      });
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.message || "OTP verification failed",
      });
    }
  }
);

// refresh token
export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/refresh");
      if (response.data.success && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        return response.data.accessToken;
      } else {
        return rejectWithValue({
          message: "Failed to refresh token",
        });
      }
    } catch (error) {
      localStorage.removeItem("accessToken");
      return rejectWithValue({
        message: "Failed to refresh token",
      });
    }
  }
);

// fetch current user
export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/me");
      if (response.data.success && response.data.user) {
        if (response.data.user.isBlocked) {
          localStorage.removeItem("accessToken");
          return rejectWithValue({
            message: "Your account has been blocked. Please contact support.",
            isBlocked: true,
          });
        }
        return response.data.user;
      } else {
        return rejectWithValue({
          message: "Failed to fetch user data",
        });
      }
    } catch (error) {
      if (error.response?.data?.isBlocked) {
        localStorage.removeItem("accessToken");
        return rejectWithValue({
          message:
            error.response.data.message || "Your account has been blocked.",
          isBlocked: true,
        });
      }

      return rejectWithValue({
        message: "Failed to fetch user data",
        shouldRetry: error.response?.status === 401,
      });
    }
  }
);

// google auth
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
        const accessToken = response.data.accessToken;
        localStorage.setItem("accessToken", accessToken);
        sessionStorage.removeItem("refreshFailed");
        return {
          user: response.data.user || { role },
          token: accessToken,
          role,
        };
      }
      return rejectWithValue({
        message: "Google authentication failed",
      });
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
  accessToken: localStorage.getItem("accessToken"),
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
    logout: state => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.requiresVerification = false;
      state.verificationEmail = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("userAuth");

      api.post("/auth/logout").catch(() => {});
    },
    clearError: state => {
      state.error = null;
    },
    setRequiresVerification: (state, action) => {
      state.requiresVerification = true;
      state.verificationEmail = action.payload.email;
    },
    clearVerificationState: state => {
      state.requiresVerification = false;
      state.verificationEmail = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        state.requiresVerification = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
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

      .addCase(registerUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (action.payload?.requiresVerification) {
          state.requiresVerification = true;
          state.verificationEmail = action.payload.email;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      .addCase(verifyOTP.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.loading = false;
        state.requiresVerification = false;
        state.verificationEmail = null;
        state.error = null;
        state.isAuthenticated = true;
        state.accessToken =
          action.payload.accessToken || localStorage.getItem("accessToken");
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "OTP verification failed";
      })

      .addCase(refreshAccessToken.pending, state => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
      })
      .addCase(refreshAccessToken.rejected, state => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      })

      .addCase(fetchCurrentUser.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        if (!action.payload?.shouldRetry) {
          state.user = null;
          state.isAuthenticated = false;
          state.accessToken = null;
          localStorage.removeItem("accessToken");
        }
      })

      .addCase(googleAuth.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(googleAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Google authentication failed";
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
